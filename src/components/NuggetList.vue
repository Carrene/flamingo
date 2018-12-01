<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">

      <div class="header-title">
        <p
          class="project-title"
          v-if="!loading"
        >{{ selectedProject.title }}</p>
      </div>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <!-- FILTERS -->

      <div class="filters">
        <p>Filter By</p>

        <!-- SUBSCRIBED FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.subscribed !== 'all' ? 'primary-button' : 'light-primary-button'"
            @click="toggleSubscribedTooltip"
          >
            {{ nuggetMetadata.fields.isSubscribed.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showSubscribedTooltip"
            v-on-clickaway="toggleSubscribedTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.isSubscribed.label }}</p>
            </div>
            <div class="tooltip-content">
              <div class="radio-container">
                <input
                  type="radio"
                  class="radio"
                  name="subscribed"
                  id="all"
                  v-model="filters.isSubscribed"
                  value="all"
                >
                <label
                  for="all"
                  class="check"
                ></label>
                <label
                  for="all"
                  class="label"
                >All</label>
              </div>

              <div class="radio-container">
                <input
                  type="radio"
                  class="radio"
                  name="subscribed"
                  id="notSubscribed"
                  v-model="filters.isSubscribed"
                  value="0"
                >
                <label
                  for="notSubscribed"
                  class="check"
                ></label>
                <label
                  for="notSubscribed"
                  class="label"
                >Not Subscribed</label>
              </div>

              <div class="radio-container">
                <input
                  type="radio"
                  class="radio"
                  name="subscribed"
                  id="Subscribed"
                  v-model="filters.isSubscribed"
                  value="1"
                >
                <label
                  for="Subscribed"
                  class="check"
                ></label>
                <label
                  for="Subscribed"
                  class="label"
                >Subscribed</label>
              </div>
            </div>
          </div>
        </div>

        <!-- BOARDING FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.boardings.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleBoardingTooltip"
          >
            {{ nuggetMetadata.fields.boarding.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showBoardingTooltip"
            v-on-clickaway="toggleBoardingTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.boarding.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(boarding, index) in boardings"
                :key="boarding"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="boarding"
                  :id="`boarding${index}`"
                  v-model="filters.boardings"
                  :value="boarding"
                >
                <label
                  :for="`boarding${index}`"
                  class="check"
                ></label>
                <label
                  :for="`boarding${index}`"
                  class="label"
                >{{ boarding.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- STATUS FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.statuses.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleStatusTooltip"
          >
            {{ nuggetMetadata.fields.status.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showStatusTooltip"
            v-on-clickaway="toggleStatusTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.status.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(status, index) in nuggetStatuses"
                :key="status"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="status"
                  :id="`status${index}`"
                  v-model="filters.statuses"
                  :value="status"
                >
                <label
                  :for="`status${index}`"
                  class="check"
                ></label>
                <label
                  :for="`status${index}`"
                  class="label"
                >{{ status.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- KIND FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.kinds.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleKindTooltip"
          >
            {{ nuggetMetadata.fields.kind.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showKindTooltip"
            v-on-clickaway="toggleKindTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.kind.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(kind, index) in nuggetKinds"
                :key="kind"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="kind"
                  :id="`kind${index}`"
                  v-model="filters.kinds"
                  :value="kind"
                >
                <label
                  :for="`kind${index}`"
                  class="check"
                ></label>
                <label
                  :for="`kind${index}`"
                  class="label"
                >{{ kind.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <p class="subtitle">Create a new nugget using the right section.</p>
        </div>
        <button
          type="button"
          class="primary-button medium"
        >Learn About Maestro</button>
      </div>

      <nugget-table-view v-else-if="viewMode === 'table'" />
      <nugget-card-view v-else />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import server from './../server.js'
const NuggetCardView = () => import(
  /* webpackChunkName: "NuggetCardView" */ './NuggetCardView'
)
const NuggetTableView = () => import(
  /* webpackChunkName: "NuggetTableView" */ './NuggetTableView'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  name: 'NuggetList',
  mixins: [clickaway],
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      loading: false,
      showSubscribedTooltip: false,
      showBoardingTooltip: false,
      showStatusTooltip: false,
      showKindTooltip: false,
      filters: null
    }
  },
  computed: mapState([
    'viewMode',
    'nuggetSortCriteria',
    'selectedProject',
    'nuggetsOfSelectedProject',
    'projects',
    'nuggetFilters',
    'boardings',
    'nuggetStatuses',
    'nuggetKinds',
    'nuggetFilters'
  ]),
  watch: {
    'nuggetSortCriteria': {
      deep: true,
      handler () {
        this.loading = true
        this.listNuggets([this.$route.params.projectId, this.$route.params.nuggetId || undefined, () => {
          this.loading = false
        }])
      }
    },
    'nuggetFilters': {
      deep: true,
      handler () {
        this.loading = true
        this.listNuggets([this.$route.params.projectId, this.$route.params.nuggetId || undefined, () => {
          this.loading = false
        }])
      }
    },
    'filters': {
      deep: true,
      handler (newValue) {
        this.setNuggetFilters(newValue)
      }
    }
  },
  beforeMount () {
    this.filters = Object.assign(this.nuggetFilters)
    this.loading = true
    if (!this.projects.length) {
      this.listProjects([this.$route.params.projectId])
    }
    this.listNuggets([this.$route.params.projectId, this.$route.params.nuggetId || undefined, () => {
      this.loading = false
    }])
  },
  methods: {
    toggleBoardingTooltip (value) {
      if (typeof value === 'boolean') {
        this.showBoardingTooltip = value
      } else {
        this.showBoardingTooltip = !this.showBoardingTooltip
      }
    },
    toggleStatusTooltip (value) {
      if (typeof value === 'boolean') {
        this.showStatusTooltip = value
      } else {
        this.showStatusTooltip = !this.showStatusTooltip
      }
    },
    toggleSubscribedTooltip (value) {
      if (typeof value === 'boolean') {
        this.showSubscribedTooltip = value
      } else {
        this.showSubscribedTooltip = !this.showSubscribedTooltip
      }
    },
    toggleKindTooltip (value) {
      if (typeof value === 'boolean') {
        this.showKindTooltip = value
      } else {
        this.showKindTooltip = !this.showKindTooltip
      }
    },
    ...mapMutations([
      'setNuggetFilters'
    ]),
    ...mapActions([
      'listNuggets',
      'listProjects'
    ])
  },
  components: {
    NuggetCardView,
    NuggetTableView,
    Loading
  }
}
</script>
