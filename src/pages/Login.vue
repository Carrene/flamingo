<template>
  <div id="login">
    <div class="body">
      <div class="logo">
        <img src="./../assets/abstract-logo.svg" alt="Maestro" class="logo-img">
        <p class="logo-title">Maestro</p>
      </div>
      <form @submit.prevent="login" class="information">
        <div class="username-container">
          <input
            type="text"
            placeholder="email (Case sensitive)"
            class="email input"
            :class="$v.credentials.email.$error ? 'error' : null"
            v-model="credentials.email"
            @blur="$v.credentials.email.$touch"
            @focus="$v.credentials.email.$reset"
          >
          <div class="validation-error" v-if="$v.credentials.email.$error">
            <p v-if="!$v.credentials.email.required">This value is required.</p>
          </div>
        </div>
        <div class="password-container">
          <div class="password-field">
            <input
              placeholder="Password (Case sensitive)"
              class="password input"
              :type="passwordFieldType"
              :class="$v.credentials.password.$error ? 'error' : null"
              v-model="credentials.password"
              @blur="$v.credentials.password.$touch"
              @focus="$v.credentials.password.$reset"
            >
            <img
              src="../assets/visible.svg"
              v-if="passwordFieldType === 'password'"
              class="visible-icon"
              @click="toggleVisibility"
            >
            <img
              src="../assets/invisible.svg"
              v-if="passwordFieldType === 'text'"
              class="visible-icon"
              @click="toggleVisibility"
            >
          </div>
          <div class="validation-error" v-if="$v.credentials.password.$error">
            <p v-if="!$v.credentials.password.required">This value is required.</p>
          </div>
        </div>
        <div class="actions">
          <router-link to="forget_password" class="link">Forgot Password?</router-link>
          <button
            type="submit"
            class="login-button"
            :disabled="$v.credentials.$error"
          >
            Log in
          </button>
        </div>
      </form>
      <div class="login-mode">
        <p class="title">Or login with</p>
        <div class="login-mode-icons">
          <img src="./../assets/carrene-logo.svg" alt="Carrene" class="carrene-icon">
          <p>Carrene</p>
        </div>
        <div class="login-mode-icons">
          <img src="./../assets/google-logo.svg" alt="Google" class="google-icon">
          <p>Google</p>
        </div>
        <div class="login-mode-icons">
          <img src="./../assets/github-logo.svg" alt="Github" class="github-icon">
          <p>Github</p>
        </div>
      </div>
      <p class="register">
        Not registered yet? create account
        <router-link to="signup" class="link">here</router-link>
      </p>
     </div>
    <div class="response-error" v-if="showErrorBox">
        <p>Oops, something happened ...</p>
        <img src="./../assets/close.svg" alt="close" class="close-icon" @click="resetForm">
        <p class="error">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { server, casServer } from './../server'

export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        email: null,
        password: null
      },
      showErrorBox: false,
      passwordFieldType: 'password',
      status: null
    }
  },
  validations: {
    credentials: {
      email: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    login () {
      casServer.login(this.credentials.email, this.credentials.password).then(token => {
        server.authenticator.token = token
        this.$router.push('/')
      })
    },
    toggleVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    resetForm () {
      this.showErrorBox = false
      this.credentials.password = null
      this.status = null
      this.$v.credentials.password.$reset()
    }
  }
}
</script>
