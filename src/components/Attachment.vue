<template>
  <div id="attachment">
    <input
      v-show="false"
      type="file"
      ref="openFiles"
      accept="image/*"
      @change="imageChanged"
    >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="light-primary-button small"
        v-if="selectedNewAttachment"
        :class="{ disabled: !imageFiles.length }"
        :disabled="!imageFiles.length"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
      <button
        type="button"
        class="primary-button small"
        v-else
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

        <!-- NEW ATTACHMENT -->

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
          <div
            class="attached-files"
            v-if="imageFiles.length"
            :key="image"
            v-for="(image, index) in images"
          >
            <div class="file-list">
              <div
                class="file"
                @click="toggleFilePreview"
              >
                <img :src="image.url">
              </div>
              <div class="file-description">
                <span class="file-name">{{ image.fileName }}</span>
                <span class="file-type">{{ image.fileType }}</span>
              </div>
              <simple-svg
                :filepath="require('@/assets/close.svg')"
                fill="#FFF"
                class="close-icon"
                @click.native="deletSelectedFile(index)"
              />
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

        <!-- ATTACHMENT LIST -->

        <!-- TODO: UPDATE THIS CONDITIONAL LATER -->
        <div
          :class="sender === 'me' ? 'mymessage' : ''"
          class="attachment-box"
        >

          <!-- MENU -->

          <div class="menu-container">
            <div class="sender-name">
              <span v-if="sender === 'me'">Me</span>
              <span v-else>{{ sender }}</span>
            </div>
            <div class="menu">
              <simple-svg
                :filepath="require('@/assets/more.svg')"
                :fill="sender === 'me' ? '#FFF' : '#232323'"
                class="menu-icon"
                v-if="sender === 'me'"
                @click.native="showingMenu = !showingMenu"
              />

              <!-- MENU ITEMS -->

              <div class="menu-items" v-if="showingMenu">
                <span>Edit</span>
                <span>Delete</span>
              </div>
            </div>
          </div>

          <!-- CAPTION -->

          <div class="caption">
            Lorem ipsum dolor sit amet
          </div>
          <div class="file-list">
            <div
              class="file"
              @click="toggleFilePreview"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Felis_catus-cat_on_snow.jpg">
            </div>
            <div class="file-description">
              <span class="file-name">Lorem ipsum</span>
              <span class="file-type">Lorem</span>
            </div>
          </div>
          <div class="date">
            <span class="day">September 20</span>
            <span class="time">05:30 PM</span>
          </div>
        </div>
      </div>
    </div>

    <file-preview
      v-if="showingFilePreview"
      @close="toggleFilePreview"
    />
  </div>
</template>

<script>
import FilePreview from './FilePreview'

export default {
  name: 'Attachment',
  data () {
    return {
      selectedNewAttachment: false,
      showingFilePreview: false,
      imageFiles: [],
      showingMenu: false,
      // TODO: UPDATE THIS DATA LATER
      sender: 'me'
    }
  },
  computed: {
    images () {
      return this.imageFiles.map(item => {
        return {
          url: URL.createObjectURL(item),
          fileName: item.name,
          fileType: item.type
        }
      })
    }
  },
  methods: {
    uploadFile () {
      this.$refs.openFiles.click()
    },
    toggleFilePreview () {
      this.showingFilePreview = !this.showingFilePreview
    },
    imageChanged (event) {
      this.imageFiles = [...event.target.files]
    },
    deletSelectedFile (index) {
      debugger
      this.imageFiles.splice(index, 1)
    }
  },
  components: {
    FilePreview
  }
}
</script>
