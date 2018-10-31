<template>
  <div id="projectTableView">

    <!-- PROJECTS LIST -->

    <div class="entities">
      <div class="table">
        <div class="row header">
          <div></div>
          <div>Name</div>
          <div>Pace</div>
          <div>Status</div>
          <div>Release</div>
          <div>Manager</div>
          <div>Target Date</div>
        </div>
        <div class="row content"
             :class="{selected: selectedProject && (project.id === selectedProject.id)}"
             v-for="project in decoratedProjects"
             :key="project.id"
             @click="selectProject(project)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications">
          </div>
          <div class="name">
            {{ project.title }}
          </div>
          <div :class="['pace', project.boarding || 'none']">
            {{ project.boarding ? formatText(project.boarding) : 'None!' }}
          </div>
          <div class="status">
            {{ formatText(project.status) }}
          </div>
          <div class="release">
            {{ project.releaseTitle }}
          </div>
          <div class="manager">
            {{ project.memberTitle }}
          </div>
          <div class="target-date">
            {{ formatTargetDate(project.dueDate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import db from '../localdb'
import server from '../server'
import moment from 'moment'
export default {
  name: 'ProjectTableView',
  computed: {
    ...mapState([
      'projects',
      'selectedProject'
    ])
  },
  asyncComputed: {
    // title of messages are generated asynchronously
    async decoratedProjects () {
      if (!this.projects) {
        return []
      }
      return Promise.all(this.projects.map(async (item) => {
        let memberTitle = 'None!'
        let releaseTitle = 'None!'
        if (item.memberId) {
          memberTitle = await this.getManagerTitle(item.memberId)
        }
        if (item.releaseId) {
          releaseTitle = await this.getReleaseTitle(item.releaseId)
        }
        item.memberTitle = memberTitle
        item.releaseTitle = releaseTitle
        return item
      }))
    }
  },
  methods: {
    activateNuggetView (project) {
      this.selectProject(project)
      this.selectScope('Nuggets')
    },
    formatText (input) {
      return input.split('-').join(' ').capitalize()
    },
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    async getManagerTitle (id) {
      let record = await db.read('managers', id)
      if (!record) {
        let resp = await server.request(`members/${id}`).send()
        try {
          await db.add('managers', resp.json.id, resp.json.title)
        } catch (error) {} finally {
          record = await db.read('managers', id)
        }
      }
      return record.value
    },
    async getReleaseTitle (id) {
      let record = await db.read('releases', id)
      if (!record) {
        let resp = await server.request(`releases/${id}`).send()
        try {
          await db.add('releases', resp.json.id, resp.json.title)
        } catch (error) {} finally {
          record = await db.read('releases', id)
        }
      }
      return record.value
    },
    ...mapMutations([
      'selectProject',
      'selectScope'
    ])
  }
}
</script>
