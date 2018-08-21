<template>
  <div class="header">
    <div class="entity"><p>{{ entity }}</p></div>
    <div class="search">
      <img src="../assets/search-icon.svg" class="search-icon"/>
      <input type="text" placeholder="search" class="input">
      <div :class="notification ? 'notification' : null">
        <img src="../assets/NotificationIcon.svg" class="notification-icon"/>
      </div>
    </div>
    <div class="profile">
      <p class="username">{{ username }}</p>
      <div class="profile-pic">
        <img src="../assets/default-profile-image.svg" class="pic "/>
        <img src="../assets/admin-icon-shield-group.svg" class="role-icon" v-if="role === 'admin'"/>
        <img src="../assets/manager-icon-tie-group.svg" class="role-icon" v-if="role === 'manager'"/>
        <img src="../assets/guest-icon-eye-group.svg" class="role-icon" v-if="role === 'guest'"/>
        <img src="../assets/resource-icon-device-group.svg" class="role-icon" v-if="role === 'resource'"/>
      </div>
      <p class="role">{{ role }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',
  data () {
    return {
      notification: false,
      username: 'shirin eghrari ss',
      role: 'admin',
      entity: 'Project'
    }
  }
}
</script>
