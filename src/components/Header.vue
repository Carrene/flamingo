<template>
  <div class="header">
    <div class="logo"><img src="../assets/MaestroLogo.svg" class="logo-icon"/></div>
    <div class="project"><p>Project</p></div>
    <div class="search">
      <img src="../assets/Search.svg" class="search-icon"/>
      <input type="text" placeholder="search" class="input">
    </div>
    <div class="notification"><img src="../assets/NotificationIcon.svg"/> </div>
    <div class="profile">profile</div>
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
