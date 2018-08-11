<template>
  <div class="header">
    <div class="color-line">
      <div class="orange"></div>
      <div class="purple"></div>
      <div class="yellow"></div>
      <div class="blue"></div>
      <div class="red"></div>
      <div class="green"></div>
      <div class="black"></div>
    </div>
    <div class="toolbar">
      <div class="logo">
        <img src="../assets/abstract-logo.png" class="logo-img"/>
        <p>maestro</p>
      </div>
      <div class="search">
        <img src="../assets/Search.svg" class="search-icon"/>
        <p>Search</p>
      </div>
      <div class="menu">
        <img src="../assets/Dashboard.svg" class="dashboard icon"/>
        <img src="../assets/Chat.svg" class="chat icon"/>
        <img src="../assets/Notification Icon.svg" class="notification icon"/>
      </div>
      <div class="profile">
        <p class="username">Username</p>
        <img src="../assets/ChevronDown.svg" class="chevron-down"/>
        <img src="../assets/Profile avatar.svg" class="profile-pic"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',
  data () {
    return {
    }
  }
}
</script>
