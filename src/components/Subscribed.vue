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

    <!-- CONTENT -->

    <div class="content">

      <!-- LOADING -->

      <loading v-if="loading" />

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
        />
        <pagination
          v-if="subscribedNuggetsViewState.pageCount > 1"
          :options="subscribedNuggetsViewState"
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
  name: 'Subscribed',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'subscribedNuggets',
      'subscribedNuggetSortCriteria',
      'subscribedNuggetsViewState',
      'subscribedNuggetFilters',
      'Project',
      'Workflow',
      'selectedNuggets',
      'haveAnySubscribedNugget',
      'refreshSubscriptionListToggle'
    ])
  },
  watch: {
    'subscribedNuggetSortCriteria': {
      deep: true,
      handler () {
        this.listSubscribedNuggets()
      }
    },
    'subscribedNuggetFilters': {
      deep: true,
      handler (newValue) {
        this.listSubscribedNuggets()
      }
    },
    'refreshSubscriptionListToggle': {
      handler () {
        this.listSubscribedNuggets()
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
    async nextPage () {
      this.loading = true
      this.setSubscribedNuggetsViewState({ page: this.subscribedNuggetsViewState.page + 1 })
      await this.listSubscribedNuggets()
      this.loading = false
    },
    async prevPage () {
      this.loading = true
      this.setSubscribedNuggetsViewState({ page: this.subscribedNuggetsViewState.page - 1 })
      await this.listSubscribedNuggets()
      this.loading = false
    },
    async goToPage (pageNumber) {
      this.loading = true
      this.setSubscribedNuggetsViewState({ page: pageNumber })
      await this.listSubscribedNuggets()
      this.loading = false
    },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setSubscribedNuggetSortCriteria',
      'setSubscribedNuggetsViewState',
      'setSubscribedNuggetFilters'
    ]),
    ...mapActions([
      'activateNugget',
      'listSubscribedNuggets'
    ])
  },
  async mounted () {
    this.loading = true
    await this.listSubscribedNuggets()
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
