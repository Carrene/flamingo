<template>
  <div id="mojo">
    <div
      ref="filled"
      :class="['filled', mojoState]"
    ></div>
    <div class="label">0.00</div>
  </div>
</template>
<script>
export default {
  name: 'Mojo',
  data () {
    return {}
  },
  computed: {
    mojoState () {
      // TODO: Implement later after back-end completion0
      return 'on-time'
    }
  },
  props: {
    value: {
      type: Number,
      default: 50
    }
  },
  watch: {
    'value': {
      immediate: true,
      handler (newValue) {
        this.$nextTick(() => {
          this.$refs.filled.style.width = `${newValue}%`
        })
      }
    }
  }
}
</script>
