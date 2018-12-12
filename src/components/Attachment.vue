<template>
  <div id="attachment">
    <input
      v-show="false"
      type="file"
      ref="openFiles"
      accept="image/*"
      @input="imageChanged"
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
              @click="toggleFilePreview(file, false)"
            >
            <div class="file-description">
              <span
                class="file-name"
                v-if="file.title"
              >{{ file.title }}</span>
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
                @click.native="showMenu(attachment.id)"
              />

              <!-- MENU ITEMS -->

              <div
                class="menu-items"
                v-if="showingMenu === attachment.id"
                v-on-clickaway.capture="hideMenu"
              >

                <!-- NOT IMPLEMENTED YET -->

                <!-- <span @click="toggleEditMode">Edit</span> -->
                <span @click="deleteAttachment(attachment.id)">Delete</span>
              </div>
            </div>
          </div>

          <!-- CAPTION -->

          <div class="caption" v-if="attachment.caption">
            {{ attachment.caption }}
          </div>

          <div class="file-list">
            <div class="file">
              <img
                :src="attachment.file.url"
                class="file"
                @click="toggleFilePreview(attachment.file, attachment.caption, true)"
              >
            </div>
            <div class="file-description">
              <span class="file-name">
                {{ attachment.file.title }}
              </span>
              <span class="file-type">
                {{ attachment.file.mymetype}}
              </span>
            </div>
          </div>

          <div class="date">
            <span class="day">{{ moment(attachment.file.createdAt).format('MMMM DD') }}</span>
            <span class="time">{{ moment.parseZone(attachment.file.createdAt).local().format('hh:mm A') }}</span>
          </div>

        </div>
      </div>
    </div>

    <file-preview
      v-if="showingFilePreview"
      @close="toggleFilePreview"
      :file="filePreview"
      :message="filePreviewHasMessage"
    />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState } from 'vuex'
import moment from 'moment'
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
      showingMenu: null,
      showingEditMode: false,
      caption: null,
      attachments: null,
      loading: false,
      filePreview: null,
      filePreviewHasMessage: false,
      // TODO: UPDATE THIS DATA LATER
      sender: 'OTHER',
      moment
    }
  },
  computed: {
    file () {
      return {
        title: this.selectedFile.name,
        type: this.selectedFile.type.split('/')[1],
        url: URL.createObjectURL(this.selectedFile)
      }
    },
    ...mapState([
      'selectedProject'
    ])
  },
  watch: {
    'selectedProject.id' () {
      this.listAttachments()
    }
  },
  methods: {
    uploadFile () {
      this.$refs.openFiles.click()
    },
    toggleFilePreview (file, hasMessage) {
      if (file) {
        this.showingFilePreview = true
        this.filePreview = file
        this.filePreviewHasMessage = hasMessage
      } else {
        this.showingFilePreview = false
        this.filePreview = null
        this.filePreviewHasMessage = hasMessage
      }
    },
    imageChanged (event) {
      this.selectedFile = event.target.files[0]
    },
    deleteSelectedFile () {
      this.selectedFile = null
      this.$refs.openFiles.value = ''
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
      this.loading = true
      this.selectedProject.attach(this.selectedFile, this.caption).send().then(resp => {
        this.resetForm()
        this.listAttachments()
      }).finally(() => {
        this.loading = false
      })
    },
    listAttachments () {
      this.loading = true
      this.selectedProject.listAttachments().send().then(resp => {
        this.attachments = resp.json
        console.log(resp.json)
      }).finally(() => {
        this.loading = false
      })
    },
    resetForm () {
      this.selectedFile = null
      this.$refs.openFiles.value = ''
      this.caption = null
    },
    deleteAttachment (id) {
      this.loading = true
      this.selectedProject.deleteAttachment(id).send().then(resp => {
        this.listAttachments()
      }).finally(() => {
        this.loading = false
      })
    },
    showMenu (key) {
      this.showingMenu = key
    },
    hideMenu () {
      this.showingMenu = null
    }
  },
  components: {
    FilePreview,
    Loading
  },
  mounted () {
    this.listAttachments()
  }
}
</script>
