<template>
  <div id="login">
    <div class="header">
      <div class="logo-container">
        <img src="../assets/maestro-logo-light.svg">
        <h1>MAESTRO</h1>
      </div>
      <p class="tabs">Home</p>
      <p class="tabs">Services</p>
      <p class="tabs">Support</p>
      <p class="tabs">Help</p>
    </div>
    <div class="body">
      <div class="button-container">
        <div class="text">
          <p>Hello!</p>
          <p class="welcome">Welcome to <span>MAESTRO</span></p>
          <p class="message">LET'S EXPLORE THE WORLD</p>
        </div>
        <button type="button" @click="showPopup = true">Sign in</button>
      </div>
      <img src="../assets/login-picture.svg">
    </div>
    <p class="footer">
      © 2018 Maestro, Inc. All Rights Reserved.
    </p>
    <div class="popup" v-if="showPopup">
      <div class="popup-box">
        <img src="../assets/close.svg" class="close" @click="showPopup = false">
        <img src="../assets/maestro-login.svg" class="logo">
        <button type="button" @click="goToCAS">
          <img src="../assets/cas-logo.svg">
          <span>SIGN IN WITH CAS</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SCOPES, APPLICATION_ID, CAS_BASE_URL } from '../settings'

export default {
  name: 'Login',
  data () {
    return {
      showPopup: false
    }
  },
  methods: {
    goToCAS () {
      let redirect = new URL(window.location.href).searchParams.get('redirect') || window.location.origin
      let url = new URL(`${CAS_BASE_URL}/permissions`)
      url.searchParams.set('applicationId', APPLICATION_ID)
      url.searchParams.set('scopes', SCOPES.join(','))
      url.searchParams.set('redirect', encodeURI(redirect))
      window.location.assign(url.href)
    }
  }
}
</script>
