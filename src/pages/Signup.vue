<template>
  <div class="signup">

  <!--Show response error  -->

    <div class="response-error" v-if="showResponseError">
      <p>Oops, something happened ...</p>
      <img src="./../assets/Close.svg" alt="close" class="close-icon" @click="resetForm">
      <p class="error">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
    </div>

  <!-- STEP 2 -->

    <div class="step-2" v-if="step === 2">
      <div class="logo">
        <img class="logo-image" src="../assets/AbstractLogo.svg"/>
        <p>Maestro</p>
      </div>
      <form class="information" @submit.prevent="signUp">
        <div class="username-container">
          <input class="input"
                 type="text"
                 placeholder="username (Case sensitive)"
                 v-model="credentials.username"
                 @blur="$v.credentials.username.$touch"
                 @focus="$v.credentials.username.$reset"
                 :class="[$v.credentials.username.$error ? 'error' : null,
                 !$v.credentials.username.$invalid && $v.credentials.username.$dirty ? 'success' : null]"
          />
          <div class="validation-error" v-if="$v.credentials.username.$error">
            <span v-if="!$v.credentials.username.required">username is required</span>
          </div>
        </div>
        <div class="password-container">
          <div class="password-field">
            <input
              class="input password-input"
              :type="passwordFieldType"
              placeholder="Password (Case sensitive)"
              v-model="credentials.password"
              :class="[$v.credentials.password.$error ? 'error' : null,
              !$v.credentials.password.$invalid && $v.credentials.password.$dirty ? 'success' : null]"
              @blur="$v.credentials.password.$touch"
              @focus="$v.credentials.password.$reset"
            />
            <img
              class="view-icon"
              src="../assets/Visible.svg"
              @click="toggleVisibility"
              v-if="passwordFieldType === 'password'"
            >
            <img
              class="view-icon"
              src="../assets/Invisible.svg"
              @click="toggleVisibility"
              v-if="passwordFieldType === 'text'"
            >
          </div>
          <div class="validation-error" v-if="$v.credentials.password.$error">
            <span v-if="!$v.credentials.password.required">Password is required</span>
          </div>
        </div>
        <div class="phone-number-container">
          <div class="code-field">
            <input class="input code" type="text" value="+98" readonly/>
            <img class="arrow-icon" src="../assets/ChevronDown.svg"/>
          </div>
          <input
            class="input"
            type="number"
            placeholder="Your Phone number(optional)"
            v-model="credentials.phoneNumber"
            :class="[$v.credentials.phoneNumber.$error ? 'error' : null,
              !$v.credentials.phoneNumber.$invalid && $v.credentials.phoneNumber.$dirty ? 'success' : null]"
            @blur="$v.credentials.phoneNumber.$touch"
            @focus="$v.credentials.phoneNumber.$reset"
          />
          <div class="validation-error" v-if="$v.credentials.phoneNumber.$error">
            <span v-if="!$v.credentials.phoneNumber.pattern">Invalid phone number!</span>
          </div>
        </div>
        <button class="signup-button" :disabled="$v.credentials.$invalid">Sign up</button>
      </form>
      <div class="login-mode">
        <p class="title">Or login with</p>
        <div class="login-mode-icons">
          <div class="carrene-icon">
            <img src="../assets/CarreneLogo.svg"/>
            <p>Carrene</p>
          </div>
          <div class="google-icon">
            <img src="../assets/GoogleLogo.svg"/>
            <p>Google</p>
          </div>
          <div class="github-icon">
            <img src="../assets/GithubLogo.svg"/>
            <p>Github</p>
          </div>
        </div>
      </div>
      <div class="question">
        <p>Are you already registered?
        <router-link class="link" to="">Log in</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'signup',
  data () {
    return {
      credentials: {
        username: null,
        password: null,
        phoneNumber: null
      },
      step: 2,
      passwordFieldType: 'password',
      showResponseError: true
    }
  },
  validations: {
    credentials: {
      username: {
        required
      },
      password: {
        required
      },
      phoneNumber: {
        pattern: (value) => {
          if (typeof value === 'undefined' || value === null || value === '') {
            return true
          }
          return /^9\d{9}$/.test(value)
        }
      }
    }
  },
  methods: {
    toggleVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    signUp () {
    },
    resetForm () {
      this.showResponseError = false
      this.credentials.password = null
      this.$v.credentials.password.$reset()
    }
  }
}
</script>
