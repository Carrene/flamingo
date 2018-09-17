<template>
  <div id="homeRightColumn">
    <div class="header">
      <button type="button" class="new-project-button" v-if="!editing" @click="[editing = true, clearSelected()]">
        <img src="./../assets/plus-icon.svg" class="plus-icon">
        New Project
      </button>
      <button type="button" class="save-button" v-if="editing" v-on="{click: project.id ? save : create}">
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

          <p class="label" :class="$v.project.title.$error ? 'error' : null">
            Project title
          </p>
          <input
            type="text"
            placeholder="Project"
            class="light-primary-input"
            v-model="project.title"
            @blur="$v.project.title.$touch"
            @focus="[$v.project.title.$reset, editing = true]"
            :class="$v.project.title.$error ? 'error' : null"
          >
          <div v-if="$v.project.title.$error" class="validation-message">
            <span v-if="!$v.project.title.required">This field is required</span>
            <span v-if="!$v.project.title.maxLength">This field should 50 character</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter project title</span>
          </div>
        </div>

        <!--RELEASE-->

         <div class="release">
          <p class="label" :class="$v.project.release.$error ? 'error' : null">
            Release
          </p>
          <div class="release-container">
            <input
              type="text"
              placeholder="Release"
              class="light-primary-input"
              :class="showReleaseList ? 'show-release-list' : null"
              @click="showReleaseList = true"
              :disabled="project.id"
              @focus="editing = true"
              v-model="selectedRelease"
            >
            <img src="../assets/down.svg"
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
          <div v-if="$v.project.release.$error" class="validation-message">
            <span v-if="!$v.project.release.required">This field is required</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter release</span>
          </div>
        </div>

        <!-- DUE DATE -->

        <div class="new-project-due-date">
          <p class="label" :class="$v.project.dueDate.$error ? 'error' : null">
            Due date
          </p>
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

        <div class="new-project-description">
          <p class="label">Description (optional)</p>
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
            <span v-if="!$v.project.description.maxLength">This field should 512 character</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter description</span>
          </div>
        </div>
      </form>
    </div>
    <div class="response-message" v-if="message">
      <span :class="status !== 200 ? 'error' : 'success'">
        {{ message }}
      </span>
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
      status: null,
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
        required: required,
        maxLength: maxLength(50)
      },
      dueDate: {
        required
      },
      release: {
        required
      },
      description: {
        maxLength: maxLength(512)
      }
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
    'selectedProject': {
      deep: true,
      handler (newValue) {
        console.log(newValue)
        this.project = Object.assign({}, updateDate(newValue))
      }
    }
  },
  methods: {
    save () {
      console.log('SAVE')
      server
        .request(`projects/${this.selectedProject.id}`)
        .setVerb('UPDATE')
        .addParameters({
          title: this.project.title,
          description: this.project.description,
          dueDate: moment(this.project.dueDate).format('YYYY-MM-DD')
        })
        .send()
        .then(resp => {
          this.status = resp.status
          if (resp.status === 200) {
            this.listProjects()
          }
        })
    },
    create () {
      console.log('CREATE')
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
          this.status = resp.status
          if (resp.status === 200) {
            this.listProjects()
            console.log(resp.status)
          }
        })
    },
    setDate (date) {
      this.project.dueDate = moment(this.date).format('MM/DD/YYYY')
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
    getManager () {
      server
        .request('managers')
        .setVerb('LIST').send().then(resp => {
          this.managers = resp.json
        })
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
    this.getManager()
  }
}
</script>
