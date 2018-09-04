<template>
  <div id="header" v-if="authenticated">
    <div class="entity"><p>{{ entity }}</p></div>
    <div class="search">
      <img src="../assets/search-icon.svg" class="search-icon"/>
      <input type="text" placeholder="SEARCH" class="primary-input">
      <div :class="notification ? 'notification' : null">
        <img src="../assets/notification-icon.svg" class="notification-icon"/>
      </div>
    </div>
    <div class="profile">
      <p class="username">{{ username }}</p>
      <div class="avatar" >
        <img src="../assets/avatar.svg" class="pic online"/>
        <img src="../assets/admin-icon.svg" class="role-icon" v-if="role === 'admin'"/>
        <img src="../assets/manager-icon.svg" class="role-icon" v-else-if="role === 'manager'"/>
        <img src="../assets/guest-icon.svg" class="role-icon" v-else-if="role === 'guest'"/>
        <img src="../assets/resource-icon.svg" class="role-icon" v-else-if="role === 'resource'"/>
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
      // TODO: Change all data to dynamic
      authenticated: true,
      notification: true,
      username: 'Username',
      role: 'admin',
      entity: 'Projects'
    }
  }
}
</script>
