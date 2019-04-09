<template>
  <form id="usersForm">

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        :disabled="$v.user.$invalid"
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
        <input
          type="text"
          class="light-primary-input"
          @input="$v.user.skillId.$touch"
          @focus="$v.user.skillId.$reset"
          :class="{error: $v.user.skillId.$error}"
        >
        <validation-message
          :validation="$v.skillId.title"
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
      organizationMemberMetadata: server.metadata.models.OrganizationMember
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
      'OrganizationMember'
    ])
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
    //   this.loading = false
    // }
  },
  beforeMount () {
    this.user = new this.OrganizationMember()
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
