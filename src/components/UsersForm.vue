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
          :for="organizationMemberMetadata.fields.title.label"
          class="label"
        >{{ organizationMemberMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.title"
          readonly
        >
      </div>

      <div class="input-container">
        <label
          :for="organizationMemberMetadata.fields.name.label"
          class="label"
        >{{ organizationMemberMetadata.fields.name.label }}</label>
        <input
          type="text"
          class="light-primary-input disabled"
          v-model="user.name"
          readonly
        >
      </div>
      <div class="input-container">
        <label
          :for="organizationMemberMetadata.fields.email.label"
          class="label"
        >{{ organizationMemberMetadata.fields.email.label }}</label>
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
          :for="organizationMemberMetadata.fields.skillId.label"
          class="label"
          :class="{error: $v.user.skillId.$error}"
        >{{ organizationMemberMetadata.fields.skillId.label }}</label>
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
          :metadata="organizationMemberMetadata.fields.title"
        />
      </div> -->

      <!-- <div class="input-container">
        <label
          :for="organizationMemberMetadata.fields.group.label"
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
          :metadata="organizationMemberMetadata.fields.title"
        />
      </div> -->
    </div>

  </form>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
)
export default {
  name: 'UsersForm',
  data () {
    return {
      user: null,
      organizationMemberMetadata: server.metadata.models.OrganizationMember,
      currentSelectedSkills: [],
      initialSkills: []

    }
  },
  validations () {
    return {
      user: {
        skillId: this.organizationMemberMetadata.fields.skillId.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'OrganizationMember',
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
    selectedUser: Object
  },
  methods: {
    // FIXME: NOT IMPLEMENTED YET
    // async getSelectedUser () {
    //   this.loading = false
    //   let response = await this.OrganizationMember.get(this.selectedUser.id).send()
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
    }
  },
  watch: {
    'selectedUser': {
      // deep: true,
      immediate: true,
      handler (newValue) {
        this.user = new this.OrganizationMember(newValue)
        // FIXME: NOT IMPLEMENTED YET
        // this.initialSkills = this.user.skillId.map(skill => skill.id)
        // this.currentSelectedSkills = [...this.initialSkills]
      }
    }
  },
  mounted () {
    // this.getSelectedUser()
  },
  components: {
    Loading,
    ValidationMessage,
    ProfilePicture
  }
}
</script>
