<template>
  <div id="homeRightColumn"  v-on-clickaway="showPopups">
    <div class="header">
      <button
        type="button"
        class="new-project-button"
        v-if="!editing"
        @click="activateNewProject"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Project
      </button>
      <button
        type="button"
        class="save-button"
        v-else
        v-on="{click: project.id ? save : create}"
        @click="editing = !editing"
        :disabled="$v.project.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>
    <div class="tabs">
      <div class="icons" :class="{selected: selectedTab === 'details'}" @click="selectedTab = 'details'">
        <img :src="detailsSrc" class="icon-detail-icon-maestro details-icon">
      </div>
      <div class="icons" :class="{selected: selectedTab === 'event'}" @click="selectedTab = 'event'">
        <img :src="eventSrc" class="icon-event-icon event-icon">
      </div>
      <div class="icons" :class="{selected: selectedTab === 'attachment'}" @click="selectedTab = 'attachment'">
        <img :src="attachmentSrc" class="attachment-icon">
      </div>
      <div class="icons" :class="{selected: selectedTab === 'link'}" @click="selectedTab = 'link'">
        <img :src="linkSrc" class="link-icon">
      </div>
    </div>
    <div class="project-information" v-if="selectedTab === 'details'">
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
            @blur="$v.project.title.$touch"
            @focus="[$v.project.title.$reset, editing = true]"
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
              :class="{'show-release-list' : showReleaseList}"
              @click="releaseListVisibility"
              :disabled="project.id"
              @focus="editing = true"
              v-model="selectedRelease"
              readonly
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showReleaseList ? 'down' : 'up'"
                 @click="releaseListVisibility"
                 v-if="!project.id"
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
          <label class="label" :class="{error: $v.project.dueDate.$error}">
            Due date
          </label>
          <div class="input-container">
            <input
            type="text"
            placeholder="MM/DD/YY"
            class="light-primary-input"
            v-model="project.dueDate"
            :class="{error: $v.project.dueDate.$error}"
            @click="showDatepicker = !showDatepicker"
            @focus="editing = true"
          >
          <div v-if="showDatepicker" class="datepicker">
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="wrapperStyles"
              @dateSelected="setDate($event)"
              :date="project.dueDate"
            />
          </div>
          </div>
          <div v-if="$v.project.dueDate.$error" class="validation-message">
            <span v-if="!$v.project.dueDate.required">This field is required</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter due-date</span>
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
            @focus="editing = true"
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
      <p :class="createStatus === 200 ? 'success' : updateStatus === 200 ? 'success' : 'error'">
        {{ message }}
      </p>
    </div>
    <div class="popup" v-if="showNewProjectPopup">
      <div class="newProjectPopupBox">
        <p>Leave new project view?</p>
        <div class="buttonContainer">
          <button type="button" class="yes" @click="confirmPopup('new')">Yes</button>
          <button type="button" class="no" @click="cancelPopup('new')">No</button>
        </div>
      </div>
    </div>
    <div class="popup" v-if="showUpdatePopup && $v.project.$anyDirty">
      <div class="updatePopupBox">
        <p>Save changes?</p>
        <div class="buttonContainer">
          <button type="button" class="yes" @click="confirmPopup('update')">Yes</button>
          <button type="button" class="no" @click="cancelPopup('update')">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import CustomDatepicker from 'vue-custom-datepicker'
import { server } from './../server'
import { required, maxLength } from 'vuelidate/lib/validators'
import { updateDate } from '../helpers'
import moment from 'moment'

