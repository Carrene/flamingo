<template>
  <div class="login">
    <div class="body">
      <div class="logo">
        <img src="./../assets/abstract-logo.png" alt="Maestro" class="logo-img">
        <p class="logo-title">Maestro</p>
      </div>
      <div class="information">
        <form class="form">
          <div class="username-container">
            <input type="text" placeholder="Username (Case sensitive)" class="email input"
                   :class="$v.username.$error ? 'error' : null"
                   v-model="$v.username.$model"
            >
            <p class="validation-error" v-if="$v.username.$error">This value is required.</p>
          </div>
          <div class="password-container">
            <div class="container">
              <input placeholder="Password (Case sensitive)" class="password input"
                   :type="passwordFieldType"
                   :class="$v.password.$error ? 'error' : null"
                   v-model="$v.password.$model"
              >
              <img src="./../assets/Hide password.png" class="visible-icon" @click="switchVisibility">
            </div>
            <div class="validation-error">
              <p v-if="$v.password.$error">This value is required.</p>
            </div>
          </div>
          <div class="clickable">
            <router-link to="" class="link">Forgot Password?</router-link>
            <button type="submit" class="button" :disabled="$v.username.$invalid">Log in</button>
          </div>
        </form>
      </div>
      <div class="login-mode">
        <p class="title">Or login with</p>
        <div class="login-mode-icons">
          <img src="./../assets/Carrene.logo.png" alt="Carrene" class="icon">
          <p>Carrene</p>
        </div>
        <div class="login-mode-icons">
          <img src="./../assets/Google.logo.png" alt="Google" class="icon">
          <p>Google</p>
        </div>
        <div class="login-mode-icons">
          <img src="./../assets/Github.logo.png" alt="Github" class="icon">
          <p>Github</p>
        </div>
      </div>
        <p class="register">
          Not registered yet? create account
          <router-link to="" class="link">here</router-link>
        </p>
     </div>
    <div class="response-error" v-if="showBox === true">
      <div class="box">
        <p>Oops, something happened ...</p>
        <img src="./../assets/close.svg" alt="close" class="close-icon" @click="showBox = false">
        <p class="error">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </div>
    </div>
  </div>
</template>

<script>import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      username: null,
      password: null,
      showBox: false,
      passwordFieldType: 'password'
    }
  },
  validations: {
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
    }
  }
}
</script>
