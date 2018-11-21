<template>
  <form
    id="newProjectForm"
    v-on-clickaway.capture="showPopup"
    @submit.prevent="create"
  >

    <!--HEADER-->

    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
        :disabled="$v.project.$invalid"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
    </div>

    <loading v-if="loading" />

    <!--FORM-->

    <div
      class="project-information"
      v-else
    >
      <div class="project-form">

        <!-- PROJECT TITLE -->

        <div class="input-container">
          <label
            class="label"
            :class="{error: $v.project.title.$error}"
          >
            {{ projectMetadata.fields.title.label }}
          </label>
          <input
            type="text"
            :placeholder="projectMetadata.fields.title.watermark"
            class="light-primary-input"
            v-model="project.title"
            @change="$v.project.title.$touch"
            :class="{error: $v.project.title.$error}"
          >
          <validation-message
            :validation="$v.project.title"
            :metadata="projectMetadata.fields.title"
          />
        </div>

        <!-- RELEASE -->

        <div class="input-container">
          <label class="label">
            {{ projectMetadata.fields.releaseId.label }}
          </label>
          <div class="dropdown-container">
            <input
              type="text"
              :placeholder="projectMetadata.fields.releaseId.watermark"
              class="light-primary-input"
              :class="{'showing-list' : showReleaseList}"
              @click="toggleReleaseList"
              :value="selectedRelease.title"
              readonly
              ref="releaseId"
            >
            <img
              src="../assets/chevron-down.svg"
              class="arrow"
              :class="!showReleaseList ? 'down' : 'up'"
              @click="toggleReleaseList"
            >
            <div
              class="dropdown-list"
              v-if="showReleaseList"
              v-on-clickaway="toggleReleaseList.bind(undefined, false)"
            >
              <p
                v-for="release in releases"
                :key="release.id"
                @click="selectRelease(release)"
              >
                {{ release.title }}
              </p>
            </div>
          </div>
          <validation-message
            :validation="$v.project.releaseId"
            :metadata="projectMetadata.fields.releaseId"
          />
        </div>

        <!-- STATUS -->

        <div class="input-container">
          <label class="label">
            {{ projectMetadata.fields.status.label }}
          </label>
          <div class="dropdown-container">
            <input
              type="text"
              :placeholder="projectMetadata.fields.status.watermark"
              class="light-primary-input"
              :class="{'showing-list': showStatusList}"
              @click="toggleStatusList"
              :value="project.status"
              readonly
              ref="status"
            >
            <img
              src="../assets/chevron-down.svg"
              class="arrow"
              :class="!showStatusList ? 'down' : 'up'"
              @click="toggleStatusList"
            >
            <div
              class="dropdown-list"
              v-if="showStatusList"
              v-on-clickaway="toggleStatusList.bind(undefined, false)"
            >
              <p
                v-for="(status, index) in statuses"
                :key="index"
                @click="selectStatus(status)"
              >
                {{ status }}
              </p>
            </div>
          </div>
          <validation-message
            :validation="$v.project.status"
            :metadata="projectMetadata.fields.status"
          />
        </div>

        <!-- DUE DATE -->

        <div class="input-container">
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
            <validation-message
              :validation="$v.project.dueDate"
              :metadata="projectMetadata.fields.dueDate"
            />
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="input-container">
          <label
            class="label"
            :class="{error: $v.project.description.$error}"
          >
            {{ projectMetadata.fields.description.label }}
          </label>
          <div class="textarea-container">
            <textarea
              :placeholder="projectMetadata.fields.description.watermark"
              class="light-primary-input"
              v-model="project.description"
              @change="$v.project.description.$touch"
              :class="{error: $v.project.description.$error}"
              @keyup.ctrl.enter="create"
            ></textarea>
            <p
              class="character-count"
              v-if="project.description"
            >
              {{ project.description.length }}/512
            </p>
          </div>
          <validation-message
            :validation="$v.project.description"
            :metadata="projectMetadata.fields.description"
          />
        </div>
      </div>
      <div
        class="response-message"
        v-if="message"
      >
        <p :class="status === 200 ? 'success' : 'error'">
          {{ message }}
        </p>
      </div>
    </div>
    <popup
      v-if="showingPopup"
      :message="'Leave new project view?'"
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
  mixins: [clickaway],
  name: 'NewProjectForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      showReleaseList: false,
      project: null,
      projectMetadata: server.metadata.models.Project,
      selectedRelease: null,
      loading: false,
      statuses: ['active', 'on-hold', 'queued', 'done'],
      showStatusList: false
    }
  },
  validations () {
    return {
      project: {
        title: server.metadata.models.Project.fields.title.createValidator(),
        description: server.metadata.models.Project.fields.description.createValidator(),
        releaseId: server.metadata.models.Project.fields.releaseId.createValidator(),
        dueDate: server.metadata.models.Project.fields.dueDate.createValidator(),
        status: server.metadata.models.Project.fields.status.createValidator()
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
        return 'Your project was created.'
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
      'releases',
      'Project',
      'Release'
    ])
  },
  methods: {
    confirmPopup () {
      this.showingPopup = false
      this.project = new this.Project()
      this.$v.project.$reset()
      this.loading = true
      this.listProjects([undefined, () => {
        this.loading = false
      }])
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.project.$anyDirty) {
        this.showingPopup = true
      }
    },
    create () {
      this.loading = true
      this.project.save().send().then(resp => {
        this.status = resp.status
        this.listProjects([resp.json.id])
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
      this.project.releaseId = release.id
      this.selectedRelease = this.releases.find(release => {
        return release.id === this.project.releaseId
      })
      this.showReleaseList = false
      this.$refs.releaseId.focus()
    },
    toggleStatusList (value) {
      if (typeof value === 'boolean') {
        this.showStatusList = value
      } else {
        this.showStatusList = !this.showStatusList
      }
    },
    selectStatus (status) {
      this.project.status = status
      this.showStatusList = false
      this.$refs.status.focus()
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
  components: {
    ValidationMessage,
    Popup,
    Loading
  }
}
</script>
