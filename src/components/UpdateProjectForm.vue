<template>
  <form id="updateProjectForm" v-on-clickaway.capture="showPopup" @submit.prevent.once="save">
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if="project.__status__ !== 'dirty'"
        @click="clearSelectedProject"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Project
      </button>
      <button
        type="submit"
        class="light-primary-button small"
        v-else
        :disabled="$v.project.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>

    <loading v-if="loading"/>

    <div class="project-information" v-else>
      <div class="project-form">
        <div class="project-title">

          <!-- PROJECT TITLE -->

          <label class="label" :class="{error: $v.project.title.$error}">
            {{ projectMetadata.fields.title.label }}
          </label>
          <input
            type="text"
            :placeholder="projectMetadata.fields.title.watermark"
            class="light-primary-input"
            v-model="project.title"
            @change="$v.project.title.$touch"
            @focus="$v.project.title.$reset"
            :class="{error: $v.project.title.$error}"
          >
          <validation-message :validation="$v.project.title" :metadata="projectMetadata.fields.title" />
        </div>

        <!-- RELEASE -->

        <div class="project-release">
          <label class="label">
            {{ projectMetadata.fields.releaseId.label }}
          </label>
          <div class="release-container">
            <input
              type="text"
              :placeholder="projectMetadata.fields.releaseId.watermark"
              class="light-primary-input"
              :value="selectedRelease.title"
              disabled
              readonly
            >
          </div>
          <validation-message :validation="$.project.releaseId" :metadata="projectMetadata.fields.releaseId" />
        </div>

        <!-- DUE DATE -->

        <div class="project-due-date">
          <label class="label">
            {{ projectMetadata.fields.dueDate.label }}
          </label>
          <div class="input-container">
            <input
              type="text"
              :placeholder="projectMetadata.fields.dueDate.watermark"
              class="light-primary-input"
              :value="dueDate"
              disabled
              readonly
            >
          </div>
          <div>
            <validation-message :validation="$v.project.dueDate" :metadata="projectMetadata.fields.dueDate" />
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="project-description">
          <label class="label" :class="{error: $v.project.description.$error}">
            {{ projectMetadata.fields.description.label }}
          </label>
          <div class="textarea-container">
            <textarea
              :placeholder="projectMetadata.fields.description.watermark"
              class="light-primary-input"
              v-model="project.description"
              @change="$v.project.description.$touch"
              :class="{error: $v.project.description.$error}"
            ></textarea>
            <p class="character-count" v-if="project.description">
              {{ project.description.length }}/512
            </p>
          </div>
          <validation-message :validation="$v.project.description" :metadata="projectMetadata.fields.description" />
        </div>
      </div>
      <div class="response-message">
        <p :class="status === 200 ? 'success' : 'error'">
          {{ message }}
        </p>
      </div>
    </div>
    <popup
      v-if="showingPopup && $v.project.$anyDirty"
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
  name: 'ProjectForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      project: null,
      projectMetadata: server.metadata.models.Project,
      selectedRelease: null,
      loading: false
    }
  },
  validations () {
    return {
      project: {
        title: server.metadata.models.Project.fields.title.createValidator(),
        description: server.metadata.models.Project.fields.description.createValidator(),
        releaseId: server.metadata.models.Project.fields.releaseId.createValidator(),
        dueDate: server.metadata.models.Project.fields.dueDate.createValidator()
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
        return 'Your project was updated.'
      } else {
        return null
      }
    },
    dueDate () {
      if (this.project.dueDate) {
        return moment(this.project.dueDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'selectedProject',
      'Project',
      'releases',
      'Release'
    ])
  },
  watch: {
    'selectedProject.id' (newValue) {
      if (newValue) {
        this.loading = true
        this.getSelectedProject()
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
      this.getSelectedProject()
    },
    showPopup () {
      if (this.project.__status__ === 'dirty') {
        this.showingPopup = true
      }
    },
    save () {
      this.loading = true
      this.project.save().send().then(resp => {
        this.status = resp.status
        this.listProjects([this.project.id])
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
    getSelectedProject () {
      this.Project.get(this.selectedProject.id).send().then(resp => {
        this.project = resp.models[0]
        this.selectedRelease = this.releases.find(release => {
          return release.id === this.project.releaseId
        }) || new this.Release()
      }).finally(() => {
        this.loading = false
      })
    },
    ...mapMutations([
      'clearSelectedProject'
    ]),
    ...mapActions([
      'listProjects'
    ])
  },
  beforeMount () {
    this.project = new this.Project()
    this.selectedRelease = new this.Release()
  },
  mounted () {
    this.loading = true
    this.getSelectedProject()
  },
  components: {
    Popup,
    ValidationMessage,
    Loading
  }
}
</script>
