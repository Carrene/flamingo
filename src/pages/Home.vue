<template>
  <div class="home">
    <div class="left-column">
      <div class="button-field">
        <button type="button" class="button">New Project</button>
      </div>
      <div class="projects">
        <div
          class="project-details"
          v-for="project in projects"
          :key="project.id"
          :class="[project.id, {selected: project.id === selectedProjectId}]"
          @click="selectedProjectId = project.id"
        >
          <div class="row-1">
            <p class="project-name">{{ project.title}}</p>
            <div class="event-log">
              <p class="number">{{ eventLogMessage }}</p>
              <img src="../assets/event-icon.svg" class="event-icon icons">
            </div>
            <div class="unread-msg">
              <p class="number">{{ unreadMessage }}</p>
              <img src="../assets/message-icon.svg" class="unread-msg-icon icons">
            </div>
          </div>
          <div class="row-2">
            <div class="status" :class="project.status">
              <img
                src="../assets/atrisk-icon.svg"
                class="status-icon"
                v-if="project.status === 'atrisk' || project.status === 'on-hold'"
              >
              <img
                src="../assets/ontime-icon.svg"
                class="status-icon"
                v-if="project.status === 'done' || project.status === 'in-progress'"
              >
              <img
                src="../assets/delayed-icon.svg"
                class="status-icon"
                v-if="project.status === 'delayed'"
              >
              <p class="status-type">
                {{ project.status }}
              </p>
            </div>
            <p class="activity">last activity:30min ago</p>
          </div>
        </div>
      </div>
    </div>
    <div class="chat"></div>
    <div class="right-column">
      <div v-if="selectedProject" class="project-information">
        <img src="../assets/description-icon.svg" class="information-icon">
        <p class="title">Description</p>
        <p class="text">{{ selectedProject.description }}</p>
        <img src="../assets/due-date-icon.svg" class="information-icon">
        <div class="due-date">
          <p>Due-Date</p>
          <p class="date">{{ moment(selectedProject.dueDate).format('DD/MM/YYYY') }}</p>
        </div>
        <img src="../assets/create-at-icon.svg" class="information-icon">
        <div class="create-at">
          <p>Create At</p>
          <p class="date">{{ moment(selectedProject.createdAt).format('DD/MM/YYYY') }}</p>
        </div>
      </div>
      <div class="issues">
        <div class="button-field">
          <p>Issues</p>
          <button type="button" class="button">
            <img src="../assets/plus-add-image.svg" class="plus-icon">
          </button>
        </div>
        <div class="issues-list">
          <div class="issues-details" v-if="issues.length" v-for="issue in issues" :key="issue.id">
            <p class="issue-name">{{ issue.title}}</p>
            <div class="status" :class="issue.status">
              <p class="status-type">
                {{ ['atrisk', 'on-hold', 'ontime'].includes(issue.status) ? 'in-progress' : issue.status }}
              </p>
              <img
                src="../assets/atrisk-icon.svg"
                class="status-icon" :class="issue.status"
                v-if="issue.status === 'atrisk'"
              >
              <img
                src="../assets/ontime-icon.svg"
                class="status-icon" :class="issue.status"
                v-if="issue.status === 'in-progress'"
              >
              <img
                src="../assets/delayed-icon.svg"
                class="status-icon"
                :class="issue.status"
                v-if="issue.status === 'on-hold'"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import server from './../server'
import moment from 'moment'

export default {
  name: 'Home',
  data () {
    return {
      projects: [],
      selectedProjectId: null,
      issues: [],
      // TODO: Change below data to dynamic
      unreadMessage: '299',
      eventLogMessage: '52'

    }
  },
  watch: {
    'selectedProjectId' (newValue) {
      this.listIssues()
    }
  },
  computed: {
    selectedProject () {
      return this.projects.find(project => project.id === this.selectedProjectId)
    }
  },
  methods: {
    listProjects () {
      server
        .request('projects')
        .setVerb('LIST')
        .send()
        .then(resp => {
          this.projects = resp.json
          this.selectedProjectId = resp.json[0].id
        })
    },
    listIssues () {
      server
        .request('issues')
        .filter('projectId', this.selectedProjectId)
        .setVerb('LIST')
        .send()
        .then(resp => {
          this.issues = resp.json
        })
    },
    moment: moment
  },
  mounted () {
    this.listProjects()
  }
}
</script>
