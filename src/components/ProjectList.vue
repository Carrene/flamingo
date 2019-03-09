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
        class="column-icon disabled"
      />
    </div>

    <div class="content">

      <!-- LOADING -->

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!haveAnyProject"
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
        <project-table-view
          :projects="projects"
          :select-action="activateProject"
          :sort-criteria="projectSortCriteria"
          :sort-action="sort"
        />
        <pagination
          v-if="projectsViewState.pageCount > 1"
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
      projectMetadata: server.metadata.models.Project
    }
  },
  computed: {
    ...mapState([
      'projectSortCriteria',
      'projects',
      'projectsViewState',
      'selectedProject',
      'selectedRelease',
      'projectFilters',
      'haveAnyProject'
    ])
  },
  watch: {
    'projectSortCriteria': {
      deep: true,
      handler () {
        this.listProjects(this.$route.params.projectId)
      }
    },
    'projectFilters': {
      deep: true,
      handler () {
        this.updateList()
      }
    }
  },
  methods: {
    sort (header, descending = false) {
      this.setProjectSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    async updateList () {
      await this.listProjects(this.$route.params.projectId)
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
      'setProjectsViewState',
      'setProjectSortCriteria'
    ]),
    ...mapActions([
      'listProjects',
      'activateProject'
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
