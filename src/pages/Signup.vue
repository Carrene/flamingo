<template>
  <div class="signup">

  <!-- STEP 1 -->

  <!-- STEP 2 -->

    <div class="step-1" v-if="step === 1">
      <div class="logo">
        <img class="img" src="../assets/abstract-logo.png"/>
        <p>Maestro</p>
      </div>
      <div class="information">
        <form class="form">
          <input class="input" type="text" placeholder="Username (Case sensitive)">
          <div class="password">
            <input class="input password-input" type="password" placeholder="Password (Case sensitive)" v-tooltip.top-center="msg">
            <img class="hide-icon" src="../assets/Hide password.png">
          </div>
          <input class="input code" type="number" placeholder="+98"/>
          <input class="input phone-number" type="number" placeholder="Your Phone number(optional)">
          <button class="button">Sign up</button>
        </form>
      </div>
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
export default {
  name: 'signup',
  data () {
    return {
      step: 1,
      countryCode: null
    }
  }
}
</script>
