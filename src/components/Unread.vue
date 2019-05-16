<template>
  <div id="unread">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedNuggets && selectedNuggets.length === 1"
        :crumbs="[selectedNuggets[0]]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
          placeholder="Search Unread Nuggets"
          v-model="unreadSearchQuery"
          @input="searchUnread"
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

    <!-- CONTENT -->

    <div class="content">

      <!-- LOADING -->

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!haveAnyUnreadNugget"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any unread nuggets.</p>
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
        <nugget-table-view
          :nuggets="unreadNuggets"
          :selectAction="selectAction"
          :sortCriteria="unreadNuggetSortCriteria"
          :sortAction="sort"
        />
        <pagination
          v-if="unreadNuggetsViewState.pageCount > 1"
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
      loading: false,
      unreadSearchQuery: null,
      searchTimeoutHandler: null
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
      'selectedNuggets',
      'haveAnyUnreadNugget'
    ])
  },
  watch: {
    'unreadNuggetSortCriteria': {
      deep: true,
      handler () {
        this.listUnreadNuggets(this.unreadSearchQuery)
      }
    },
    'unreadNuggetFilters': {
      deep: true,
      handler (newValue) {
        this.listUnreadNuggets(this.unreadSearchQuery)
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
        field: header.sortCriteria,
        descending: descending
      })
    },
    async nextPage () {
      this.loading = true
      this.setUnreadNuggetsViewState({ page: this.unreadNuggetsViewState.page + 1 })
      await this.listUnreadNuggets(this.unreadSearchQuery)
      this.loading = false
    },
    async prevPage () {
      this.loading = true
      this.setUnreadNuggetsViewState({ page: this.unreadNuggetsViewState.page - 1 })
      await this.listUnreadNuggets(this.unreadSearchQuery)
      this.loading = false
    },
    async goToPage (pageNumber) {
      this.loading = true
      this.setUnreadNuggetsViewState({ page: pageNumber })
      await this.listUnreadNuggets(this.unreadSearchQuery)
      this.loading = false
    },
    searchUnread () {
      if (this.searchTimeoutHandler) {
        clearTimeout(this.searchTimeoutHandler)
      }
      this.searchTimeoutHandler = setTimeout(async () => {
        this.loading = true
        await this.listUnreadNuggets(this.unreadSearchQuery)
        this.loading = false
      }, 500)
    },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setUnreadNuggetSortCriteria',
      'setUnreadNuggetsViewState'
    ]),
    ...mapActions([
      'activateNugget',
      'listUnreadNuggets'
    ])
  },
  async mounted () {
    this.loading = true
    await this.listUnreadNuggets(this.unreadSearchQuery)
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
