<template>
  <form id="newContainerForm" v-on-clickaway.capture="showPopup" @submit.once.prevent="create">

    <!--HEADER-->

    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
        :disabled="$v.container.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>

    <loading v-if="loading"/>

    <!--FORM-->

    <div class="container-information" v-else>
      <div class="container-form">

        <!-- PROJECT TITLE -->

        <div class="input-container">
          <label class="label" :class="{error: $v.container.title.$error}">
            {{ containerMetadata.fields.title.label }}
          </label>
          <input
            type="text"
            :placeholder="containerMetadata.fields.title.watermark"
            class="light-primary-input"
            v-model="container.title"
            @change="$v.container.title.$touch"
            :class="{error: $v.container.title.$error}"
          >
          <validation-message :validation="$v.container.title" :metadata="containerMetadata.fields.title" />
        </div>

        <!-- RELEASE -->

        <div class="input-container">
          <label class="label">
            {{ containerMetadata.fields.releaseId.label }}
          </label>
          <div class="dropdown-container">
            <input
              type="text"
              :placeholder="containerMetadata.fields.releaseId.watermark"
              class="light-primary-input"
              :class="{'showing-list' : showReleaseList}"
              @click="toggleReleaseList"
              :value="selectedRelease.title"
              readonly
            >
            <img src="../assets/chevron-down.svg"
                 class="arrow"
                 :class="!showReleaseList ? 'down' : 'up'"
                 @click="toggleReleaseList"
            >
            <div class="dropdown-list" v-if="showReleaseList" v-on-clickaway="toggleReleaseList.bind(undefined, false)">
              <p
                v-for="release in releases"
                :key="release.id"
                @click="selectRelease(release)"
              >
                {{ release.title }}
              </p>
            </div>
          </div>
          <validation-message :validation="$v.container.releaseId" :metadata="containerMetadata.fields.releaseId" />
        </div>

        <!-- DUE DATE -->

        <div class="input-container">
          <label class="label">
            {{ containerMetadata.fields.dueDate.label }}
          </label>
          <div class="input-container">
            <input
              type="text"
              :placeholder="containerMetadata.fields.dueDate.watermark"
              class="light-primary-input"
              :value="dueDate"
              disabled
              readonly
            >
          </div>
          <div>
            <validation-message :validation="$v.container.dueDate" :metadata="containerMetadata.fields.dueDate" />
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="input-container">
          <label class="label" :class="{error: $v.container.description.$error}">
            {{ containerMetadata.fields.description.label }}
          </label>
          <div class="textarea-container">
            <textarea
              :placeholder="containerMetadata.fields.description.watermark"
              class="light-primary-input"
              v-model="container.description"
              @change="$v.container.description.$touch"
              :class="{error: $v.container.description.$error}"
            ></textarea>
            <p class="character-count" v-if="container.description">
              {{ container.description.length }}/512
            </p>
          </div>
          <validation-message :validation="$v.container.description" :metadata="containerMetadata.fields.description" />
        </div>
      </div>
      <div class="response-message" v-if="message">
        <p :class="status === 200 ? 'success' : 'error'">
          {{ message }}
        </p>
      </div>
    </div>
    <popup
      v-if="showingPopup"
      :message="'Leave new container view?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import server from './../server'
import moment from 'moment'
import Popup from './Popup'
import ValidationMessage from './ValidationMessage'
import Loading from './Loading'

export default {
  mixins: [ clickaway ],
  name: 'NewContainerForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      showReleaseList: false,
      container: null,
      containerMetadata: server.metadata.models.Container,
      selectedRelease: null,
      loading: false
    }
  },
  validations () {
    return {
      container: {
        title: server.metadata.models.Container.fields.title.createValidator(),
        description: server.metadata.models.Container.fields.description.createValidator(),
        releaseId: server.metadata.models.Container.fields.releaseId.createValidator(),
        dueDate: server.metadata.models.Container.fields.dueDate.createValidator()
      }
    }
  },
  computed: {
    message () {
      if (this.status === 600) {
        return 'Repetitive Title'
      } else if (this.status === 607) {
        return 'Release Not Found'
      } else if (this.status === 608) {
        return 'Manager Not Found'
      } else if (this.status === 703) {
        return 'At Most 512 Characters Valid For Description'
      } else if (this.status === 704) {
        return 'At Most 50 Characters Valid For Title'
      } else if (this.status === 707) {
        return 'Invalid Field'
      } else if (this.status === 708) {
        return 'Empty Form'
      } else if (this.status === 710) {
        return 'Member Not Found'
      } else if (this.status === 711) {
        return 'Already Subscribed'
      } else if (this.status === 727) {
        return 'Title Is Null'
      } else if (this.status === 734) {
        return 'Manager Id Not In Form'
      } else if (this.status === 200) {
        return 'Your container was created.'
      } else {
        return null
      }
    },
    dueDate () {
      if (this.container.dueDate) {
        return moment(this.container.dueDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'releases',
      'Container',
      'Release'
    ])
  },
  methods: {
    confirmPopup () {
      this.showingPopup = false
      this.container = new this.Container()
      this.$v.container.$reset()
      this.loading = true
      this.listContainers([undefined, () => {
        this.loading = false
      }])
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.container.$anyDirty) {
        this.showingPopup = true
      }
    },
    create () {
      this.loading = true
      this.container.save().send().then(resp => {
        this.status = resp.status
        this.listContainers([resp.json.id])
        setTimeout(() => {
          this.status = null
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        setTimeout(() => {
          this.status = null
        }, 3000)
      }).finally(() => {
        this.loading = false
      })
    },
    toggleReleaseList (value) {
      if (typeof value === 'boolean') {
        this.showReleaseList = value
      } else {
        this.showReleaseList = !this.showReleaseList
      }
    },
    selectRelease (release) {
      this.container.releaseId = release.id
      this.selectedRelease = this.releases.find(release => {
        return release.id === this.container.releaseId
      })
      this.showReleaseList = false
    },
    ...mapMutations([
      'clearSelectedContainer'
    ]),
    ...mapActions([
      'listContainers'
    ])
  },
  beforeMount () {
    this.container = new this.Container()
    this.selectedRelease = new this.Release()
  },
  components: {
    ValidationMessage,
    Popup,
    Loading
  }
}
</script>
