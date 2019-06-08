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
          class="primary-input"
          placeholder="Search in the projects"
          readonly
          disabled
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#F9F9F9"
          class="search-icon"
        />
      </div>
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#F9F9F9"
        class="column-icon"
      />
    </div>

    <div class="content">

      <!-- LOADING -->

      <loading v-if="globalLoading" />

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
          class="primary-button"
        >Learn About Maestro</button>
      </div>

      <div
        class="table-container"
        v-else
      >
        <project-table-view
          :projects="decoratedProjects"
          :sort-criteria="projectSortCriteria"
          :sort-action="sort"
        />
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
      showBoardingTooltip: false,
      showStatusTooltip: false,
      projectMetadata: server.metadata.models.Project
    }
  },
  computed: {
    ...mapState([
      'projectSortCriteria',
      'decoratedProjects',
      'selectedProject',
      'selectedRelease',
      'projectFilters',
      'haveAnyProject',
      'globalLoading'
    ])
  },
  watch: {
    'projectSortCriteria': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.listProjects()
        this.setGlobalLoading(false)
      }
    },
    'projectFilters': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.updateList()
        this.setGlobalLoading(false)
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
      await this.listProjects()
    },
    ...mapMutations([
      'setProjectSortCriteria',
      'setGlobalLoading'
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
