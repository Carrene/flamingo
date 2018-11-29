<template>
  <div id="attachment">
    <input
      v-show="false"
      type="file"
      ref="openFiles"
      accept="image/*"
    >
    <div class="header">
      <button
        type="button"
        class="primary-button small"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Project
      </button>
    </div>

    <!-- SEARCH -->

    <div class="content">
      <div class="actions">
        <div class="input-container search">
          <input
            type="text"
            class="light-primary-input"
            placeholder="Search attachment"
          >
          <simple-svg
            :filepath="require('@/assets/search.svg')"
            fill="#23232380"
            class="search-icon"
          />
          <simple-svg
            :filepath="require('@/assets/close.svg')"
            fill="#232323"
            class="close-icon"
          />
        </div>
        <simple-svg
          :filepath="require('@/assets/plus.svg')"
          :fill="selectedNewAttachment ? '#FFF' : '#A63E5D'"
          class="plus-button"
          :class="{selected: selectedNewAttachment === true}"
          @click.native="selectedNewAttachment = !selectedNewAttachment"
        />
      </div>
      <div class="attachment-container">
        <form
          class="new-attachment"
          v-if="selectedNewAttachment"
        >
          <label>Me</label>
          <div class="input-container">
            <div class="textarea-container medium">
              <textarea
                class="primary-input"
                placeholder="Type here …"
              ></textarea>
            </div>
          </div>
          <button
            type="button"
            class="primary-button medium"
            @click="uploadFile"
          >
            <img
              src="./../assets/plus.svg"
              class="plus-icon"
            >
            Add Attachment
          </button>
        </form>
        <div class="attachment-box">
          <div class="file-list">
            <div
              class="file"
              @click="showingFilePreview = true"
            >
            </div>
            <div class="file-description">
              <span class="file-name"></span>
              <span class="file-type"></span>
            </div>
          </div>
          <div class="date">
            <span class="day"></span>
            <span class="time"></span>
          </div>
        </div>
      </div>
    </div>
    <file-preview v-if="showingFilePreview" />
  </div>
</template>

<script>
import FilePreview from './FilePreview'

export default {
  name: 'Attachment',
  data () {
    return {
      selectedNewAttachment: false,
      showingFilePreview: false
    }
  },
  methods: {
    uploadFile () {
      this.$refs.openFiles.click()
    }
  },
  components: {
    FilePreview
  }
}
</script>
