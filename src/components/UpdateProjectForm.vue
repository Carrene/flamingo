<template>
  <div id="updateProjectForm" v-on-clickaway="showPopup">
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if="selectedScope === 'Projects' && selectedProject.id && project.__status__ !== 'dirty'"
        @click="clearSelected"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Project
      </button>
      <button
        type="button"
        class="light-primary-button small"
        v-else
        @click="save"
        :disabled="$v.project.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>
    <div class="project-information">
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
          <div v-if="$v.project.title.$error" class="validation-message">
            <span v-if="!$v.project.title.required">This field is required</span>
            <span v-if="!$v.project.title.maxLength">This field should be less than 50 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter project title</span>
          </div>
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
              v-model="project.releaseId"
              disabled
              readonly
            >
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
              :value="setDuedate"
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
          <div v-if="$v.project.description.$error" class="validation-message">
            <span v-if="!$v.project.description.maxLength">This field should be less than 512 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter description</span>
          </div>
        </div>
      </form>
    </div>
    <div class="response-message">
      <p :class="status === 200 ? 'success' : 'error'">
        {{ message }}
      </p>
    </div>
    <popup
      v-if="showingPpup && $v.project.$anyDirty"
      :message="'Save changes?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import server from './../server'
import moment from 'moment'
import Popup from './Popup'

export default {
  mixins: [ clickaway ],
  name: 'ProjectForm',
  data () {
    return {
      showingPpup: false,
      memberId: server.authenticator.member.id,
      status: null,
      selectedTab: 'details',
      project: new server.metadata.models.Project()
    }
  },
  validations () {
    return {
      project: {
        title: server.metadata.models.Project.fields.title.createValidator(),
        description: server.metadata.models.Project.fields.description.createValidator()
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
    setDuedate () {
      if (this.project.dueDate) {
        return moment(this.project.dueDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'selectedProject',
      'selectedScope'
    ])
  },
  watch: {
    'selectedProject.id' (newValue) {
      if (newValue) {
        this.getSelectedProject()
      }
    }
  },
  methods: {
    confirmPopup () {
      this.showingPpup = false
      this.save()
    },
    cancelPopup () {
      this.showingPpup = false
      this.getSelectedProject()
      this.$v.project.$reset()
    },
    showPopup () {
      if (this.project.__status__ === 'dirty') {
        this.showUpdatePopup = true
      }
    },
    save () {
      this.project.save().send().then(resp => {
        this.status = resp.status
        this.listProjects()
        setTimeout(() => {
          this.status = null
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        setTimeout(() => {
          this.status = null
        }, 3000)
      })
    },
    getSelectedProject () {
      server.metadata.models.Project.get(this.selectedProject.id).send().then(resp => {
        this.project = resp.models[0]
      })
    },
    ...mapMutations([
      'clearSelected'
    ]),
    ...mapActions([
      'listProjects'
    ])
  },
  components: {
    Popup
  },
  mounted () {
    this.getSelectedProject()
  }
}
</script>
