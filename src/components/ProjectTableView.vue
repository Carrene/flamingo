<template>
  <div id="projectTableView">

    <!-- CONTAINERS LIST -->

    <div class="entities">
      <div class="table">
        <div class="row header">
          <div></div>
          <div
            v-for="header in headers"
            :key="header.label"
            class="cell"
            :class="{active: header.isActive}"
          >
            <p>{{ header.label }}</p>
            <simple-svg
              :filepath="header.iconSrc"
              :fill="header.isActive ? sortIconActiveColor : sortIconColor"
              class="icon"
            ></simple-svg>
          </div>
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
          <div class="cell notification">
            <img
              src="../assets/notification-dark.svg"
              alt="notifications"
              class="cell"
            >
          </div>
          <div class="name cell">
            {{ project.title }}
          </div>
          <div
            class="cell"
            :class="['pace', project.boarding || 'none']"
          >
            {{ project.boarding ? project.boarding.formatText() : '-' }}
          </div>
          <div class="status cell">
            {{ project.status.formatText() }}
          </div>
          <div class="release cell">
            {{ project.releaseTitle }}
          </div>
          <div class="manager cell">
            {{ project.memberTitle }}
          </div>
          <div class="target-date cell">
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
      projectMetadata: server.metadata.models.Project,
      sortIconColor: '#232323',
      sortIconActiveColor: '#5E5375'
    }
  },
  computed: {
    ...mapState([
      'projects',
      'selectedProject',
      'Project',
      'sortCriteria'
    ])
  },
  asyncComputed: {
    // title of messages are generated asynchronously
    async decoratedProjects () {
      if (!this.projects) {
        return []
      }
      return Promise.all(this.projects.map(async (item) => {
        let project = new this.Project(item)
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
    },
    headers () {
      return [
        {
          label: this.projectMetadata.fields.title.label,
          iconSrc: require('@/assets/chevron-down.svg'),
          isActive: this.sortCriteria === 'title'
        },
        {
          label: this.projectMetadata.fields.boarding.label,
          iconSrc: require('@/assets/chevron-down.svg'),
          isActive: this.sortCriteria === 'boarding'
        },
        {
          label: this.projectMetadata.fields.status.label,
          iconSrc: require('@/assets/chevron-down.svg'),
          isActive: this.sortCriteria === 'status'
        },
        {
          label: this.projectMetadata.fields.releaseId.label,
          iconSrc: require('@/assets/chevron-down.svg'),
          isActive: this.sortCriteria === 'releaseId'
        },
        {
          label: this.projectMetadata.fields.memberId.label,
          iconSrc: require('@/assets/chevron-down.svg'),
          isActive: this.sortCriteria === 'memberId'
        },
        {
          label: this.projectMetadata.fields.dueDate.label,
          iconSrc: require('@/assets/chevron-down.svg'),
          isActive: this.sortCriteria === 'dueDate'
        }
      ]
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
