<template>
  <div class="login">
    <div class="body">
      <div class="icon">
        <img src="./../assets/abstract-logo.png" alt="Maestro" class="maestro">
        <p class="title">Maestro</p>
      </div>
      <div class="information">
        <form class="form">
          <input type="text" placeholder="  Username or Email (Case sensitive)" class="inputs">
          <input type="password" placeholder="  Password (Case sensitive)" class="inputs">
          <router-link to="" class="">Forgot Password?</router-link>
          <p class="exception">Lorem ipsum dolor sit amet, consectetur </p>
          <button type="submit" class="button">Log in</button>
        </form>
      </div>
      <div class="login-with">
        <p class="title">Or login with</p>
        <div class="icons">
          <img src="./../assets/Carrene.logo.png" alt="Carrene" class="img">
          <p>Carrene</p>
        </div>
        <div class="icons">
          <img src="./../assets/Google.logo.png" alt="Google" class="img">
          <p>Google</p>
        </div>
        <div class="icons">
          <img src="./../assets/Github.logo.png" alt="Github" class="img">
          <p>Github</p>
        </div>
      </div>
        <p class="register">
          Not registered yet? create account <router-link to="" class="">here</router-link>
        </p>
     </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
    }
  }
}
</script>
