<template>
  <transition name="fade">
    <div
      id="snackbar"
      :class="status === 200 ? 'success' : 'error'"
      @click="$emit('close')"
      v-if="status"
    >
      <simple-svg
        :filepath="iconSrc"
        :fill="'#FFF'"
        height="15"
        class="icon"
      />
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Snackbar',
  props: {
    status: Number,
    message: String
  },
  computed: {
    iconSrc () {
      if (this.status === 200) {
        return require('../assets/checked.svg')
      } else {
        return require('../assets/close.svg')
      }
    }
  }
}
</script>
