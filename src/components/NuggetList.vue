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

        <!-- SUBSCRIBE BUTTON -->

      </div>
      <div class="subscribe-button">
        <button
          class="primary-button small"
          @click="batchSubscribe"
        >Subscribe All</button>
      </div>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <!-- FILTERS -->

      <div class="filters">

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
            v-on-clickout="toggleSubscribedTooltip.bind(undefined, false)"
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
            v-on-clickout="toggleBoardingTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.boarding.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(boarding, index) in nuggetBoardings"
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
            v-on-clickout="toggleStatusTooltip.bind(undefined, false)"
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

        <!-- PRIORITY FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.priorities.length ? 'primary-button' : 'light-primary-button'"
            @click="togglePriorityTooltip"
          >
            {{ nuggetMetadata.fields.priority.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showPriorityTooltip"
            v-on-clickout="togglePriorityTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.priority.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(priority, index) in nuggetPriorities"
                :key="priority"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="priority"
                  :id="`priority${index}`"
                  v-model="filters.priorities"
                  :value="priority"
                >
                <label
                  :for="`priority${index}`"
                  class="check"
                ></label>
                <label
                  :for="`priority${index}`"
                  class="label"
                >{{ priority.formatText() }}</label>
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
            v-on-clickout="toggleKindTooltip.bind(undefined, false)"
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

        <!-- PHASE FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.phases.length ? 'primary-button' : 'light-primary-button'"
            @click="togglePhaseTooltip"
          >
            <!-- FIXME: Change this when metadata fixed! -->
            <!-- {{ nuggetMetadata.fields.phaseId.label }} -->
            Phase
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showPhaseTooltip"
            v-on-clickout="togglePhaseTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>
                <!-- FIXME: Change this when metadata fixed! -->
                <!-- {{ nuggetMetadata.fields.phaseId.label }} -->
                Phase
              </p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="phase in phasesOfSelectedWorkflow"
                :key="phase.id"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="phase"
                  :id="`phase${phase.id}`"
                  v-model="filters.phases"
                  :value="phase.id"
                >
                <label
                  :for="`phase${phase.id}`"
                  class="check"
                ></label>
                <label
                  :for="`phase${phase.id}`"
                  class="label"
                >{{ phase.title }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- TAG FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.tags.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleTagTooltip"
          >
            {{ nuggetMetadata.fields.tags.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showTagTooltip"
            v-on-clickout="toggleTagTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.tags.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="tag in tags"
                :key="tag.id"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="tag"
                  :id="`tag${tag.id}`"
                  v-model="filters.tags"
                  :value="tag.id"
                >
                <label
                  :for="`tag${tag.id}`"
                  class="check"
                ></label>
                <label
                  :for="`tag${tag.id}`"
                  class="label"
                >{{ tag.title }}</label>
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
          <p class="subtitle">Create a new nugget using the right-side pane.</p>
        </div>
        <button
          type="button"
          class="primary-button medium"
        >Learn About Maestro</button>
      </div>

      <nugget-table-view
        :nuggets="nuggetsOfSelectedProject"
        :selectAction="activateNugget"
        v-else
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server from './../server.js'
const NuggetTableView = () => import(
  /* webpackChunkName: "NuggetTableView" */ './NuggetTableView'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  name: 'NuggetList',
  mixins: [clickout],
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      loading: false,
      showSubscribedTooltip: false,
      showBoardingTooltip: false,
      showStatusTooltip: false,
      showKindTooltip: false,
      showPhaseTooltip: false,
      showPriorityTooltip: false,
      showTagTooltip: false,
      filters: null
    }
  },
  computed: {
    ...mapState([
      'nuggetSortCriteria',
      'selectedProject',
      'nuggetsOfSelectedProject',
      'projects',
      'nuggetFilters',
      'nuggetBoardings',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetFilters',
      'nuggetPriorities',
      'phasesOfSelectedWorkflow',
      'tags',
      'Nugget'
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
    },
    'nuggetFilters': {
      deep: true,
      async handler () {
        this.loading = true
        await this.listNuggets(this.$route.params.nuggetId)
        this.loading = false
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
    togglePhaseTooltip (value) {
      if (typeof value === 'boolean') {
        this.showPhaseTooltip = value
      } else {
        this.showPhaseTooltip = !this.showPhaseTooltip
      }
    },
    togglePriorityTooltip (value) {
      if (typeof value === 'boolean') {
        this.showPriorityTooltip = value
      } else {
        this.showPriorityTooltip = !this.showPriorityTooltip
      }
    },
    toggleTagTooltip (value) {
      if (typeof value === 'boolean') {
        this.showTagTooltip = value
      } else {
        this.showTagTooltip = !this.showTagTooltip
      }
    },
    async batchSubscribe () {
      this.loading = true
      let resp = await this.getMaxNuggetId()
      let requestsCount = Math.ceil(resp.models[0].id / 100)
      for (let i = 0; i < requestsCount; i++) {
        let idFilter = {
          id: `BETWEEN(${(i * 100) + 1}, ${(i + 1) * 100})`
        }
        this.Nugget.batchSubscribe(Object.assign({}, this.computedNuggetFilters, idFilter)).send()
      }
      this.loading = false
    },
    getMaxNuggetId () {
      return this.Nugget.load().sort('-id').take(1).send()
    },
    ...mapMutations([
      'setNuggetFilters',
      'setNuggetsOfSelectedProject'
    ]),
    ...mapActions([
      'listNuggets',
      'activateNugget'
    ])
  },
  components: {
    NuggetTableView,
    Loading
  }
}
</script>
