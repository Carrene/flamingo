<template>
  <form id="updateContainerForm" v-on-clickaway.capture="showPopup" @submit.prevent.once="save">
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if="container.__status__ !== 'dirty'"
        @click="clearSelectedContainer"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Container
      </button>
      <button
        type="submit"
        class="light-primary-button small"
        v-else
        :disabled="$v.container.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>

    <loading v-if="loading"/>

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
            @focus="$v.container.title.$reset"
            :class="{error: $v.container.title.$error}"
          >
          <validation-message :validation="$v.container.title" :metadata="containerMetadata.fields.title" />
        </div>

        <!-- RELEASE -->

        <div class="input-container">
          <label class="label">
            {{ containerMetadata.fields.releaseId.label }}
          </label>
          <input
            type="text"
            :placeholder="containerMetadata.fields.releaseId.watermark"
            class="light-primary-input"
            :value="selectedRelease.title"
            disabled
            readonly
          >
          <validation-message :validation="$v.container.releaseId" :metadata="containerMetadata.fields.releaseId" />
        </div>

        <!-- DUE DATE -->

        <div class="input-container">
          <label class="label">
            {{ containerMetadata.fields.dueDate.label }}
          </label>
          <input
            type="text"
            :placeholder="containerMetadata.fields.dueDate.watermark"
            class="light-primary-input"
            :value="dueDate"
            disabled
            readonly
          >
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
      <div class="response-message">
        <p :class="status === 200 ? 'success' : 'error'">
          {{ message }}
        </p>
      </div>
    </div>
    <popup
      v-if="showingPopup && $v.container.$anyDirty"
      :message="'Save changes?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import server from './../server'
import moment from 'moment'
import Popup from './Popup'
import ValidationMessage from './ValidationMessage'
import Loading from './Loading'

export default {
  mixins: [ clickaway ],
  name: 'ContainerForm',
  data () {
    return {
      showingPopup: false,
      status: null,
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
      } else if (this.status === 703) {
        return 'At Most 512 Characters Valid For Description'
      } else if (this.status === 704) {
        return 'At Most 50 Characters Valid For Title'
      } else if (this.status === 403) {
        return 'Forbidden'
      } else if (this.status === 707) {
        return 'Invalid Field'
      } else if (this.status === 708) {
        return 'Empty Form'
      } else if (this.status === 200) {
        return 'Your container was updated.'
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
      'selectedContainer',
      'Container',
      'releases',
      'Release'
    ])
  },
  watch: {
    'selectedContainer.id' (newValue) {
      if (newValue) {
        this.container = this.getSelectedContainer()
      }
    }
  },
  methods: {
    confirmPopup () {
      this.showingPopup = false
      this.save()
    },
    cancelPopup () {
      this.showingPopup = false
      this.container = new this.Container(this.selectedContainer)
    },
    showPopup () {
      if (this.container.__status__ === 'dirty') {
        this.showingPopup = true
      }
    },
    save () {
      this.loading = true
      this.container.save().send().then(resp => {
        this.status = resp.status
        this.listContainers([this.container.id])
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
    getSelectedContainer () {
      this.loading = false
      this.container = new this.Container(this.selectedContainer)
      this.selectedRelease = this.releases.find(release => {
        return release.id === this.container.releaseId
      }) || new this.Release()
      this.loading = false
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
  mounted () {
    this.getSelectedContainer()
  },
  components: {
    Popup,
    ValidationMessage,
    Loading
  }
}
</script>
