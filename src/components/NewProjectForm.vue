<template>
  <div id="newProjectForm" v-on-clickaway.capture="showPopup">

    <!--HEADER-->

    <div class="header">
      <button
        type="button"
        class="light-primary-button small"
        @click="[loading = true, create()]"
        :disabled="$v.project.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>

    <loading v-if="loading"/>

    <!--FORM-->

    <div class="project-information" v-else>
      <form class="project-form">
        <div class="project-title">

          <!-- PROJECT TITLE -->

          <label class="label" :class="{error: $v.project.title.$error}">
            Project title
          </label>
          <input
            type="text"
            placeholder="Project"
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
            Release (optional)
          </label>
          <div class="release-container">
            <input
              type="text"
              placeholder="Release"
              class="light-primary-input"
              :class="{'show-release-list' : showReleaseList}"
              @click="toggleReleaseList"
              :value="selectedRelease.title"
              readonly
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showReleaseList ? 'down' : 'up'"
                 @click="toggleReleaseList"
            >
            <div class="release-list" v-if="showReleaseList">
              <p
                v-for="release in releases"
                :key="release.id"
                @click="selectRelease(release)"
              >
                {{ release.title }}
              </p>
            </div>
          </div>
          <div class="helper">
            <span>*Please enter release</span>
          </div>
        </div>

        <!-- DUE DATE -->

        <div class="project-due-date">
          <label class="label">
            Due date
          </label>
          <div class="input-container">
            <input
              type="text"
              placeholder="Project due date"
              class="light-primary-input"
              :value="dueDate"
              disabled
              readonly
            >
          </div>
          <div>
            <span class="helper">*Project due date</span>
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="project-description">
          <label class="label" :class="{error: $v.project.description.$error}">Description (optional)</label>
          <div class="textarea-container">
            <textarea
              placeholder="Description"
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
      </form>
      <div class="response-message" v-if="message">
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
  </div>
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
  name: 'NewProjectForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      showReleaseList: false,
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
      this.listProjects(() => {
        this.loading = false
      })
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
      this.project.save().send().then(resp => {
        this.loading = false
        this.status = resp.status
        this.listProjects()
        setTimeout(() => {
          this.status = null
        }, 3000)
      }).catch(resp => {
        this.loading = false
        this.status = resp.status
        setTimeout(() => {
          this.status = null
        }, 3000)
      })
    },
    toggleReleaseList () {
      this.showReleaseList = !this.showReleaseList
    },
    selectRelease (release) {
      this.project.releaseId = release.id
      this.showReleaseList = false
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
