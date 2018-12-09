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
        v-if="addingNewAttachment"
        :class="{ disabled: !selectedFile }"
        :disabled="!selectedFile"
        @click="addAttachment"
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

    <div class="content">

      <!-- ACTIONS -->

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
          :fill="addingNewAttachment ? '#FFF' : '#A63E5D'"
          class="plus-button"
          :class="{selected: addingNewAttachment === true}"
          @click.native="addingNewAttachment = !addingNewAttachment"
        />
      </div>

      <!-- ATTACHMENT CONTAINER -->

      <div class="attachment-container">

        <!-- NEW ATTACHMENT -->

        <form
          class="attachment-box new-attachment"
          v-if="addingNewAttachment"
        >
          <label>Me</label>

          <div class="input-container">
            <div class="textarea-container medium">
              <textarea
                class="primary-input"
                placeholder="Type here …"
                v-model.trim="caption"
              ></textarea>
            </div>
          </div>

          <div
            class="file-list preview"
            v-if="selectedFile"
          >
            <img
              class="file"
              :src="file.url"
              @click="toggleFilePreview"
            >
            <div class="file-description">
              <span
                class="file-name"
                :title="file.name"
              >{{ file.name }}</span>
              <span
                class="file-type"
                :title="file.type"
              >{{ file.type }}</span>
            </div>
            <simple-svg
              :filepath="require('@/assets/close.svg')"
              fill="#FFF"
              class="close-icon"
              @click.native="deleteSelectedFile"
            />
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

              <div
                class="menu-items"
                v-if="showingMenu"
                v-on-clickaway="toggleMenu.bind(undefined, false)"
              >
                <span @click="toggleEditMode">Edit</span>
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
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Felis_catus-cat_on_snow.jpg"
                class="file"
              >
            </div>
            <div class="file-description">
              <span
                class="file-name"
                title="Lorem ipsum"
              >
                Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum
              </span>
              <span
                class="file-type"
                title="Lorem"
              >Lorem</span>
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
import { mixin as clickaway } from 'vue-clickaway'
import { mapState } from 'vuex'
const FilePreview = () => import(
  /* webpackChunkName: "FilePreview" */ './FilePreview'
)

export default {
  mixins: [clickaway],
  name: 'Attachment',
  data () {
    return {
      addingNewAttachment: false,
      showingFilePreview: false,
      selectedFile: null,
      showingMenu: false,
      showingEditMode: false,
      caption: null,
      // TODO: UPDATE THIS DATA LATER
      sender: 'me'
    }
  },
  computed: {
    file () {
      return {
        name: this.selectedFile.name,
        type: this.selectedFile.type.split('/')[1],
        url: URL.createObjectURL(this.selectedFile)
      }
    },
    ...mapState([
      'selectedProject'
    ])
  },
  methods: {
    uploadFile () {
      this.$refs.openFiles.click()
    },
    toggleFilePreview () {
      this.showingFilePreview = !this.showingFilePreview
    },
    imageChanged (event) {
      this.selectedFile = event.target.files[0]
    },
    deleteSelectedFile () {
      this.selectedFile = null
    },
    toggleMenu (value) {
      if (typeof value === 'boolean') {
        this.showingMenu = value
      } else {
        this.showingMenu = !this.showingMenu
      }
    },
    toggleEditMode () {
      this.addingNewAttachment = true
      this.showingMenu = false
    },
    addAttachment () {
      this.selectedProject.attach(this.selectedFile, this.caption).send().then(resp => {
        this.resetForm()
        this.loadAttachments()
      })
    },
    loadAttachments () {
    },
    resetForm () {
      this.selectedFile = null
      this.caption = null
    }
  },
  components: {
    FilePreview
  }
}
</script>
