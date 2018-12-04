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
        <span class="file-name" v-if="fileName">desktop-illus.png</span>
        <div class="image-box">
          <img :src="previewImage">
        </div>
      </div>
      <div class="file-details" v-if="previewMessage">
        <h3 class="sender">
          {{ previewMessage.isMine ? 'Me' : previewMessage.title }}
        </h3>
        <p class="file-description">
          {{ previewMessage.body }}
        </p>
        <div class="file-metadata">
          <p class="file-date">
            {{ formatDate(previewMessage.createdAt) }}
          </p>
          <p class="file-time">
            {{ formatTime(previewMessage.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilePreview',
  props: ['previewImage', 'previewMessage'],
  data () {
    return {
    }
  },
  methods: {
    isThisYear (isoDateString) {
      let now = new Date()
      let date = new Date(isoDateString)
      return now.getFullYear() === date.getFullYear()
    },
    formatDate (isoDateString) {
      // TODO: Migrate to moment.js
      isoDateString += 'Z'
      let date = new Date(isoDateString)
      let formatedDate = ''
      // handling months and days
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      formatedDate = `${months[date.getMonth()]} ${date.getDate()}`
      // Handling year
      if (!this.isThisYear(isoDateString)) {
        formatedDate += `, ${date.getFullYear()}`
      }
      return formatedDate
    },
    formatTime (isoDateString) {
      // TODO: Migrate to moment.js
      isoDateString += 'Z'
      let date = new Date(isoDateString)
      let hour = date.getHours()
      let amOrPm = 'AM'
      if (hour >= 12) {
        amOrPm = 'PM'
      }
      if (hour >= 13) {
        hour -= 12
      }
      if (hour < 1) {
        hour = 12
      }
      hour = hour.toLocaleString('en', { minimumIntegerDigits: 2 })
      let minute = date.getMinutes().toLocaleString('en', { minimumIntegerDigits: 2 })
      let formattedTime = `${hour}:${minute} ${amOrPm}`
      return formattedTime
    }
  }
}
</script>
