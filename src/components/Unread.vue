<template>
  <div id="unread">

    <!-- HEADER -->

    <div class="header"></div>

    <!-- CONTENT -->

    <div class="content">

      <!-- FILTERS -->

      <filters
        :items="unreadNuggetFilters"
        :changeAction="updateList"
        :mutation="setUnreadNuggetFilters"
        :metadata="nuggetMetadata"
        :boardings="nuggetBoardings"
        :statuses="nuggetStatuses"
        :priorities="nuggetPriorities"
        :kinds="nuggetKinds"
      ></filters>

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
          :selectAction="selectAction"
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
      'nuggetBoardings',
      'nuggetStatuses',
      'nuggetPriorities',
      'nuggetKinds',
      'Nugget',
      'Project',
      'Workflow',
      'Nugget',
      'nuggetsUnreadCount'
    ])
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
      this.activateNugget({ nugget: nugget, updateRoute: false })
      if (!nugget.seenAt) {
        this.setNuggetsUnreadCount(this.nuggetsUnreadCount - 1)
        this.see(nugget)
      }
    },
    sort (header) {
      this.setUnreadNuggetSortCriteria({
        field: header.field,
        descending: header.isActive ? !this.unreadNuggetSortCriteria.descending : false
      })
    },
    see (nugget) {
      nugget.see().send()
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
    async updateList () {
      this.loading = true
      await this.listUnreadNuggets()
      this.loading = false
    },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setUnreadNuggetSortCriteria',
      'setUnreadNuggetsViewState',
      'setUnreadNuggetFilters',
      'setNuggetsUnreadCount'
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
    Filters
  }
}
</script>
