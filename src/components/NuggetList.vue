<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedNuggets && !globalLoading"
        :crumbs="[selectedRelease, selectedProject, selectedNuggets[0]]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
          v-model="nuggetSearchQuery"
          placeholder="Search in the nuggets"
          @input="searchNuggets"
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#23232380"
          class="search-icon"
        />
      </div>
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#F9F9F9"
        class="column-icon"
      />

      <!-- SUBSCRIBE BUTTON -->
      <!-- TODO: Add in the future (maybe) -->
      <!-- <div class="subscribe-button">
        <button
          class="primary-button"
          @click="batchSubscribe"
        >Subscribe All</button>
      </div> -->
    </div>

    <!-- CONTENT -->

    <div class="content">

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-if="!haveAnyNugget"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any nuggets.</p>
          <p class="subtitle">Create a new nugget using the right-side pane.</p>
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
          :nuggets="nuggetsOfSelectedProject"
          :select-action="activateNugget"
          :sort-criteria="nuggetSortCriteria"
          :sort-action="sort"
          :infiniteHandler="infiniteHandler"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
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
const Breadcrumb = () => import(
  /* webpackChunkName: "Breadcrumb" */ './Breadcrumb'
)

export default {
  name: 'NuggetList',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      nuggetSearchQuery: null,
      searchTimeoutHandler: null
    }
  },
  computed: {
    ...mapState([
      'nuggetSortCriteria',
      'selectedProject',
      'nuggetsOfSelectedProject',
      'nuggetFilters',
      'selectedNuggets',
      'selectedRelease',
      'haveAnyNugget',
      'globalLoading'
    ])
  },
  watch: {
    'nuggetSortCriteria': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.listNuggets({
          searchQuery: this.nuggetSearchQuery,
          selectedNuggetId: this.selectedNuggets.length === 1 ? this.selectedNuggets[0].id : null
        })
        this.setGlobalLoading(false)
      }
    },
    'nuggetFilters': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.listNuggets({
          searchQuery: this.nuggetSearchQuery,
          selectedNuggetId: this.selectedNuggets.length === 1 ? this.selectedNuggets[0].id : null
        })
        this.setGlobalLoading(false)
      }
    },
    'nuggetSearchQuery': {
      handler (newValue) {
        this.setGlobalSearchQuery(newValue)
      }
    }
  },
  methods: {
    sort (header, descending = false) {
      this.setNuggetSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    searchNuggets () {
      if (this.searchTimeoutHandler) {
        clearTimeout(this.searchTimeoutHandler)
      }
      this.searchTimeoutHandler = setTimeout(async () => {
        this.setGlobalLoading(true)
        await this.listNuggets({
          searchQuery: this.nuggetSearchQuery,
          selectedNuggetId: this.selectedNuggets.length === 1 ? this.selectedNuggets[0].id : null
        })
        this.setGlobalLoading(false)
      }, 500)
    },
    infiniteHandler ($state) {
      this.listNuggets({
        selectedNuggetId: this.selectedNuggets.length === 1 ? this.selectedNuggets[0].id : null,
        $state,
        searchQuery: this.nuggetSearchQuery
      })
    },
    ...mapMutations([
      'setNuggetSortCriteria',
      'setGlobalLoading',
      'setGlobalSearchQuery',
      'setHaveAnyNugget'
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
    Filters,
    Breadcrumb
  },
  beforeMount () {
    this.setGlobalLoading(false)
  },
  beforeDestroy () {
    this.setHaveAnyNugget(false)
  }
}
</script>
