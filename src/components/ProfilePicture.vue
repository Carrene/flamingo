<template>
  <div id="profilePicture">
    <!-- PICTURE -->

    <div
      class="avatar large"
    >
      <img
        class="pic"
        :src="picture"
        v-if="picture"
      >
      <simple-svg
        v-else
        :filepath="require('@/assets/profile-default.svg')"
        fill="#C9C9C9"
        class="pic"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProfilePicture',
  data () {
    return {
    }
  },
  props: {
    picture: {
      type: String,
      default: null // require('@/assets/maestro.svg')
    }
  }
}
</script>
