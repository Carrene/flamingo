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
          :for="memberMetadata.fields.name.label"
          class="label"
        >{{ memberMetadata.fields.name.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.name"
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
          :for="memberMetadata.fields.skills.label"
          class="label"
          :class="{error: $v.user.skills.$error}"
        >{{ memberMetadata.fields.skills.label }}</label>
        <v-select
          :options="computedListOfSkills"
          label="title"
          index="id"
          v-model="currentSelectedSkills"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.user.skills"
          :metadata="memberMetadata.fields.skills"
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
      currentSelectedSkills: [],
      initialSkills: [],
      currentSelectedGroups: [],
      initialGroups: [],
      status: null,
      message: null
    }
  },
  validations () {
    return {
      user: {
        skills: this.memberMetadata.fields.skills.createValidator(),
        groups: this.memberMetadata.fields.groups.createValidator()

      }
    }
  },
  computed: {
    ...mapState([
      'Member',
      'Member',
      'skills',
      'groups'
    ]),
    userChanged () {
      return this.user.__status__ === 'dirty' || this.skillsChanged || this.groupsChanged
    },
    skillsChanged () {
      let initialSkills = [...this.initialSkills].sort()
      let currentSelectedSkills = [...this.currentSelectedSkills].sort()
      return JSON.stringify(initialSkills) !== JSON.stringify(currentSelectedSkills)
    },
    groupsChanged () {
      let initialGroups = [...this.initialGroups].sort()
      let currentSelectedGroups = [...this.currentSelectedGroups].sort()
      return JSON.stringify(initialGroups) !== JSON.stringify(currentSelectedGroups)
    },
    computedListOfSkills () {
      let unselectedSkills = []
      let selectedSkills = []
      for (let skill of this.skills) {
        if (this.currentSelectedSkills.includes(skill.id)) {
          selectedSkills.push(skill)
        } else {
          unselectedSkills.push(skill)
        }
      }
      return unselectedSkills.concat(selectedSkills)
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
      for (let skill of this.skills) {
        if (this.initialSkills.includes(skill.id) && !this.currentSelectedSkills.includes(skill.id)) {
          jsonPatchRequest.addRequest(this.user.denySkill(this.user.id, skill.id))
        } else if (!this.initialSkills.includes(skill.id) && this.currentSelectedSkills.includes(skill.id)) {
          jsonPatchRequest.addRequest(this.user.grantSkill(this.user.id, skill.id))
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
        this.initialSkills = this.user.skills.map(skill => skill.id)
        this.currentSelectedSkills = [...this.initialSkills]
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
