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
            <div class="status">
              <p class="status-type">inprogress</p>
              <img src="../assets/in-progress-at-risk.svg" class="status-icon" v-if="status === 'atrisk'">
              <img src="../assets/in-progress-warning.svg" class="status-icon" v-if="status === 'warning'">
              <img src="../assets/in-progress-ontime.svg" class="status-icon" v-if="status === 'ontime'">
            </div>
            <p class="activity">last activity:30min ago</p>
          </div>
        </div>
      </div>
    </div>
    <div class="chat"></div>
    <div class="right">
      <div class="description"></div>
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
      status: 'atrisk',
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
