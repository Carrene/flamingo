<template>
  <div id="notFound">
    <img
      src="./../assets/ghost.svg"
      class="img"
    >
    <div class="content">
      <p class="title">404</p>
      <p class="subtitle">Page not found</p>
    </div>
    <router-link
      to="/"
      tag="button"
      type="button"
      class="primary-button"
    >Go back home</router-link>
  </div>
</template>

<script>

export default {
  name: 'NotFound',
  data () {
    return {
    }
  }
}
</script>
