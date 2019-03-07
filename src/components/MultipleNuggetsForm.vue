<template>
  <div id="multipleNuggetsForm">
    <div class="header">
      <avatar/>
    </div>
    <p class="description content">You have multiple nuggets selected.</p>
  </div>
</template>
<script>
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  components: {
    Avatar
  }
}
</script>
