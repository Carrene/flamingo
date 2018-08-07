<template>
  <div class="signup">

  <!--Show response error  -->

    <div class="response-error" v-if="showBox === true">
      <div class="response-error-box">
        <p>Oops, something happened ...</p>
        <img src="./../assets/close.svg" alt="close" class="close-icon" @click="showBox = false">
        <p class="error"></p>
      </div>
    </div>

  <!-- STEP 2 -->

    <div class="step-1" v-if="step === 2">
      <div class="logo">
        <img class="image" src="../assets/abstract-logo.png"/>
        <p>Maestro</p>
      </div>
      <form class="form" @submit.prevent="login">
        <div class="username-container">
          <input class="input" type="text" placeholder="username (Case sensitive)"
                 v-model="username"
                 @blur="$v.username.$touch"
                 @focus="$v.username.$reset"
                 :class="[$v.username.$error ? 'error' : null,
                   !$v.username.$invalid && $v.username.$dirty ? 'success' : null]"
          >
          <span class="validation-error" v-if="$v.username.$error">username is required</span>
        </div>
        <div class="password-container">
          <div class="container">
            <input class="input password-input" :type="passwordFieldType" placeholder="Password (Case sensitive)"
                   v-model="password"
                   :class="[$v.password.$error ? 'error' : null,
                     !$v.password.$invalid && $v.password.$dirty ? 'success' : null]"
                   @blur="$v.password.$touch"
                   @focus="$v.password.$reset">
            <img class="hide-icon" src="../assets/Hide password.png" @click="switchVisibility">
          </div>
          <span class="validation-error" v-if="$v.password.$error">Password is required</span>
        </div>
        <div class="phone-number-container">
          <input class="input code" type="text" value="+98" readonly/>
          <input class="input phone-number" type="number" placeholder="Your Phone number(optional)"
                 v-model="phoneNumber"
                 :class="[$v.phoneNumber.$error ? 'error' : null,
                   !$v.phoneNumber.$invalid && $v.phoneNumber.$dirty ? 'success' : null]"
                 @blur="$v.phoneNumber.$touch"
                 @focus="$v.phoneNumber.$reset"
          >
          <span class="validation-error" v-if="!$v.phoneNumber.pattern">Invalid phone number!</span>
        </div>
        <button class="button" :disabled="$v.username.$invalid || $v.password.$invalid">Sign up</button>
      </form>
      <div class="login-mode">
        <p class="title">Or login with</p>
        <div class="login-mode-icons">
          <div class="carrene-icon icon">
            <img src="../assets/Carrene.logo.png"/>
            <p>Carrene</p>
          </div>
          <div class="google-icon icon">
            <img src="../assets/Google.logo.png"/>
            <p>Google</p>
          </div>
          <div class="github-icon icon">
            <img src="../assets/Github.logo.png"/>
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
      step: 2,
      username: null,
      password: null,
      phoneNumber: null,
      passwordFieldType: 'password',
      showBox: false
    }
  },
  validations: {
    phoneNumber: {
      required,
      pattern: (value) => {
        if (typeof value === 'undefined' || value === null || value === '') {
          return true
        }
        return /^9\d{9}$/.test(value)
      }
    },
    username: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    switchVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    login () {
    }
  }
}
</script>
