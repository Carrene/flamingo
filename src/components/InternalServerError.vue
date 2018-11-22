<template>
  <div id="internalServerError">
    <img
      src="./../assets/internal-server-error.svg"
      class="img"
    >
    <div class="content">
      <p class="title">500</p>
      <p class="subtitle">Internal Server Error</p>
    </div>
    <router-link
      to="/"
      tag="button"
      type="button"
      class="primary-button medium"
    >Go back home</router-link>
  </div>
</template>

<script>
import server from './../server.js'

export default {
  name: 'InternalServerError',
  data () {
    return {
    }
  },
  mounted () {
    console.log(server.errorHandlers)
  }
}
</script>
