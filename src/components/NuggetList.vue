<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedNuggets && !loading"
        :crumbs="[selectedRelease, selectedProject, selectedNuggets[0]]"
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
        class="column-icon"
      />

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
          :select-action="activateNugget"
          :sort-criteria="nuggetSortCriteria"
          :sort-action="sort"
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
import { mapState, mapActions, mapMutations } from 'vuex'
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
const Breadcrumb = () => import(
  /* webpackChunkName: "Breadcrumb" */ './Breadcrumb'
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
      'Nugget',
      'nuggetsViewState',
      'nuggetFilters',
      'selectedNuggets',
      'selectedRelease'
    ])
  },
  watch: {
    'nuggetSortCriteria': {
      deep: true,
      handler () {
        this.listNuggets(this.$route.params.nuggetId)
      }
    },
    'nuggetFilters': {
      deep: true,
      handler (newValue) {
        this.listNuggets(this.$route.params.nuggetId)
      }
    }
  },
  methods: {
    sort (header, descending = false) {
      this.setNuggetSortCriteria({
        field: header.field,
        descending: descending
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
    Filters,
    Breadcrumb
  }
}
</script>
