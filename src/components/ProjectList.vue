<template>
  <div id="projectList">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedProject"
        :crumbs="[selectedRelease, selectedProject]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#23232380"
          class="search-icon"
        />
      </div>
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#232323"
        class="column-icon"
      />
    </div>

    <div class="content">

      <!-- FILTERS -->

      <filters
        :items="projectFilters"
        :change-action="updateList"
        :mutation="setProjectFilters"
        :metadata="projectMetadata"
        :boardings="projectBoardings"
        :statuses="projectStatuses"
      ></filters>

      <!-- LOADING -->

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
          <p class="subtitle">Create a new project using the right-side pane.</p>
        </div>
        <button
          type="button"
          class="primary-button medium"
        >Learn About Maestro</button>
      </div>

      <div
        class="table-container"
        v-else
      >
        <project-table-view :projects="projects" />
        <pagination
          :options="projectsViewState"
          @next="nextPage"
          @prev="prevPage"
          @goToPage="goToPage"
        >
        </pagination>
      </div>
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
const Pagination = () => import(
  /* webpackChunkName: "Pagination" */ './Pagination'
)
const Filters = () => import(
  /* webpackChunkName: "Filters" */ './Filters'
)
const Breadcrumb = () => import(
  /* webpackChunkName: "Breadcrumb" */ './Breadcrumb'
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
    'projectBoardings',
    'projectStatuses',
    'projectFilters',
    'projectsViewState',
    'selectedProject',
    'selectedRelease'
  ]),
  watch: {
    'projectSortCriteria': {
      deep: true,
      async handler () {
        this.loading = true
        await this.listProjects(this.$route.params.projectId)
        this.loading = false
      }
    }
  },
  methods: {
    async updateList () {
      this.loading = true
      await this.listProjects(this.$route.params.projectId)
      this.loading = false
    },
    async nextPage () {
      this.loading = true
      this.setProjectsViewState({ page: this.projectsViewState.page + 1 })
      await this.listProjects(this.$route.params.projectId)
      this.loading = false
    },
    async prevPage () {
      this.loading = true
      this.setProjectsViewState({ page: this.projectsViewState.page - 1 })
      await this.listProjects(this.$route.params.projectId)
      this.loading = false
    },
    async goToPage (pageNumber) {
      this.loading = true
      this.setProjectsViewState({ page: pageNumber })
      await this.listProjects(this.$route.params.projectId)
      this.loading = false
    },
    ...mapMutations([
      'setProjectFilters',
      'setProjectsViewState'
    ]),
    ...mapActions([
      'listProjects'
    ])
  },
  components: {
    ProjectCardView,
    ProjectTableView,
    Loading,
    Pagination,
    Filters,
    Breadcrumb
  }
}
</script>