export default {
  mixins: [ clickaway ],
  name: 'HomeRightColumn',
  data () {
    return {
      popupType: null,
      showNewProjectPopup: false,
      showUpdatePopup: false,
      selectedRelease: null,
      managerId: server.authenticator.member.id,
      updateStatus: null,
      createStatus: null,
      selectedTab: 'details',
      editing: false,
      showReleaseList: false,
      releases: [],
      showDatepicker: false,
      project: {
        title: null,
        dueDate: null,
        description: '',
        releaseId: null
      },
      wrapperStyles: {
        width: '100%',
        background: '#5E5375',
        color: '#ffffff',
        position: 'relative'
      }
    }
  },
  validations: {
    project: {
      title: {
        required,
        maxLength: maxLength(50)
      },
      dueDate: {
        required
      },
      description: {
        maxLength: maxLength(512)
      }
    }
  },
  computed: {
    message () {
      if (this.createStatus === 600 || this.updateStatus === 600) {
        return 'Repetitive Title'
      } else if (this.createStatus === 607) {
        return 'Release Not Found'
      } else if (this.createStatus === 608) {
        return 'Manager Not Found'
      } else if (this.createStatus === 701 || this.updateStatus === 701) {
        return 'Invalid Due Date Format'
      } else if (this.createStatus === 703 || this.updateStatus === 703) {
        return 'At Most 512 Characters Valid For Description'
      } else if (this.createStatus === 704 || this.updateStatus === 704) {
        return 'At Most 50 Characters Valid For Title'
      } else if (this.updateStatus === 403) {
        return 'Forbidden'
      } else if (this.status === 707 || this.updateStatus === 707) {
        return 'Invalid Field'
      } else if (this.status === 708 || this.updateStatus === 708) {
        return 'Empty Form'
      } else if (this.createStatus === 710) {
        return 'Member Not Found'
      } else if (this.createStatus === 711) {
        return 'Already Subscribed'
      } else if (this.createStatus === 727) {
        return 'Title Is Null'
      } else if (this.createStatus === 728) {
        return 'Due Date Is Null'
      } else if (this.createStatus === 734) {
        return 'Manager Id Not In Form'
      } else if (this.updateStatus === 200) {
        return 'Your project was updated.'
      } else if (this.createStatus === 200) {
        return 'Your project was created.'
      } else {
        return null
      }
    },
    eventSrc () {
      return require(`@/assets/event${this.selectedTab === 'event' ? '-selected' : ''}.svg`)
    },
    detailsSrc () {
      return require(`@/assets/details${this.selectedTab === 'details' ? '-selected' : ''}.svg`)
    },
    attachmentSrc () {
      return require(`@/assets/attachment${this.selectedTab === 'attachment' ? '-selected' : ''}.svg`)
    },
    linkSrc () {
      return require(`@/assets/link${this.selectedTab === 'link' ? '-selected' : ''}.svg`)
    },
    ...mapState([
      'selectedProject'
    ])
  },
  watch: {
    'selectedProject': {
      deep: true,
      handler (newValue) {
        if (newValue) {
          this.project = Object.assign({}, updateDate(newValue))
        }
      }
    }
  },
  methods: {
    confirmPopup (type) {
      if (type === 'new') {
        this.showNewProjectPopup = false
        this.editing = false
        this.listProjects()
      } else if (type === 'update') {
        this.showUpdatePopup = false
        this.save()
      }
    },
    cancelPopup (type) {
      if (type === 'new') {
        this.showNewProjectPopup = false
      } else if (type === 'update') {
        this.showUpdatePopup = false
        this.editing = false
        this.getSelectedProject()
      }
    },
    showPopups () {
      if (this.editing && this.selectedTab === 'details') {
        if (this.project.id) {
          this.showUpdatePopup = true
        } else {
          this.showNewProjectPopup = true
        }
      }
    },
    activateNewProject () {
      this.editing = !this.editing
      this.updateStatus = null
      this.clearSelected()
      this.$v.$reset()
    },
    save () {
      server
        .request(`projects/${this.project.id}`)
        .setVerb('UPDATE')
        .addParameters({
          title: this.project.title,
          description: this.project.description,
          dueDate: moment(this.project.dueDate).format('YYYY-MM-DD')
        })
        .send()
        .then(resp => {
          this.editing = false
          this.updateStatus = resp.status
          this.listProjects()
          setTimeout(() => {
            this.updateStatus = null
          }, 3000)
        }).catch(resp => {
          this.updateStatus = resp.status
        })
    },
    create () {
      server
        .request('projects')
        .setVerb('CREATE')
        .addParameters({
          title: this.project.title,
          description: this.project.description,
          dueDate: moment(this.project.dueDate).format('YYYY-MM-DD'),
          managerId: this.managerId,
          releaseId: this.project.releaseId
        })
        .send()
        .then(resp => {
          this.createStatus = resp.status
          this.listProjects()
          setTimeout(() => {
            this.createStatus = null
          }, 3000)
        }).catch(resp => {
          this.createStatus = resp.status
        })
    },
    setDate (date) {
      // Checking if the date has been changed
      if (this.project.dueDate !== moment(date).format('MM/DD/YYYY')) {
        this.$v.project.dueDate.$touch()
      }
      this.project.dueDate = moment(date).format('MM/DD/YYYY')
      this.showDatepicker = false
    },
    getReleases () {
      server
        .request('releases')
        .setVerb('LIST')
        .send()
        .then(resp => {
          this.releases = resp.json
        }).catch()
    },
    releaseListVisibility () {
      this.showReleaseList = !this.showReleaseList
    },
    selectRelease (release) {
      this.project.releaseId = release.id
      this.selectedRelease = release.title
      this.showReleaseList = false
    },
    getSelectedProject () {
      this.project = Object.assign({}, updateDate(this.selectedProject))
    },
    ...mapMutations([
      'clearSelected'
    ]),
    ...mapActions([
      'listProjects'
    ])
  },
  components: {
    CustomDatepicker
  },
  mounted () {
    this.getSelectedProject()
    this.getReleases()
  }
}
</script>
