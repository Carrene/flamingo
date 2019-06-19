<template>
  <div id="releaseList">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedRelease"
        :crumbs="[selectedRelease]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="primary-input"
          placeholder="Search in the releases"
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

      <loading v-if="globalLoading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!haveAnyRelease"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any releases.</p>
          <p class="subtitle">Create a new release using the right-side pane.</p>
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
        <release-table-view
          :releases="releases"
          :select-action="activateRelease"
          :sort-criteria="releaseSortCriteria"
          :sort-action="sort"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import server from './../server.js'

const ReleaseTableView = () => import(
  /* webpackChunkName: "ReleaseTableView" */ './ReleaseTableView'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Pagination = () => import(
  /* webpackChunkName: "Pagination" */ './Pagination'
)
const Breadcrumb = () => import(
  /* webpackChunkName: "Breadcrumb" */ './Breadcrumb'
)

export default {
  name: 'ReleaseList',
  data () {
    return {
      releaseMetadata: server.metadata.models.Release
    }
  },
  computed: {
    ...mapState([
      'releases',
      'releaseSortCriteria',
      'selectedRelease',
      'releaseFilters',
      'haveAnyRelease',
      'globalLoading'
    ])
  },
  watch: {
    'releaseSortCriteria': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.listReleases({ selectedReleaseId: this.selectedRelease ? this.selectedRelease.id : null })
        this.setGlobalLoading(false)
      }
    },
    'releaseFilters': {
      deep: true,
      async handler () {
        this.setGlobalLoading(true)
        await this.listReleases({ selectedReleaseId: this.selectedRelease ? this.selectedRelease.id : null })
        this.setGlobalLoading(false)
      }
    }
  },
  methods: {
    sort (header, descending = false) {
      this.setReleaseSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    ...mapMutations([
      'setReleaseSortCriteria',
      'setGlobalLoading'
    ]),
    ...mapActions([
      'listReleases',
      'activateRelease'
    ])
  },
  components: {
    ReleaseTableView,
    Loading,
    Pagination,
    Breadcrumb
  },
  beforeMount () {
    this.setGlobalLoading(false)
  }
}
</script>
