<template>
  <div class="login">
    <div class="body">
      <div class="logo">
        <img src="./../assets/abstract-logo.png" alt="Maestro" class="logo-img">
        <p class="logo-title">Maestro</p>
      </div>
      <form @submit.prevent="login" class="information">
        <div class="username-container">
          <input
            type="text"
            placeholder="Username (Case sensitive)"
            class="email input"
            :class="$v.credentials.username.$error ? 'error' : null"
            v-model="credentials.username"
            @blur="$v.credentials.username.$touch"
            @focus="$v.credentials.username.$reset"
          >
          <div class="validation-error" v-if="$v.credentials.username.$error">
            <p v-if="!$v.credentials.username.required">This value is required.</p>
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
              src="../assets/View.svg"
              v-if="passwordFieldType === 'password'"
              class="visible-icon"
              @click="toggleVisibility"
            >
            <img
              src="../assets/View off.svg"
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
          <img src="./../assets/Carrene.logo.png" alt="Carrene" class="carrene-icon">
          <p>Carrene</p>
        </div>
        <div class="login-mode-icons">
          <img src="./../assets/Google.logo.png" alt="Google" class="google-icon">
          <p>Google</p>
        </div>
        <div class="login-mode-icons">
          <img src="./../assets/Github.logo.png" alt="Github" class="github-icon">
          <p>Github</p>
        </div>
      </div>
      <p class="register">
        Not registered yet? create account
        <router-link to="signup" class="link">here</router-link>
      </p>
     </div>
    <div class="response-error" v-if="showErrorBox === true">
        <p>Oops, something happened ...</p>
        <img src="./../assets/close.svg" alt="close" class="close-icon" @click="showErrorBox = false">
        <p class="error">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        username: null,
        password: null
      },
      showErrorBox: false,
      passwordFieldType: 'password'
    }
  },
  validations: {
    credentials: {
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    toggleVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    login () {
    }
  }
}
</script>
