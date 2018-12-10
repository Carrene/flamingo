<template>
  <div id="pictureCrop">
    <div
      class="popup-box"
      v-on-clickaway="closeBox"
    >
      <div class="box-header">
        <div class="header-title">Select profile photo</div>
        <simple-svg
          :filepath="require('@/assets/close.svg')"
          fill="#FFFFFF"
          class="close-icon"
          @click.native="closeBox"
        />
      </div>
      <div class="box-content">
        <div class="image-area">
          <button class="primary-button small">Browse Disk</button>
        </div>
        <div class="caption">
          We only accept JEPG and PNG files. The longer edge of the image should be at least 300px.
        </div>
        <div class="button">
          <button
            :disabled="true"
            class="primary-button medium"
          >Set as profile photo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [clickaway],
  name: 'PictureCrop',
  data () {
    return {
    }
  },
  methods: {
    closeBox () {
      this.$emit('close')
    }
  }
}
</script>
