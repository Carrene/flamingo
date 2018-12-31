<template>
  <div id="projectList">

    <!-- HEADER -->

    <div class="header"></div>

    <div class="content">

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
            v-on-clickout="toggleBoardingTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ projectMetadata.fields.boarding.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(boarding, index) in projectBoardings"
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
            v-on-clickout="toggleStatusTooltip.bind(undefined, false)"
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

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!projects.length"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any projects.</p>
          <p class="subtitle">Create a new project using the right section.</p>
        </div>
        <button
          type="button"
          class="primary-button medium"
        >Learn About Maestro</button>
      </div>

      <project-table-view v-else />
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server from './../server.js'
const ProjectCardView = () => import(
  /* webpackChunkName: "ProjectCardView" */ './ProjectCardView'
)
const ProjectTableView = () => import(
  /* webpackChunkName: "ProjectTableView" */ './ProjectTableView'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  name: 'ProjectList',
  mixins: [clickout],
  data () {
    return {
      loading: false,
      showBoardingTooltip: false,
      showStatusTooltip: false,
      filters: null,
      projectMetadata: server.metadata.models.Project
    }
  },
  computed: mapState([
    'projectSortCriteria',
    'projects',
    'projectFilters',
    'projectBoardings',
    'projectStatuses',
    'projectFilters'
  ]),
  watch: {
    'projectSortCriteria': {
      deep: true,
      handler () {
        this.loading = true
        this.listProjects([this.$route.params.projectId || undefined, () => {
          this.loading = false
        }])
      }
    },
    'projectFilters': {
      deep: true,
      handler () {
        this.loading = true
        this.listProjects([this.$route.params.projectId || undefined, () => {
          this.loading = false
        }])
      }
    },
    'filters': {
      deep: true,
      handler (newValue) {
        this.setProjectFilters(newValue)
      }
    }
  },
  methods: {
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
      'setProjectFilters'
    ]),
    ...mapActions([
      'listProjects'
    ])
  },
  beforeMount () {
    this.filters = Object.assign(this.projectFilters)
  },
  components: {
    ProjectCardView,
    ProjectTableView,
    Loading
  }
}
</script>
