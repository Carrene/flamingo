<template>
  <div id="popup">
    <div class="popup-box">
      <p>{{ message }}</p>
      <div class="button-project">
        <button
          type="button"
          class="light-primary-button small"
          @click="$emit('confirm')"
        >Yes</button>
        <button
          type="button"
          class="primary-button small"
          @click="$emit('cancel')"
        >No</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'popup',
  props: ['message'],
  data () {
    return {
    }
  }
}
</script>
