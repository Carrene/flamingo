<template>
  <div id="projectTableView">

    <!-- CONTAINERS LIST -->

    <div class="entities">

      <!-- TABLE -->

      <div class="table">
        <div class="row header">
          <div></div>
          <div
            v-for="header in headers"
            :key="header.label"
            class="cell"
            :class="{active: header.isActive}"
            @click="sort(header)"
          >
            <p :title="header.label">{{ header.label }}</p>
            <simple-svg
              :filepath="iconSrc"
              :fill="sortIconColor"
              class="icon"
              v-if="header.isActive"
              :class="{ascending: !projectSortCriteria.descending}"
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
          <div
            class="name cell"
            :title="project.title"
          >
            <p>{{ project.title }}</p>
          </div>
          <div
            class="cell"
            :class="['pace', project.boarding || 'none']"
          >
            <p :title="project.boarding ? project.boarding.formatText() : '-'">
              {{ project.boarding ? project.boarding.formatText() : '-' }}
            </p>
          </div>
          <div
            class="status cell"
            :title="project.status.formatText()"
          >
            <p>{{ project.status.formatText() }}</p>
          </div>
          <div
            class="release cell"
            :title="project.releaseTitle"
          >
            <p>{{ project.releaseTitle }}</p>
          </div>
          <div
            class="manager cell"
            :title="project.memberTitle"
          >
            <p>{{ project.memberTitle }}</p>
          </div>
          <div
            class="target-date cell"
            :title="formatTargetDate(project.dueDate)"
          >
            <p>{{ formatTargetDate(project.dueDate) }}</p>
          </div>
          <div
            class="created-at cell"
            :title="formatTargetDate(project.createdAt)"
          >
            <p>{{ formatTargetDate(project.createdAt) }}</p>
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
      sortIconColor: '#5E5375',
      iconSrc: require('@/assets/chevron-down.svg')
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.projectMetadata.fields.title.label,
          isActive: this.projectSortCriteria.field === 'title',
          field: 'title'
        },
        {
          label: this.projectMetadata.fields.boarding.label,
          isActive: this.projectSortCriteria.field === 'boarding',
          field: 'boarding'
        },
        {
          label: this.projectMetadata.fields.status.label,
          isActive: this.projectSortCriteria.field === 'status',
          field: 'status'
        },
        {
          label: this.projectMetadata.fields.releaseId.label,
          isActive: this.projectSortCriteria.field === 'releaseId',
          field: 'releaseId'
        },
        {
          label: this.projectMetadata.fields.memberId.label,
          isActive: this.projectSortCriteria.field === 'memberId',
          field: 'memberId'
        },
        {
          label: this.projectMetadata.fields.dueDate.label,
          isActive: this.projectSortCriteria.field === 'dueDate',
          field: 'dueDate'
        },
        {
          label: this.projectMetadata.fields.createdAt.label,
          isActive: this.projectSortCriteria.field === 'createdAt',
          field: 'createdAt'
        }
      ]
    },
    ...mapState([
      'projects',
      'selectedProject',
      'Project',
      'projectSortCriteria'
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
    sort (header) {
      this.setProjectSortCriteria({
        field: header.field,
        descending: header.isActive ? !this.projectSortCriteria.descending : false
      })
    },
    ...mapMutations([
      'selectProject',
      'setProjectSortCriteria'
    ])
  }
}
</script>
