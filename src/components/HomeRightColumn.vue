<template>
  <div id="homeRightColumn">
    <div class="header">
      <button type="button" class="new-project-button" v-if="!showNewProject" @click="showNewProject = true">
        <img src="./../assets/plus-icon.svg" class="plus-icon">
        New Project
      </button>
      <button type="button" class="save-button" v-if="showNewProject">
        <img src="./../assets/save-icon.svg" class="save-icon">
        Save
      </button>
    </div>
    <div class="tabs">
      <div class="icons"><img src="./../assets/detail-icon.svg" class="tabs-icon"></div>
      <div class="icons"><img src="./../assets/event-log-icon.svg" class="tabs-icon"></div>
    </div>
    <div v-if="!showNewProject" class="project-information">
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
            @focus="$v.projectTitle.$reset"
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
            >
            <img src="../assets/down.svg"
                 class="down-icon"
                 :class="!showReleaseList ? 'down' : 'up'"
                 @click="releaseListVisibility">
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
          <p>Description (optional)</p>
          <div class="textarea-container">
            <textarea
            placeholder="Type ..."
            class="light-primary-input"
            v-model="$v.description.$model"
            :class="$v.description.$error ? 'error' : null"
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
      <!--<div class="description-container">-->
        <!--<p class="description-title">Description</p>-->
        <!--<p class="description">{{ selectedProject.description }}</p>-->
        <!--<p class="character-count">{{ selectedProject.description.length }}/512</p>-->
      <!--</div>-->
      <!--<div class="project-date">-->
        <!--<p>Due-Date</p>-->
        <!--<p class="due-date">{{ moment(selectedProject.dueDate).format('DD/MM/YYYY') }}</p>-->
        <!--<p>Create At</p>-->
        <!--<p class="create-at-date">{{ moment(selectedProject.createdAt).format('DD/MM/YYYY') }}</p>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CustomDatepicker from 'vue-custom-datepicker'
import server from './../server'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'HomeRightColumn',
  data () {
    return {
      showNewProject: false,
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
  computed: mapState([
    'selectedProject'
  ]),
  methods: {
    setDate (date) {
      this.dueDate = date
      this.showDatepicker = false
    },
    createProject () {
      server
        .request('projects')
        .setVerb('CREATE')
        .addParameters({
          title: this.projectTitle,
          description: this.description,
          dueDate: this.dueDate,
          managerId: this.selectedManagerId,
          releaseId: this.selectedReleaseId
        })
        .send()
        .then(resp => {
          this.status = resp.status
          console.log(this.description)
          if (resp.status === 200) {
            setTimeout(() => {
              this.resetForm()
              this.$emit('projectCreated')
            }, 3000)
          }
        })
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
    selectManager (manager) {
      this.selectedManagerId = manager.id
      this.manager = manager.title
      this.showManagerList = false
    },
    managerListVisibility () {
      this.showManagerList = !this.showManagerList
    }
  },
  components: {
    CustomDatepicker
  },
  mounted () {
    this.getRelease()
    this.getManager()
  }
}
</script>
