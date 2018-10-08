<template>
  <div id="login">
    <div class="header">
      <img src="../assets/maestro-logo-light.svg">
      <h1>MAESTRO</h1>
      <p class="tabs">Home</p>
      <p class="tabs">Services</p>
      <p class="tabs">Support</p>
      <p class="tabs">Help</p>
    </div>
    <div class="body">
      <div class="button-container">
        <div class="text">
          <p class="hello">Hello!</p>
          <p class="welcome">Welcome to</p>
          <p class="maestro"> MAESTRO</p>
          <p class="message">LET'S EXPLORE THE WORLD</p>
        </div>
        <button type="button" @click="showPopup = true">Sign in</button>
      </div>
      <img src="../assets/new-project-picture.svg">
    </div>
    <p class="footer">
      © 2018 Maestro, Inc. All Rights Reserved.
    </p>
    <div class="popup" v-if="showPopup">
      <div class="popup-box">
        <img src="../assets/close.svg" class="close" @click="showPopup = false">
        <img src="../assets/maestro-login.svg" class="logo">
        <button type="button">
          <img src="../assets/cas-logo.svg">
          <span>SIGN IN WITH CAS</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      showPopup: false
    }
  }
}
</script>
