<template>
  <div class="signup">
    <div class="body">
      <div class="logo">
        <img class="img" src="../assets/abstract-logo.png"/>
        <p>Maestro</p>
      </div>
      <div class="information">
        <form class="form">
          <input class="input" type="text" placeholder="  Username (Case sensitive)  ">
          <input class="input" type="number" placeholder="  Your Phone number  ">
          <input class="input" type="text" placeholder="  Your Email  ">
          <input class="input" type="password" placeholder="  Password (Case sensitive)  ">
          <p class="exception">
            There is an error here
          </p>
          <button class="button">Sign up</button>
        </form>
      </div>
    <div class="select-login-mode">
      <p class="title">Or login with</p>
      <div class="icons">
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
    }
  }
}
</script>
