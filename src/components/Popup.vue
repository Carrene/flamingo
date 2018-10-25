<template>
  <div id="popup">
      <div class="popupBox">
        <p>{{ message }}</p>
        <div class="buttonContainer">
          <button type="button" class="light-primary-button small" @click="$emit('confirm')">Yes</button>
          <button type="button" class="primary-button small" @click="$emit('cancel')">No</button>
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
