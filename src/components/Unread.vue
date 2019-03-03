<template>
  <div id="unread">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedNuggets && selectedNuggets.length === 1"
        :crumbs="[selectedNuggets[0]]"
      />
      <button
        class="primary-button small reset-filters"
        @click="resetFilters"
      >Reset Filters</button>
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

    <!-- CONTENT -->

    <div class="content">

      <!-- LOADING -->

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!unreadNuggets.length"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any unread nuggets.</p>
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
        <nugget-table-view
          :nuggets="unreadNuggets"
          :selectAction="activateNugget"
          :sortCriteria="unreadNuggetSortCriteria"
          :sortAction="sort"
        />
        <pagination
          :options="unreadNuggetsViewState"
          @next="nextPage"
          @prev="prevPage"
          @goToPage="goToPage"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import server from './../server.js'
import { mapState, mapMutations, mapActions } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

const NuggetTableView = () => import(
  /* webpackChunkName: "NuggetTableView" */ './NuggetTableView'
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
  name: 'Unread',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'unreadNuggets',
      'unreadNuggetSortCriteria',
      'unreadNuggetsViewState',
      'unreadNuggetFilters',
      'Project',
      'Workflow',
      'selectedNuggets'
    ])
  },
  watch: {
    'unreadNuggetSortCriteria': {
      deep: true,
      handler () {
        this.listUnreadNuggets()
      }
    },
    'unreadNuggetFilters': {
      deep: true,
      handler (newValue) {
        this.listUnreadNuggets()
      }
    }
  },
  methods: {
    async getPhases (projectId) {
      let response = await this.Project.get(projectId).send()
      let project = response.models[0]
      let workflow = new this.Workflow({ id: project.workflowId })
      response = await workflow.listPhases().send()
      this.setPhasesOfSelectedWorkflow(response.models)
      Promise.resolve()
    },
    async selectAction ({ nugget }) {
      await this.getPhases(nugget.projectId)
      await this.activateNugget({ nugget: nugget, updateRoute: false })
    },
    sort (header, descending = false) {
      this.setUnreadNuggetSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    async nextPage () {
      this.loading = true
      this.setUnreadNuggetsViewState({ page: this.unreadNuggetsViewState.page + 1 })
      await this.listUnreadNuggets()
      this.loading = false
    },
    async prevPage () {
      this.loading = true
      this.setUnreadNuggetsViewState({ page: this.unreadNuggetsViewState.page - 1 })
      await this.listUnreadNuggets()
      this.loading = false
    },
    async goToPage (pageNumber) {
      this.loading = true
      this.setUnreadNuggetsViewState({ page: pageNumber })
      await this.listUnreadNuggets()
      this.loading = false
    },
    resetFilters () {
      this.resetUnreadNuggetFilters()
    },
    // async updateList () {
    //   this.loading = true
    //   await this.listUnreadNuggets()
    //   this.loading = false
    // },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setUnreadNuggetSortCriteria',
      'setUnreadNuggetsViewState',
      'setUnreadNuggetFilters',
      'resetUnreadNuggetFilters'
    ]),
    ...mapActions([
      'activateNugget',
      'listUnreadNuggets'
    ])
  },
  async mounted () {
    this.loading = true
    await this.listUnreadNuggets()
    this.loading = false
  },
  components: {
    Loading,
    NuggetTableView,
    Pagination,
    Filters,
    Breadcrumb
  }
}
</script>
