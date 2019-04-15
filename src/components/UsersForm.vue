<template>
  <form id="usersForm">

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        @click="update"
      >Save</button>
    </div>

    <loading v-if="loading" />

    <div
      class="content"
      v-if="!loading"
    >
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
      <!-- FIXME: NOT IMPLEMENTED YET -->

      <!-- <div class="input-container">
        <label
          :for="memberMetadata.fields.skillId.label"
          class="label"
          :class="{error: $v.user.skillId.$error}"
        >{{ memberMetadata.fields.skillId.label }}</label>
        <v-select
          :options="computedListOfSkills"
          label="title"
          index="id"
          :clearable="!$v.user.skillId.required"
          v-model="currentSelectedSkills"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.user.skillId"
          :metadata="memberMetadata.fields.title"
        />
      </div> -->

      <!-- <div class="input-container">
        <label
          :for="memberMetadata.fields.group.label"
          class="label"
          :class="{error: $v.user.group.$error}"
        >Group</label>
        <input
          type="text"
          class="light-primary-input"
          @input="$v.user.group.$touch"
          @focus="$v.user.group.$reset"
          :class="{error: $v.user.group.$error}"
        >
        <validation-message
          :validation="$v.group.title"
          :metadata="memberMetadata.fields.title"
        />
      </div> -->
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
import { mapState } from 'vuex'
import { updateModel } from './../helpers.js'
import { mixin as clickout } from 'vue-clickout'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
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
      status: null,
      nugget: null,
      message: null,
      loading: false

    }
  },
  validations () {
    return {
      user: {
        skillId: this.memberMetadata.fields.skillId.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Member',
      'Member',
      'skills'
    ]),
    userChanged () {
      return this.user.__status__ === 'dirty' || this.skillsChanged
    },
    skillsChanged () {
      let initialSkills = [...this.initialSkills].sort()
      let currentSelectedSkills = [...this.currentSelectedSkills].sort()
      return JSON.stringify(initialSkills) !== JSON.stringify(currentSelectedSkills)
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
    }
  },
  props: {
    selectedUser: Object,
    users: Array
  },
  methods: {
    // FIXME: NOT IMPLEMENTED YET
    // async getSelectedUser () {
    //   this.loading = false
    //   let response = await this.Member.get(this.selectedUser.id).send()
    //   this.user = response.models[0]
    //   this.initialSkills = this.user.skills.map(skill => skill.id)
    //   this.currentSelectedSkills = [...this.initialSkills]
    //   this.loading = false
    // },
    async update () {
      this.loading = true
      let jsonPatchRequest = server.jsonPatchRequest(this.Member.__url__)
      for (let skill of this.skills) {
        if (this.initialSkills.includes(skill.id) && !this.currentSelectedSkills.includes(skill.id)) {
          jsonPatchRequest.addRequest(this.user.denySkill(this.user.id, skill.id))
        } else if (!this.initialSkills.includes(skill.id) && this.currentSelectedSkills.includes(skill.id)) {
          jsonPatchRequest.addRequest(this.user.grantSkill(this.user.id, skill.id))
        }
      }
      jsonPatchRequest.addRequest(this.user.save())
      jsonPatchRequest.send().then(async (resp) => {
        this.status = resp.status
        this.message = 'User was updated.'
        await updateModel(this.users, this.user)
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        this.message = resp.error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).finally(() => {
        this.loading = false
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  watch: {
    'selectedUser': {
      immediate: true,
      handler (newValue) {
        this.user = new this.Member(newValue)
        // FIXME: NOT IMPLEMENTED YET
        // this.initialSkills = this.user.skillId.map(skill => skill.id)
        // this.currentSelectedSkills = [...this.initialSkills]
      }
    }
  },
  mounted () {
    // FIXME: NOT IMPLEMENTED YET
    // this.getSelectedUser()
  },
  components: {
    Loading,
    ValidationMessage,
    ProfilePicture,
    Snackbar
  }
}
</script>
