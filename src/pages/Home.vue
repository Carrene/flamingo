<template>
  <div class="home">
    <div class="left">
      <div class="button-field">
        <button type="button" class="button">New Project</button>
      </div>
      <div class="projects">
        <div class="project-details" v-for="project in projectList" :key="project.id">
          <div class="row-1">
            <p class="project-name">{{ project.title}}</p>
            <p class="unread-message">{{ unreadMessage }}</p>
          </div>
          <div class="row-2">
            <div class="status" :class="project.status">
              <p class="status-type">
                {{ ['atrisk', 'on-hold', 'ontime'].includes(project.status) ? 'in-progress' : project.status }}
              </p>
              <img
                src="../assets/in-progress-at-risk.svg"
                class="status-icon" :class="project.status"
                v-if="project.status === 'atrisk'"
              >
              <img
                src="../assets/in-progress-warning.svg"
                class="status-icon" :class="project.status"
                v-if="project.status === 'in-progress'"
              >
              <img
                src="../assets/in-progress-ontime.svg"
                class="status-icon"
                :class="project.status"
                v-if="project.status === 'on-hold'"
              >
            </div>
            <p class="activity">last activity:30min ago</p>
          </div>
        </div>
      </div>
    </div>
    <div class="chat"></div>
    <div class="right">
      <div class="project-information">
        <img src="../assets/description-icon.svg" class="description-icon">
        <p class="title">Description</p>
        <p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Aenean vel elit scelerisque ...</p>
        <img src="../assets/due-date-icon.svg" class="description-icon">
        <div class="due-date">
          <p>Due-Date</p>
          <p class="date">03/12/2018</p>
        </div>
        <img src="../assets/create-at-icon.svg" class="description-icon">
        <div class="create-at">
          <p>Create At</p>
          <p class="date">03/12/2018</p>
        </div>
      </div>
      <div class="issues"></div>
    </div>
  </div>
</template>

<script>
import server from './../server'
export default {
  name: 'Home',
  data () {
    return {
      projectName: 'alpha',
      projectList: [],
      issuesList: [],
      selectedItem: '2',
      unreadMessage: '999'
    }
  },
  methods: {
    listProjects () {
      server
        .request('projects')
        .setVerb('LIST')
        .send()
        .then(resp => {
          this.projectList = resp.json
          console.log(resp.json)
        })
    },
    listIssues () {
      server
        .request('issues')
        .setVerb('List')
        .send()
        .then(resp => {
          this.issuesList = resp.json
        })
    }
  },
  mounted () {
    this.listProjects()
    this.listIssues()
  }
}
</script>
