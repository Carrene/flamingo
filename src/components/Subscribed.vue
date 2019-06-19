<template>
  <div id="subscribed">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedNuggets && selectedNuggets.length === 1"
        :crumbs="[selectedNuggets[0]]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="primary-input"
          v-model="subscribedSearchQuery"
          placeholder="Search in the subscribed nuggets"
          @input="searchSubscribed"
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

    <!-- CONTENT -->

    <div class="content">

      <!-- LOADING -->

      <loading v-if="globalLoading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!haveAnySubscribedNugget"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any subscribed nuggets.</p>
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
          :nuggets="subscribedNuggets"
          :selectAction="selectAction"
          :sortCriteria="subscribedNuggetSortCriteria"
          :sortAction="sort"
          :infiniteHandler="infiniteHandler"
        />
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
  name: 'Subscribed',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      subscribedSearchQuery: null,
      searchTimeoutHandler: null
    }
  },
  computed: {
    ...mapState([
      'subscribedNuggets',
      'subscribedNuggetSortCriteria',
      'subscribedNuggetFilters',
      'Project',
      'Workflow',
      'selectedNuggets',
      'haveAnySubscribedNugget',
      'refreshSubscriptionListToggle',
      'globalLoading'
    ])
  },
  watch: {
    'subscribedNuggetSortCriteria': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.listSubscribedNuggets({ selectedNuggetId: null, searchQuery: this.subscribedSearchQuery })
        this.setGlobalLoading(false)
      }
    },
    'subscribedNuggetFilters': {
      deep: true,
      async handler (newValue) {
        this.setGlobalLoading(true)
        await this.listSubscribedNuggets({ selectedNuggetId: null, searchQuery: this.subscribedSearchQuery })
        this.setGlobalLoading(false)
      }
    },
    'refreshSubscriptionListToggle': {
      async handler () {
        this.setGlobalLoading(true)
        await this.listSubscribedNuggets({ selectedNuggetId: null, searchQuery: this.subscribedSearchQuery })
        this.setGlobalLoading(false)
      }
    },
    'subscribedSearchQuery': {
      handler (newValue) {
        this.setGlobalSearchQuery(newValue)
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
      this.setSubscribedNuggetSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    searchSubscribed () {
      if (this.searchTimeoutHandler) {
        clearTimeout(this.searchTimeoutHandler)
      }
      this.searchTimeoutHandler = setTimeout(async () => {
        this.setGlobalLoading(true)
        await this.listSubscribedNuggets({
          selectedNuggetId: null,
          searchQuery: this.subscribedSearchQuery
        })
        this.setGlobalLoading(false)
      }, 500)
    },
    infiniteHandler ($state) {
      this.listSubscribedNuggets({
        selectedNuggetId: this.selectedNuggets.length === 1 ? this.selectedNuggets[0].id : null,
        searchQuery: this.subscribedSearchQuery,
        $state
      })
    },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setSubscribedNuggetSortCriteria',
      'setSubscribedNuggetFilters',
      'setGlobalLoading',
      'setGlobalSearchQuery'
    ]),
    ...mapActions([
      'activateNugget',
      'listSubscribedNuggets'
    ])
  },
  async mounted () {
    this.setGlobalLoading(true)
    await this.listSubscribedNuggets({
      selectedNuggetId: null,
      searchQuery: this.subscribedSearchQuery
    })
    this.setGlobalLoading(false)
  },
  components: {
    Loading,
    NuggetTableView,
    Pagination,
    Filters,
    Breadcrumb
  },
  beforeMount () {
    this.setGlobalLoading(false)
  }
}
</script>
