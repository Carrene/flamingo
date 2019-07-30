<template>
  <form id="usersForm">

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        @click="update"
      >Save</button>
    </div>

    <div class="content">
      <profile-picture
        class="profile-picture"
        :picture="user.avatar"
      />

      <div class="input-container">
        <label
          :for="memberMetadata.fields.title.label"
          class="label"
        >{{ memberMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.title"
          readonly
        >
      </div>

      <div class="input-container">
        <label
          :for="memberMetadata.fields.firstName.label"
          class="label"
        >{{ memberMetadata.fields.firstName.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.firstName"
          readonly
        >
      </div>

      <div class="input-container">
        <label
          :for="memberMetadata.fields.lastName.label"
          class="label"
        >{{ memberMetadata.fields.lastName.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.lastName"
          readonly
        >
      </div>
      <div class="input-container">
        <label
          :for="memberMetadata.fields.email.label"
          class="label"
        >{{ memberMetadata.fields.email.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.email"
          readonly
        >
      </div>

      <div class="input-container">
        <label
          :for="memberMetadata.fields.specialties.label"
          class="label"
          :class="{error: $v.user.specialties.$error}"
        >{{ memberMetadata.fields.specialties.label }}</label>
        <v-select
          :options="computedListOfSpecialties"
          label="title"
          index="id"
          v-model="currentSelectedSpecialties"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.user.specialties"
          :metadata="memberMetadata.fields.specialties"
        />
      </div>

      <div class="input-container">
        <label
          :for="memberMetadata.fields.groups.label"
          class="label"
          :class="{error: $v.user.groups.$error}"
        >{{ memberMetadata.fields.groups.label }}</label>
        <v-select
          :options="computedListOfGroups"
          label="title"
          index="id"
          :clearable="!$v.user.groups.required"
          v-model="currentSelectedGroups"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.user.groups"
          :metadata="memberMetadata.fields.groups"
        />
      </div>

      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>

  </form>
</template>

<script>
import server from '../server'
import { mapState, mapMutations, mapActions } from 'vuex'
import { updateModel } from './../helpers.js'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
)

const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)

export default {
  mixins: [clickout],
  name: 'UsersForm',
  data () {
    return {
      user: null,
      memberMetadata: server.metadata.models.Member,
      currentSelectedSpecialties: [],
      initialSpecialties: [],
      currentSelectedGroups: [],
      initialGroups: [],
      status: null,
      message: null
    }
  },
  validations () {
    return {
      user: {
        specialties: this.memberMetadata.fields.specialties.createValidator(),
        groups: this.memberMetadata.fields.groups.createValidator()

      }
    }
  },
  computed: {
    ...mapState([
      'Member',
      'Member',
      'specialties',
      'groups'
    ]),
    userChanged () {
      return this.user.__status__ === 'dirty' || this.specialtiesChanged || this.groupsChanged
    },
    specialtiesChanged () {
      let initialSpecialties = [...this.initialSpecialties].sort()
      let currentSelectedSpecialties = [...this.currentSelectedSpecialties].sort()
      return JSON.stringify(initialSpecialties) !== JSON.stringify(currentSelectedSpecialties)
    },
    groupsChanged () {
      let initialGroups = [...this.initialGroups].sort()
      let currentSelectedGroups = [...this.currentSelectedGroups].sort()
      return JSON.stringify(initialGroups) !== JSON.stringify(currentSelectedGroups)
    },
    computedListOfSpecialties () {
      let unselectedSpecialties = []
      let selectedSpecialties = []
      for (let specialty of this.specialties) {
        if (this.currentSelectedSpecialties.includes(specialty.id)) {
          selectedSpecialties.push(specialty)
        } else {
          unselectedSpecialties.push(specialty)
        }
      }
      return unselectedSpecialties.concat(selectedSpecialties)
    },
    computedListOfGroups () {
      let unselectedGroups = []
      let selectedGroups = []
      for (let group of this.groups) {
        if (this.currentSelectedGroups.includes(group.id)) {
          selectedGroups.push(group)
        } else {
          unselectedGroups.push(group)
        }
      }
      return unselectedGroups.concat(selectedGroups)
    }
  },
  props: {
    selectedUser: Object,
    users: Array
  },
  methods: {
    async update () {
      this.setGlobalLoading(true)
      let jsonPatchRequest = server.jsonPatchRequest('/')
      for (let specialty of this.specialties) {
        if (this.initialSpecialties.includes(specialty.id) && !this.currentSelectedSpecialties.includes(specialty.id)) {
          jsonPatchRequest.addRequest(this.user.denySpecialty(this.user.id, specialty.id))
        } else if (!this.initialSpecialties.includes(specialty.id) && this.currentSelectedSpecialties.includes(specialty.id)) {
          jsonPatchRequest.addRequest(this.user.grantSpecialty(this.user.id, specialty.id))
        }
      }
      for (let group of this.groups) {
        if (this.initialGroups.includes(group.id) && !this.currentSelectedGroups.includes(group.id)) {
          jsonPatchRequest.addRequest(this.user.removeFromGroup(group.id))
        } else if (!this.initialGroups.includes(group.id) && this.currentSelectedGroups.includes(group.id)) {
          jsonPatchRequest.addRequest(this.user.addToGroup(group.id))
        }
      }
      jsonPatchRequest.send().then(async (resps) => {
        this.status = resps[0].status
        this.message = 'User was updated.'
        await updateModel(this.users, this.user)
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).catch(resps => {
        this.status = resps[0].status
        this.message = resps[0].error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).finally(async () => {
        await this.listMyGroups()
        this.setGlobalLoading(false)
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapMutations([
      'setGlobalLoading'
    ]),
    ...mapActions([
      'listMyGroups'
    ])
  },
  watch: {
    'selectedUser': {
      immediate: true,
      handler (newValue) {
        this.user = new this.Member(newValue)
        this.initialSpecialties = this.user.specialties.map(specialty => specialty.id)
        this.currentSelectedSpecialties = [...this.initialSpecialties]
        this.initialGroups = this.user.groups.map(group => group.id)
        this.currentSelectedGroups = [...this.initialGroups]
      }
    }
  },
  components: {
    ValidationMessage,
    ProfilePicture,
    Snackbar
  }
}
</script>
