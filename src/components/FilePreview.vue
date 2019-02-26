<template>
  <div id="filePreview">
    <div class="preview-box">
      <div class="preview-header">
        <p class="title">Preview</p>
        <simple-svg
          :filepath="require('@/assets/close.svg')"
          fill="#FFF"
          class="close-icon"
          @click.native="$emit('close')"
        />
      </div>
      <div class="file">
        <span class="file-name">{{ file.title }}</span>
        <div class="image-box">
          <img :src="file.url">
        </div>
      </div>
      <div
        class="file-details"
        v-if="details"
      >
        <h3 class="sender">
          {{ details.memberTitle }}
        </h3>
        <p class="file-description">
          {{ details.caption }}
        </p>
        <div class="file-metadata">
          <p class="file-date">
            {{ moment.parseZone(details.createdAt).local().format('MMMM DD') }}
          </p>
          <p class="file-time">
            {{ moment.parseZone(details.createdAt).local().format('hh:mm A') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'FilePreview',
  props: {
    file: Object,
    details: Object
  },
  data () {
    return {
      moment
    }
  }
}
</script>
