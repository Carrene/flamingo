<template>
  <div id="projectTableView">

    <!-- CONTAINERS LIST -->

    <div class="entities">

      <!-- FILTERS -->

      <div class="filters">
        <p>Filter By</p>
        <div class="filter-type">
          <button
            class="small"
            :class="filters.boardings.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleBoardingTooltip"
          >
            {{ projectMetadata.fields.boarding.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showBoardingTooltip"
            v-on-clickaway="toggleBoardingTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ projectMetadata.fields.boarding.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(boarding, index) in boardings"
                :key="boarding"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="boarding"
                  :id="`boarding${index}`"
                  v-model="filters.boardings"
                  :value="boarding"
                >
                <label
                  :for="`boarding${index}`"
                  class="check"
                ></label>
                <label
                  :for="`boarding${index}`"
                  class="label"
                >{{ boarding.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-type">
          <button
            class="small"
            @click="toggleStatusTooltip"
            :class="filters.statuses.length ? 'primary-button' : 'light-primary-button'"
          >
            {{ projectMetadata.fields.status.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showStatusTooltip"
            v-on-clickaway="toggleStatusTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ projectMetadata.fields.status.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(status, index) in projectStatuses"
                :key="status"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="status"
                  :id="`status${index}`"
                  v-model="filters.statuses"
                  :value="status"
                >
                <label
                  :for="`status${index}`"
                  class="check"
                ></label>
                <label
                  :for="`status${index}`"
                  class="label"
                >{{ status.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <p>{{ header.label }}</p>
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
          <div class="created-at cell">
            {{ formatTargetDate(project.createdAt) }}
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
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'ProjectTableView',
  mixins: [clickaway],
  data () {
    return {
      projectMetadata: server.metadata.models.Project,
      sortIconColor: '#5E5375',
      iconSrc: require('@/assets/chevron-down.svg'),
      showBoardingTooltip: false,
      showStatusTooltip: false,
      filters: null
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
      'projectSortCriteria',
      'boardings',
      'projectStatuses',
      'projectFilters'
    ])
  },
  watch: {
    'filters': {
      deep: true,
      handler (newValue) {
        this.setProjectFilters(newValue)
      }
    }
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
    toggleBoardingTooltip (value) {
      if (typeof value === 'boolean') {
        this.showBoardingTooltip = value
      } else {
        this.showBoardingTooltip = !this.showBoardingTooltip
      }
    },
    toggleStatusTooltip (value) {
      if (typeof value === 'boolean') {
        this.showStatusTooltip = value
      } else {
        this.showStatusTooltip = !this.showStatusTooltip
      }
    },
    ...mapMutations([
      'selectProject',
      'setProjectSortCriteria',
      'setProjectFilters'
    ])
  },
  beforeMount () {
    this.filters = Object.assign(this.projectFilters)
  }
}
</script>
