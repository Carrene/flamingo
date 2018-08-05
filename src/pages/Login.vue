<template>
  <div class="login">
    <div class="body">
      <div class="logo">
        <img src="./../assets/abstract-logo.png" alt="Maestro" class="logo-img">
        <p class="logo-title">Maestro</p>
      </div>
      <div class="information">
        <form class="form">
          <input type="text" placeholder="Username (Case sensitive)" class="email input">
          <div class="password-container">
            <input type="password" placeholder="Password (Case sensitive)" class="password input">
            <img src="./../assets/Hide password.png" class="visible-icon">
          </div>
          <div class="clickable">
            <router-link to="" class="link">Forgot Password?</router-link>
            <button type="submit" class="button">Log in</button>
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
          Not registered yet? create account <router-link to="" class="link">here</router-link>
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
