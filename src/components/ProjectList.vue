<template>
  <div id="projectList">

    <!-- HEADER -->

    <div class="header"></div>

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

    <project-table-view v-else-if="viewMode === 'table'" />
    <project-card-view v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProjectCardView from './ProjectCardView'
import ProjectTableView from './ProjectTableView'
import Loading from './Loading'

export default {
  name: 'ProjectList',
  data () {
    return {
      loading: false
    }
  },
  computed: mapState([
    'viewMode',
    'projectSortCriteria',
    'projects',
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
    }
  },
  methods: mapActions([
    'listProjects'
  ]),
  mounted () {
    if (!this.projects.length) {
      this.loading = true
      this.listProjects([this.$route.params.projectId || undefined, () => {
        this.loading = false
      }])
    }
  },
  components: {
    ProjectCardView,
    ProjectTableView,
    Loading
  }
}
</script>
