<template>
  <div class="header">
    <div class="color">
      <div class="orange"></div>
      <div class="purple"></div>
      <div class="yellow"></div>
      <div class="blue"></div>
      <div class="red"></div>
      <div class="green"></div>
      <div class="black"></div>
    </div>
    <div class="main">
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
        <img src="../assets/Notification.svg" class="notification icon"/>
      </div>
      <div class="profile">
        <p class="name">hadis salehi</p>
        <img src="../assets/ChevronDown.svg" class="chevron-down"/>
        <img src="../assets/abstract-logo.png" class="profile-pic"/>
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
