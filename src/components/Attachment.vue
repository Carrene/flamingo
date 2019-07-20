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
        class="secondary-button"
        :class="{ disabled: !selectedFile }"
        :disabled="!selectedFile"
        @click="addAttachment"
      >
        <img
          src="./../assets/save-light.svg"
          class="save-icon"
        >
        Save
      </button>
      <avatar />
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
          :fill="addingNewAttachment ? '#FFF' : '#008290'"
          class="plus-button"
          :class="{selected: addingNewAttachment}"
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
            <div class="textarea-container small">
              <textarea
                class="light-primary-input"
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
              @click="toggleFilePreview(file)"
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
              fill="#232323"
              class="close-icon"
              @click.native="deleteSelectedFile"
            />
          </div>

          <button
            type="button"
            class="secondary-button outlined"
            @click="uploadFile"
          >
            <img
              src="./../assets/plus.svg"
              class="plus-icon"
              v-if="!selectedFile"
            >
            {{ selectedFile ? 'Change Attachment' : 'Add Attachment' }}
          </button>
        </form>

        <!-- ATTACHMENT LIST -->

        <!-- TODO: UPDATE THIS CONDITIONAL LATER -->
        <div
          :class="attachment.isMine ? 'mymessage' : ''"
          class="attachment-box"
          v-for="attachment in decoratedAttachments"
          :key="attachment.id"
        >

          <!-- MENU -->

          <div class="menu-container">

            <div class="sender-name">
              <span v-if="attachment.isMine">Me</span>
              <span v-else>{{ attachment.memberTitle }}</span>
            </div>
            <div class="menu">
              <simple-svg
                :filepath="require('@/assets/more.svg')"
                :fill="attachment.isMine? '#FFF' : '#232323'"
                class="menu-icon"
                @click.native="showMenu(attachment.id)"
                v-if="attachment.isMine"
              />

              <!-- MENU ITEMS -->

              <div
                class="menu-items"
                v-if="showingMenu === attachment.id"
                v-on-clickout.capture="hideMenu"
              >

                <!-- NOT IMPLEMENTED YET -->

                <!-- <span @click="toggleEditMode">Edit</span> -->
                <span @click="deleteAttachment(attachment.id)">Delete</span>
              </div>
            </div>
          </div>

          <!-- CAPTION -->

          <div
            class="caption"
            v-if="attachment.caption"
          >
            {{ attachment.caption }}
          </div>

          <div class="file-list">
            <div class="file">
              <img
                :src="attachment.file.url"
                class="file"
                @click="toggleFilePreview(attachment.file, attachment)"
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
            <span class="day">{{ moment.parseZone(attachment.createdAt).local().format('MMMM DD') }}</span>
            <span class="time">{{ moment.parseZone(attachment.createdAt).local().format('hh:mm A') }}</span>
          </div>

        </div>
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      />
    </div>

    <file-preview
      v-if="showingFilePreview"
      @close="toggleFilePreview"
      :file="previewFile"
      :details="fileDetails"
    />
  </div>
</template>

<script>
import { mixin as clickout } from 'vue-clickout'
import { mapState, mapActions, mapMutations } from 'vuex'
import moment from 'moment'

const FilePreview = () => import(
  /* webpackChunkName: "FilePreview" */ './FilePreview'
)

const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  mixins: [clickout],
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
      status: null,
      message: null,
      previewFile: null,
      fileDetails: null,
      moment
    }
  },
  props: {
    selectedModel: Object
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
      'Member'
    ])
  },
  asyncComputed: {
    // title of messages are generated asynchronously
    async decoratedAttachments () {
      if (!this.attachments) {
        return []
      }
      return Promise.all(this.attachments.map(async (item) => {
        let attachment = item
        let memberTitle = 'None!'
        if (item.senderId) {
          memberTitle = await this.getMemberTitle(item.senderId)
        }
        attachment.memberTitle = memberTitle
        return attachment
      }))
    }
  },
  watch: {
    'selectedModel.id' () {
      this.listAttachments()
    }
  },
  methods: {
    uploadFile () {
      this.$refs.openFiles.click()
    },
    toggleFilePreview (file, details) {
      if (file) {
        this.showingFilePreview = true
        this.previewFile = file
        this.fileDetails = details
      } else {
        this.showingFilePreview = false
        this.previewFile = null
        this.fileDetails = null
      }
    },
    imageChanged (event) {
      let previouslySelectedFile = this.selectedFile
      if (event.target.files[0]) {
        this.selectedFile = event.target.files[0]
      } else {
        this.selectedFile = previouslySelectedFile
      }
    },
    deleteSelectedFile () {
      this.selectedFile = null
      this.$refs.openFiles.value = ''
    },
    addAttachment () {
      this.clearMessage()
      this.setGlobalLoading(true)
      this.selectedModel.attach(this.selectedFile, this.caption).send().then(resp => {
        this.message = 'Added new attachment successfully'
        this.status = resp.status
        this.resetForm()
        this.listAttachments()
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    listAttachments () {
      this.clearMessage()
      this.setGlobalLoading(true)
      this.selectedModel.listAttachments().send().then(resp => {
        this.attachments = resp.models
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    resetForm () {
      this.selectedFile = null
      this.$refs.openFiles.value = ''
      this.caption = null
      this.addingNewAttachment = false
    },
    deleteAttachment (id) {
      this.clearMessage()
      this.setGlobalLoading(true)
      this.selectedModel.deleteAttachment(id).send().then(resp => {
        this.message = 'Deleted attachment successfully'
        this.status = resp.status
        this.listAttachments()
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    showMenu (key) {
      this.showingMenu = key
    },
    hideMenu () {
      this.showingMenu = null
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'getMemberTitle'
    ]),
    ...mapMutations([
      'setGlobalLoading'
    ])
  },
  components: {
    FilePreview,
    Snackbar,
    Avatar
  },
  mounted () {
    this.listAttachments()
  }
}
</script>
