<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <div class="header-title">
        <p
          class="project-title"
          v-if="!loading"
        >{{ selectedProject.title }}</p>
      </div>

      <!-- SUBSCRIBE BUTTON -->

      <!-- <div class="subscribe-button">
        <button
          class="primary-button small"
          @click="batchSubscribe"
        >Subscribe All</button>
      </div> -->
    </div>

    <!-- CONTENT -->

    <div class="content">

      <!-- FILTERS -->

      <filters
        :items="nuggetFilters"
        :changeAction="updateList"
        :mutation="setNuggetFilters"
        :metadata="nuggetMetadata"
        :bordings="nuggetBoardings"
        :statuses="nuggetStatuses"
        :priorities="nuggetPriorities"
        :kinds="nuggetKinds"
      ></filters>

      <!-- LOADING -->

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!nuggetsOfSelectedProject.length"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any nuggets.</p>
          <p class="subtitle">Create a new nugget using the right-side pane.</p>
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
          :nuggets="nuggetsOfSelectedProject"
          :selectAction="activateNugget"
          :sortCriteria="nuggetSortCriteria"
          :sortAction="sort"
        />
        <pagination
          :options="nuggetsViewState"
          @next="nextPage"
          @prev="prevPage"
          @goToPage="goToPage"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ViewState from '../view-state.js'
import server from './../server.js'
const NuggetTableView = () => import(
  /* webpackChunkName: "NuggetTableView" */ './NuggetTableView'
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

export default {
  name: 'NuggetList',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      loading: false,
      filters: null
    }
  },
  computed: {
    ...mapState([
      'nuggetSortCriteria',
      'selectedProject',
      'nuggetsOfSelectedProject',
      'nuggetBoardings',
      'nuggetStatuses',
      'nuggetPriorities',
      'nuggetKinds',
      'projects',
      'nuggetFilters',
      'nuggetBoardings',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetFilters',
      'nuggetPriorities',
      'phasesOfSelectedWorkflow',
      'tags',
      'Nugget',
      'nuggetsViewState'
    ]),
    ...mapGetters([
      'computedNuggetFilters'
    ])
  },
  watch: {
    'nuggetSortCriteria': {
      deep: true,
      async handler () {
        this.loading = true
        await this.listNuggets(this.$route.params.nuggetId)
        this.loading = false
      }
    }
  },
  methods: {
    sort (header) {
      this.setNuggetSortCriteria({
        field: header.field,
        descending: header.isActive ? !this.nuggetSortCriteria.descending : false
      })
    },
    async nextPage () {
      this.loading = true
      this.setNuggetsViewState({ page: this.nuggetsViewState.page + 1 })
      await this.listNuggets(this.$route.params.nuggetId)
      this.loading = false
    },
    async prevPage () {
      this.loading = true
      this.setNuggetsViewState({ page: this.nuggetsViewState.page - 1 })
      await this.listNuggets(this.$route.params.nuggetId)
      this.loading = false
    },
    async goToPage (pageNumber) {
      this.loading = true
      this.setNuggetsViewState({ page: pageNumber })
      await this.listNuggets(this.$route.params.nuggetId)
      this.loading = false
    },
    async updateList () {
      this.loading = true
      this.setNuggetsViewState(new ViewState({}))
      await this.listNuggets(this.$route.params.nuggetId)
      this.loading = false
    },
    ...mapMutations([
      'setNuggetFilters',
      'setNuggetsOfSelectedProject',
      'setNuggetSortCriteria',
      'setNuggetsViewState'
    ]),
    ...mapActions([
      'listNuggets',
      'activateNugget'
    ])
  },
  components: {
    NuggetTableView,
    Loading,
    Pagination,
    Filters
  }
}
</script>
