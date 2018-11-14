<template>
  <div id="containerTableView">

    <!-- CONTAINERS LIST -->

    <div class="entities">
      <div class="table">
        <div class="row header">
          <div></div>
          <div>{{ containerMetadata.fields.title.label }}</div>
          <div>{{ containerMetadata.fields.boarding.label }}</div>
          <div>{{ containerMetadata.fields.status.label }}</div>
          <div>{{ containerMetadata.fields.releaseId.label }}</div>
          <div>{{ containerMetadata.fields.memberId.label }}</div>
          <div>{{ containerMetadata.fields.dueDate.label }}</div>
        </div>
        <div
          class="row content"
          :class="{selected: selectedProject && (project.id === selectedProject.id)}"
          v-for="project in decoratedProjects"
          :key="project.id"
          @click="selectProject(project)"
          @dblclick="activateNuggetView(project)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification">
            <img
              src="../assets/notification-dark.svg"
              alt="notifications"
            >
          </div>
          <div class="name">
            {{ container.title }}
          </div>
          <div :class="['pace', container.boarding || 'none']">
            {{ container.boarding ? formatText(container.boarding) : '-' }}
          </div>
          <div class="status">
            {{ formatText(container.status) }}
          </div>
          <div class="release">
            {{ container.releaseTitle }}
          </div>
          <div class="manager">
            {{ container.memberTitle }}
          </div>
          <div class="target-date">
            {{ formatTargetDate(container.dueDate) }}
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
  name: 'ContainerTableView',
  data () {
    return {
      containerMetadata: server.metadata.models.Container
    }
  },
  computed: {
    ...mapState([
      'projects',
      'selectedProject',
      'Project'
    ])
  },
  asyncComputed: {
    // title of messages are generated asynchronously
    async decoratedContainers () {
      if (!this.containers) {
        return []
      }
      return Promise.all(this.projects.map(async (item) => {
        let project = new this.Project(item)
        let memberTitle = 'None!'
        let releaseTitle = '-'
        if (item.memberId) {
          memberTitle = await this.getManagerTitle(item.memberId)
        }
        if (container.releaseId) {
          releaseTitle = await this.getReleaseTitle(container.releaseId)
        }
        container.memberTitle = memberTitle
        container.releaseTitle = releaseTitle
        return container
      }))
    }
  },
  methods: {
    activateNuggetView (project) {
      this.selectProject(project)
      this.$router.push({
        name: 'Nuggets',
        params: {
          projectId: project.id
        }
      })
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
        } catch (error) { } finally {
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
        } catch (error) { } finally {
          record = await db.read('releases', id)
        }
      }
      return record.value
    },
    ...mapMutations([
      'selectProject'
    ])
  }
}
</script>
