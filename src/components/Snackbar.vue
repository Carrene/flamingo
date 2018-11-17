<template>
  <transition name="fade">
    <div id="snackbar"
         :class="status === 200 ? 'success' : 'error'"
         @click="$emit('close')"
         v-if="status"
    >
      <simple-svg :filepath= "require('../assets/close.svg')"
                  :fill="'#FFF'"
                  height="15"
      />
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Snackbar',
  props: {
    status: {
      type: Number,
      default: null
    },
    message: {
      type: String,
      default: null
    }
  }
}
</script>
