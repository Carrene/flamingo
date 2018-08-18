<template>
  <div class="home">
    <div class="left">
      <button type="button" class="button">New Project</button>
      <div class="projects">
        <div class="project-details">
          <p class="project-name">{{ projectName }}</p>
          <div class="unread-message">{{ unreadMessage }}</div>
          <div class="status">
          </div>
        </div>
      </div>
    </div>
    <div class="chat"></div>
    <div class="right"></div>
  </div>
</template>

<script>
import server from './../server'

export default {
  name: 'Home',
  data () {
    return {
      projectName: 'alpha',
      projectList: null,
      issuesList: null,
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
