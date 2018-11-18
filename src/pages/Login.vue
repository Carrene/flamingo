<template>
  <div id="login">
    <div class="header">
      <div class="logo-project">
        <img src="../assets/maestro-light.svg">
        <h1>MAESTRO</h1>
      </div>
      <p class="tabs">Why Maestro?</p>
      <p class="tabs">Services</p>
      <p class="tabs">Support</p>
      <p class="tabs">Help</p>
      <button type="button" class="light-primary-button small" @click="login">Log in</button>
    </div>
    <div class="body">
      <div class="button-project">
        <div class="text">
          <p>Hello!</p>
          <p class="welcome">Welcome to <span>MAESTRO</span></p>
          <p class="message">LET'S EXPLORE THE WORLD</p>
        </div>
        <button type="button" @click="signup">Get started</button>
      </div>
      <img src="../assets/login-picture.svg">
    </div>
    <p class="footer">
      © 2018 Maestro, Inc. All Rights Reserved.
    </p>
  </div>
</template>

<script>
import { SCOPES, APPLICATION_ID, CAS_FRONTEND_BASE_URL } from '../settings'

export default {
  name: 'Login',
  data () {
    return {
    }
  },
  methods: {
    redirect (start) {
      let redirect = new URL(window.location.href).searchParams.get('redirectUri') || window.location.origin
      let url = new URL(`${CAS_FRONTEND_BASE_URL}/permissions`)
      url.searchParams.set('applicationId', APPLICATION_ID)
      url.searchParams.set('scopes', SCOPES.join(','))
      url.searchParams.set('redirectUri', encodeURI(redirect))
      if (start) {
        url.searchParams.set('start', true)
      }
      window.location.assign(url.href)
    },
    signup () {
      this.redirect(true)
    },
    login () {
      this.redirect(false)
    }
  }
}
</script>
