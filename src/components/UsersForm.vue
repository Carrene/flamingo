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
        >User Name</label>
        <input
          type="text"
          class="light-primary-input disabled"
          readonly
        >
      </div>

      <div class="input-container">
        <label
          for="fullName"
          class="label"
        >Full Name</label>
        <input
          type="text"
          class="light-primary-input disabled"
          readonly
        >
      </div>
      <div class="input-container">
        <label
          for="email"
          class="label"
        >Email</label>
        <input
          type="text"
          class="light-primary-input disabled"
          readonly
        >
      </div>
      <div class="input-container">
        <label
          for="skills"
          class="label"
        >Skills</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div>
      <div class="input-container">
        <label
          for="group"
          class="label"
        >Group</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div>
    </div>

  </form>
</template>

<script>
const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
)
export default {
  name: 'UsersForm',
  data () {
    return {
    }
  },
  props: {
    selectedUser: Object
  },
  components: {
    ProfilePicture
  }
}
</script>
