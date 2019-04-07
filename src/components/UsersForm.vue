<template>
  <form id="usersForm">

    <div class="header">
      <button
        type="button"
        class="secondary-button small disabled"
      >Save</button>
    </div>

    <div class="content">
      <profile-picture class="profile-picture" />

      <div class="input-container">
        <label
          for="userName"
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
          for="fullName"
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
          for="email"
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
          for="skills"
          class="label"
        >{{ memberMetadata.fields.skillId.label }}</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div> -->
      <!-- <div class="input-container">
        <label
          for="group"
          class="label"
        >Group</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div> -->
    </div>

  </form>
</template>

<script>
import server from '../server'

const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
)
export default {
  name: 'UsersForm',
  data () {
    return {
      user: null,
      memberMetadata: server.metadata.models.OrganizationMember
    }
  },
  props: {
    selectedUser: Object
  },
  watch: {
    'selectedUser' (newValue) {
      this.user = newValue
    }
  },
  components: {
    ProfilePicture
  }
}
</script>
