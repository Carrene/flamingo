<template>
  <div id="projectTableView">

    <!-- PROJECTS LIST -->

    <div class="entities">
      <div class="table">
        <div class="row header">
          <div></div>
          <div>{{ projectMetadata.fields.title.label }}</div>
          <div>{{ projectMetadata.fields.boarding.label }}</div>
          <div>{{ projectMetadata.fields.status.label }}</div>
          <div>{{ projectMetadata.fields.releaseId.label }}</div>
          <div>{{ projectMetadata.fields.memberId.label }}</div>
          <div>{{ projectMetadata.fields.dueDate.label }}</div>
        </div>
        <div class="row content"
             :class="{selected: selectedProject && (project.id === selectedProject.id)}"
             v-for="project in decoratedProjects"
             :key="project.id"
             @click="selectProject(project)"
             @dblclick="activateNuggetView(project)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications">
          </div>
          <div class="name">
            {{ project.title }}
          </div>
          <div :class="['pace', project.boarding || 'none']">
            {{ project.boarding ? formatText(project.boarding) : '-' }}
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
  data () {
    return {
      projectMetadata: server.metadata.models.Project
    }
  },
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
        let project = Object.assign({}, item)
        let memberTitle = 'None!'
        let releaseTitle = '-'
        if (item.memberId) {
          memberTitle = await this.getManagerTitle(item.memberId)
        }
        if (project.releaseId) {
          releaseTitle = await this.getReleaseTitle(project.releaseId)
        }
        project.memberTitle = memberTitle
        project.releaseTitle = releaseTitle
        return project
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
      if (isoString) {
        return moment(isoString).format('DD/MM/YYYY')
      } else {
        return '-'
      }
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
