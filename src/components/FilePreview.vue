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
        v-if="message"
      >
        <!-- NOT IMPLEMENT YET -->
        <!-- <h3 class="sender">
          {{ file.isMine ? 'Me' : file.title }}
        </h3> -->
        <p class="file-description">
          {{ message }}
        </p>
        <div
          class="file-metadata"
          v-if="message"
        >
          <p class="file-date">
            {{ moment(file.createdAt).format('MMMM DD') }}
          </p>
          <p class="file-time">
            {{ moment.parseZone(file.createdAt).local().format('hh:mm A') }}
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
  props: ['file', 'message'],
  data () {
    return {
      moment
    }
  }
}
</script>
