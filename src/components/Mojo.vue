<template>
  <div id="mojo">
    <div
      ref="filled"
      :class="['filled', boarding]"
    ></div>
    <div class="label">{{ hours ? hours.toFixed(2) : '0.00' }}</div>
  </div>
</template>
<script>
export default {
  name: 'Mojo',
  data () {
    return {}
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    boarding: {
      type: String,
      default: 'on-time'
    },
    hours: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'progress': {
      immediate: true,
      handler (newValue) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.filled.style.width = `${newValue > 100 ? 100 : newValue}%`
          })
        })
      }
    }
  }
}
</script>
