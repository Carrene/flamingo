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

    <loading v-if="loading" />

    <div
      class="content"
      v-if="!loading"
    >

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
          v-for="attachment in attachments"
          :key="attachment.id"
        >

          <!-- MENU -->

          <div class="menu-container">

            <!-- NOT IMPLEMENTED YET -->

            <!-- <div class="sender-name">
              <span v-if="sender === 'me'">Me</span>
              <span v-else>{{ sender }}</span>
            </div> -->
            <div class="menu">
              <simple-svg
                :filepath="require('@/assets/more.svg')"
                :fill="sender === 'me' ? '#FFF' : '#232323'"
                class="menu-icon"
                @click.native="showingMenu = !showingMenu"
              />

              <!-- MENU ITEMS -->

              <div
                class="menu-items"
                v-if="showingMenu"
                v-on-clickaway="toggleMenu.bind(undefined, false)"
              >

              <!-- NOT IMPLEMENTED YET -->

                <!-- <span @click="toggleEditMode">Edit</span> -->
                <span @click="deleteAttachment(attachment.id)">Delete</span>
              </div>
            </div>
          </div>

          <!-- CAPTION -->

          <div class="caption">
            {{ attachment.title }}
          </div>

          <div class="file-list">
            <div
              class="file"
              @click="toggleFilePreview"
            >
              <img
                :src="attachment.file"
                class="file"
              >
            </div>
            <div class="file-description">
              <span
                class="file-name"
                title="Lorem ipsum"
              >
                Lorem ipsum dolor sit amet
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
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
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
      attachments: null,
      loading: false,
      // TODO: UPDATE THIS DATA LATER
      sender: 'OTHER'
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
    // NOT IMPLEMENTED YET
    // toggleEditMode () {
    //   this.addingNewAttachment = true
    //   this.showingMenu = false
    // },
    addAttachment () {
      this.selectedProject.attach(this.selectedFile, this.caption).send().then(resp => {
        this.resetForm()
        // this.loadAttachments()
      }).finally(() => {
        this.loading = false
      })
    },
    loadAttachments () {
      this.selectedProject.list().send().then(resp => {
        this.attachments = resp.json
      }).finally(() => {
        this.loading = false
      })
    },
    resetForm () {
      this.selectedFile = null
      this.caption = null
    },
    deleteAttachment (id) {
      this.selectedProject.delete(id).send().then(resp => {
        // this.loadAttachments()
      }).finally(() => {
        this.loading = false
      })
    }
  },
  components: {
    FilePreview,
    Loading
  },
  mounted () {
    this.loadAttachments()
  }
}
</script>
