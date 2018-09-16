<template>
  <div id="homeRightColumn">
    <div class="header">
      <button type="button" class="new-project-button" v-if="!editing" @click="clearSelected">
        <img src="./../assets/plus-icon.svg" class="plus-icon">
        New Project
      </button>
      <button type="button" class="save-button" v-if="editing" @click="save">
        <img src="./../assets/save-icon.svg" class="save-icon">
        Save
      </button>
    </div>
    <div class="tabs">
      <div class="icons" :class="selectedTab === 'details' ? 'selected' : null" @click="selectedTab = 'details'">
        <i class="icon-detail-icon-maestro"></i>
      </div>
      <div class="icons" :class="selectedTab === 'event' ? 'selected' : null" @click="selectedTab = 'event'">
        <i class="icon-event-icon"></i>
        </div>
    </div>
    <div class="project-information" v-if="selectedTab === 'details'">
      <form class="new-project-form">
        <div class="new-project-title">

          <!-- PROJECT TITLE -->

          <p class="label" :class="$v.projectTitle.$error ? 'error' : null">
            Project title
          </p>
          <input
            type="text"
            placeholder="Project"
            class="light-primary-input"
            v-model="projectTitle"
            @blur="$v.projectTitle.$touch"
            @focus="[$v.projectTitle.$reset, editing = true]"
            :class="$v.projectTitle.$error ? 'error' : null"
          >
          <div v-if="$v.projectTitle.$error" class="validation-message">
            <span v-if="!$v.projectTitle.required">This field is required</span>
            <span v-if="!$v.projectTitle.maxLength">This field should 50 character</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter project title</span>
          </div>
        </div>

        <!--RELEASE-->

         <div class="release">
          <p class="label" :class="$v.release.$error ? 'error' : null">
            Release
          </p>
          <div class="release-container">
            <input
              type="text"
              placeholder="Release"
              class="light-primary-input"
              :class="showReleaseList ? 'show-release-list' : null"
              v-model="release"
              @click="showReleaseList = true"
              :disabled="selectedProject !== null"
              @focus="editing = true"
            >
            <img src="../assets/down.svg"
                 class="down-icon"
                 :class="!showReleaseList ? 'down' : 'up'"
                 @click="releaseListVisibility"
                 v-if="selectedProject === null"
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
          <div v-if="$v.release.$error" class="validation-message">
            <span v-if="!$v.release.required">This field is required</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter release</span>
          </div>
        </div>

        <!-- DUE DATE -->

        <div class="new-project-due-date">
          <p class="label" :class="$v.dueDate.$error ? 'error' : null">
            Due date
          </p>
          <div class="input-container">
            <input
            type="text"
            placeholder="MM/DD/YY"
            class="light-primary-input"
            v-model="dueDate"
            @blur="[$v.dueDate.$touch]"
            :class="$v.dueDate.$error ? 'error' : null"
            @click="showDatepicker = true"
            @focus="editing = true"
          >
          <div v-if="showDatepicker" class="datepicker">
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="wrapperStyles"
              @dateSelected="setDate($event)"
            />
          </div>
          </div>
          <div v-if="$v.dueDate.$error" class="validation-message">
            <span v-if="!$v.dueDate.required">This field is required</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter due-date</span>
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="new-project-description">
          <p class="label">Description (optional)</p>
          <div class="textarea-container">
            <textarea
            placeholder="Type ..."
            class="light-primary-input"
            v-model="$v.description.$model"
            :class="$v.description.$error ? 'error' : null"
            @focus="() => {editing = true}"
          ></textarea>
            <p class="character-count">{{ description.length }}/512</p>
          </div>
          <div v-if="$v.description.$error" class="validation-message">
            <span v-if="!$v.description.maxLength">This field should 512 character</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter description</span>
          </div>
        </div>
      </form>
    </div>
    <div class="response-message" v-if="message">
      <span class="error" v-if="updateStatus !== 200">{{ message }}</span>
      <span class="success" v-if="updateStatus === 200">{{ message }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import CustomDatepicker from 'vue-custom-datepicker'
import server from './../server'
import { required, maxLength } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'HomeRightColumn',
  data () {
    return {
      updateStatus: null,
      selectedTab: 'details',
      editing: false,
      projectTitle: null,
      selectedReleaseId: null,
      showReleaseList: false,
      release: null,
      releases: [],
      selectedManagerId: null,
      showManagerList: false,
      manager: null,
      managers: [],
      dueDate: null,
      showDatepicker: false,
      description: '',
      showResponseMessage: true,
      status: null,
      wrapperStyles: {
        width: '100%',
        background: '#5E5375',
        color: '#ffffff',
        position: 'relative'
      }
    }
  },
  validations: {
    projectTitle: {
      required: required,
      maxLength: maxLength(50)
    },
    release: {
      required: required
    },
    manager: {
      required
    },
    dueDate: {
      required
    },
    description: {
      maxLength: maxLength(512)
    }
  },
  computed: {
    message () {
      if (this.status === 600) {
        return 'Repetitive Title'
      } else if (this.status === 701) {
        return 'Invalid Due Date Format'
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
        return 'Your project successfully Update'
      } else {
        return null
      }
    },
    ...mapState([
      'selectedProject'
    ])
  },
  watch: {
    'selectedProject.id': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.projectTitle = this.selectedProject.title
        this.dueDate = moment(this.selectedProject.dueDate).format('MM/DD/YYYY')
        this.description = this.selectedProject.description
      }
    }
  },
  methods: {
    save () {
      server
        .request(`projects/${this.selectedProject.id}`)
        .setVerb('UPDATE')
        .addParameters({
          title: this.projectTitle,
          description: this.description,
          dueDate: moment(this.dueDate).format('YYY-MM-DD')
        })
        .send()
        .then(resp => {
          this.status = resp.status
          if (resp.status === 200) {
            this.listProjects()
          }
        })
    },
    setDate (date) {
      this.dueDate = date
      this.showDatepicker = false
    },
    getRelease () {
      server
        .request('releases')
        .setVerb('LIST')
        .send()
        .then(resp => {
          this.releases = resp.json
        })
    },
    releaseListVisibility () {
      this.showReleaseList = !this.showReleaseList
    },
    getManager () {
      server
        .request('managers')
        .setVerb('LIST').send().then(resp => {
          this.managers = resp.json
        })
    },
    selectRelease (release) {
      this.selectedReleaseId = release.id
      this.release = release.title
      this.showReleaseList = false
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
    this.projectTitle = this.selectedProject.title
    this.description = this.selectedProject.description
    this.dueDate = moment(this.selectedProject.dueDate).format('MM/DD/YYYY')
    this.getRelease()
    this.getManager()
  }
}
</script>
