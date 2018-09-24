<template>
  <div id="homeRightColumn">
    <div class="header">
      <button
        type="button"
        class="new-project-button"
        v-if="!editing"
        @click="[editing = true, updateStatus = null, clearSelected()]"
      >
        <img src="./../assets/plus-icon.svg" class="plus-icon">
        New Project
      </button>
      <button
        type="button"
        class="save-button"
        v-else
        v-on="{click: project.id ? save : create}"
      >
        <img src="./../assets/save-icon.svg" class="save-icon">
        Save
      </button>
    </div>
    <div class="tabs">
      <div class="icons" :class="{selected: selectedTab === 'details'}" @click="selectedTab = 'details'">
        <i class="icon-detail-icon-maestro"></i>
      </div>
      <div class="icons" :class="{selected: selectedTab === 'event'}" @click="selectedTab = 'event'">
        <i class="icon-event-icon"></i>
        </div>
    </div>
    <div class="project-information" v-if="selectedTab === 'details'">
      <form class="project-form">
        <div class="project-title">

          <!-- PROJECT TITLE -->

          <label class="label" :class="$v.project.title.$error ? 'error' : null">
            Project title
          </label>
          <input
            type="text"
            placeholder="Project"
            class="light-primary-input"
            v-model="project.title"
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

        <!--RELEASE-->

         <div class="project-release">
          <label class="label">
            Release (optional)
          </label>
          <div class="release-container">
            <input
              type="text"
              placeholder="Release"
              class="light-primary-input"
              :class="showReleaseList ? 'show-release-list' : null"
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
          <label class="label" :class="$v.project.dueDate.$error ? 'error' : null">
            Due date
          </label>
          <div class="input-container">
            <input
            type="text"
            placeholder="MM/DD/YY"
            class="light-primary-input"
            v-model="project.dueDate"
            @blur="[$v.project.dueDate.$touch]"
            :class="$v.project.dueDate.$error ? 'error' : null"
            @click="showDatepicker = true"
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
          <label class="label">Description (optional)</label>
          <div class="textarea-container">
            <textarea
            placeholder="Type ..."
            class="light-primary-input"
            v-model="project.description"
            :class="$v.project.description.$error ? 'error' : null"
            @focus="() => {editing = true}"
          ></textarea>
            <p class="character-count">{{ selectedProject.description.length }}/512</p>
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
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import CustomDatepicker from 'vue-custom-datepicker'
import server from './../server'
import { required, maxLength } from 'vuelidate/lib/validators'
import { updateDate } from '../helpers'
import moment from 'moment'

export default {
  name: 'HomeRightColumn',
  data () {
    return {
      selectedRelease: null,
      managerId: 2,
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
    ...mapState([
      'selectedProject'
    ])
  },
  watch: {
    'selectedProject': {
      deep: true,
      handler (newValue) {
        this.project = Object.assign({}, updateDate(newValue))
      }
    }
  },
  methods: {
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
          if (resp.status === 200) {
            this.listProjects()
          }
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
          if (resp.status === 200) {
            this.listProjects()
          }
        })
    },
    setDate (date) {
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
        })
    },
    releaseListVisibility () {
      this.showReleaseList = !this.showReleaseList
    },
    selectRelease (release) {
      this.project.releaseId = release.id
      this.selectedRelease = release.title
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
    this.project = Object.assign({}, updateDate(this.selectedProject))
    this.getReleases()
  }
}
</script>
