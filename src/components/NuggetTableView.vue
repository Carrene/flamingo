<template>
  <div id="nuggetTableView">

    <!-- Nuggets LIST -->

    <div class="entities">

      <!-- TABLE -->

      <table class="table">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="[{'active-filtering': header.isFilteringActive, 'active-sorting': header.isSortingActive }, header.className]"
            >
              <div class="title-container">
                <p
                  :title="header.label"
                  @click="tooltipHandler(header)"
                >{{ header.label }}</p>
                <simple-svg
                  :filepath="sortIconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isSortingActive"
                  :class="{ascending: !sortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container tooltip"
                v-if="showTooltip === header.label"
              >
              </div>
              <div
                class="tooltip-container filter-tooltip"
                :class="[
                  header.label === 'Subscribe' ? 'left' : 'center',
                  header.filteringItems ? 'double-tooltip' : 'single-tooltip'
                ]"
                v-if="showTooltip === header.label"
                v-on-clickout.capture="hideTooltip"
              >
                <div
                  class="tooltip-header"
                  :class="header.filteringItems ? 'double-tooltip' : 'single-tooltip'"
                >
                  <div
                    class="sort"
                    :class="{selected: isSelected === 'sort'}"
                    @click="isSelected = 'sort'"
                  >
                    <simple-svg
                      class="sort-icon"
                      :filepath="require('@/assets/sort.svg')"
                    />
                    <p class="title">sort</p>
                  </div>
                  <div
                    v-if="header.filteringItems"
                    class="filter"
                    :class="{selected: isSelected === 'filter', disabled: !header.filteringItems }"
                    v-on="header.filteringItems ? { click: () => isSelected = 'filter' } : null"
                    :disabled="!header.filteringItems"
                  >
                    <simple-svg
                      class="filter-icon"
                      :filepath="require('@/assets/filter.svg')"
                    />
                    <p class="title">filter</p>
                  </div>
                </div>
                <div class="tooltip-content">
                  <filters
                    class="filter-content"
                    v-if="isSelected === 'filter'"
                    :mutation="computedMutation"
                    :header="header"
                    :model="modelFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sortCriteria="sortCriteria"
                    :sortAction="sortAction"
                    :header="header"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            :class="{selected: selectedNuggets.some(item => nugget.id === item.id), 'unread': !nugget.seenAt && nugget.isSubscribed}"
            class="row"
            v-for="nugget in nuggets"
            :key="nugget.id"
            @click.stop="eventHandler($event, nugget)"
            @contextmenu.prevent="showMenu"
          >
            <td class="subscribe cell">
              <loading-checkbox
                class="check-box"
                :checked="nugget.isSubscribed"
                @click.native="toggleSubscription(nugget)"
                :size="16"
                :loading="checkboxLoadings[nugget.id]"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
              ></loading-checkbox>
            </td>
            <td
              class="cell id"
              :title="`N${nugget.id}`"
            >
              <p>N{{ nugget.id }}</p>
            </td>
            <td
              class="cell title"
              :title="nugget.title"
            >
              <p>{{ nugget.title }}</p>
            </td>

            <td
              class="cell pace"
              :title="nugget.boarding.formatText()"
            >
              <div
                class="pace-card"
                :class="nugget.boarding"
              >
                <p>{{ nugget.boarding.formatText() }}</p>
              </div>
            </td>

            <td
              class="status cell"
              :title="nugget.status.formatText()"
            >
              <p>{{ nugget.status.formatText() }}</p>
            </td>
            <td
              class="kind cell"
              :title="nugget.kind.formatText()"
            >
              <p>{{ nugget.kind.formatText() }}</p>
            </td>
            <td
              class="phase cell"
              :title="getPhaseTitle(nugget)"
            >
              <p>{{ getPhaseTitle(nugget) }}</p>
            </td>
            <td
              class="target-date cell"
              :title="formatDate(nugget.dueDate)"
            >
              <p>{{ formatDate(nugget.dueDate) }}</p>
            </td>
            <td
              class="priority cell"
              :title="nugget.priority.formatText()"
            >
              <p>{{ nugget.priority.formatText() }}</p>
            </td>
            <td
              class="project cell"
              :title="allProjects.find(project => nugget.projectId === project.id).title"
            >
              <p>{{ allProjects.find(project => nugget.projectId === project.id).title }}</p>
            </td>
            <td
              class="created-at cell"
              :title="formatDate(nugget.createdAt)"
            >
              <p>{{ formatDate(nugget.createdAt) }}</p>
            </td>
            <td class="cell empty">
              <p></p>
            </td>
          </tr>
          <nuggets-menu
            v-if="viewMenu && selectedNuggets.length"
            ref="menu"
            @hook:mounted="setMenuPosition"
            @hideMenu="hideMenu"
            v-on-clickout.capture="hideMenu"
          />
        </tbody>
      </table>
      <infinite-loading
        v-if="showInfiniteLoader && !globalLoading"
        spinner="spiral"
        @infinite="infiniteHandler"
        :identifier="infiniteLoaderIdentifier"
      >
        <div slot="spinner">
          <loading></loading>
        </div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="clearMessage"
      v-on-clickout="clearMessage"
    ></snackbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import server from './../server'
import { formatDate } from '../helpers'
import { mixin as clickout } from 'vue-clickout'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
import InfiniteLoading from 'vue-infinite-loading'

const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snack" */ './Snackbar'
)
const NuggetsMenu = () => import(
  /* webpackChunkName: "NuggetsMenu" */ './NuggetsMenu'
)
const Filters = () => import(
  /* webpackChunkName: "Filters" */ './Filters'
)
const Sort = () => import(
  /* webpackChunkName: "Sort" */ './Sort'
)

export default {
  mixins: [clickout],
  name: 'NuggetTableView',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      sortIconColor: '#008290',
      sortIconSrc: require('@/assets/chevron-down.svg'),
      status: null,
      message: null,
      checkboxLoadings: {},
      viewMenu: false,
      mouseEvent: null,
      showTooltip: null,
      isSelected: 'sort',
      showInfiniteLoader: false
    }
  },
  props: {
    nuggets: Array,
    selectAction: Function,
    infiniteHandler: Function,
    sortAction: Function,
    sortCriteria: Object
  },
  computed: {
    headers () {
      return [
        {
          label: this.nuggetMetadata.fields.isSubscribed.label,
          isSortingActive: this.sortCriteria.field === 'isSubscribed',
          isFilteringActive: this.modelFilters.isSubscribed.length,
          field: 'isSubscribed',
          sortCriteria: 'isSubscribed',
          className: 'subscribe',
          filteringItems: this.nuggetIsSubscribed
        },
        {
          label: this.nuggetMetadata.fields.id.label,
          isSortingActive: this.sortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          sortCriteria: 'id',
          className: 'id',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          isSortingActive: this.sortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          sortCriteria: 'title',
          className: 'title',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          isSortingActive: this.sortCriteria.field === 'boarding',
          isFilteringActive: this.modelFilters.boarding.length,
          field: 'boarding',
          sortCriteria: 'boarding',
          className: 'pace',
          filteringItems: this.nuggetBoardings
        },
        {
          label: this.nuggetMetadata.fields.status.label,
          isSortingActive: this.sortCriteria.field === 'status',
          isFilteringActive: this.modelFilters.status.length,
          field: 'status',
          sortCriteria: 'status',
          className: 'status',
          filteringItems: this.nuggetStatuses
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          isSortingActive: this.sortCriteria.field === 'kind',
          isFilteringActive: this.modelFilters.kind.length,
          field: 'kind',
          sortCriteria: 'kind',
          className: 'kind',
          filteringItems: this.nuggetKinds
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          isSortingActive: this.sortCriteria.field === 'phaseId',
          isFilteringActive: this.modelFilters.phaseId.length,
          field: 'phaseId',
          sortCriteria: 'phaseId',
          className: 'phase',
          filteringItems: this.computedFilteringItems
        },
        {
          label: this.nuggetMetadata.fields.dueDate.label,
          isSortingActive: this.sortCriteria.field === 'dueDate',
          isFilteringActive: null,
          field: 'dueDate',
          sortCriteria: 'dueDate',
          className: 'target-date',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          isSortingActive: this.sortCriteria.field === 'priority',
          isFilteringActive: this.modelFilters.priority.length,
          field: 'priority',
          sortCriteria: 'priority',
          className: 'priority',
          filteringItems: this.nuggetPriorities
        },
        {
          label: this.nuggetMetadata.fields.projectId.label,
          isSortingActive: this.sortCriteria.field === 'projectTitle',
          isFilteringActive: this.modelFilters.projectId.length,
          field: 'projectId',
          sortCriteria: 'projectTitle',
          className: 'project',
          filteringItems: this.allProjects
        },
        {
          label: this.nuggetMetadata.fields.createdAt.label,
          isSortingActive: this.sortCriteria.field === 'createdAt',
          isFilteringActive: null,
          field: 'createdAt',
          sortCriteria: 'createdAt',
          className: 'created-at',
          filteringItems: null
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    modelFilters () {
      if (this.$route.name.match('Nuggets')) {
        return this.nuggetFilters
      } else if (this.$route.name.match('Unread')) {
        return this.unreadNuggetFilters
      } else if (this.$route.name.match('Subscribed')) {
        return this.subscribedNuggetFilters
      }
    },
    computedMutation () {
      if (this.$route.name.match('Nuggets')) {
        return this.setNuggetFilters
      } else if (this.$route.name.match('Unread')) {
        return this.setUnreadNuggetFilters
      } else if (this.$route.name.match('Subscribed')) {
        return this.setSubscribedNuggetFilters
      }
    },
    computedFilteringItems () {
      if (this.$route.name.match('Nuggets')) {
        return this.decoratedPhasesOfCurrentWorkflow
      } else {
        return this.decoratedPhases
      }
    },
    ...mapState([
      'selectedNuggets',
      'nuggetStatuses',
      'nuggetBoardings',
      'nuggetKinds',
      'nuggetFilters',
      'nuggetPriorities',
      'unreadNuggetFilters',
      'subscribedNuggetFilters',
      'nuggetIsSubscribed',
      'infiniteLoaderIdentifier',
      'currentTab',
      'allProjects',
      'phases',
      'globalLoading'
    ]),
    ...mapGetters([
      'decoratedPhases',
      'decoratedPhasesOfCurrentWorkflow'
    ])
  },
  watch: {
    'nuggets': {
      immediate: true,
      async handler (newValue, oldValue) {
        if (!oldValue && newValue.length && this.currentTab !== 'Unread') {
          await this.selectAction({ nugget: newValue[0] })
        }
        this.showInfiniteLoader = true
      }
    }
  },
  methods: {
    toggleSubscription (nugget) {
      this.clearMessage()
      this.$set(this.checkboxLoadings, nugget.id, true)
      let request
      if (nugget.isSubscribed) {
        request = nugget.unsubscribe()
      } else {
        request = nugget.subscribe()
      }
      request.send()
        .then(() => {
          this.setRefreshSubscriptionListToggle()
        })
        .catch((err) => {
          this.status = err.status
          this.message = err.error
        }).finally(() => {
          this.$set(this.checkboxLoadings, nugget.id, false)
        })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    getPhaseTitle (nugget) {
      let phase = this.phases
        .find(phase =>
          phase.id === nugget.phaseId
        )
      return phase ? phase.title : 'Triage'
    },
    eventHandler (event, requestedNugget) {
      if (event.ctrlKey) {
        this.updateSelectedNuggets(requestedNugget)
      } else {
        this.selectAction({ nugget: requestedNugget })
      }
    },
    hideMenu () {
      this.viewMenu = false
    },
    showMenu (event) {
      this.hideMenu()
      this.viewMenu = true
      this.mouseEvent = event
    },
    setMenuPosition () {
      let mouseX = this.mouseEvent.x
      let mouseY = this.mouseEvent.y
      let menuHeight = this.$refs.menu.$el.clientHeight
      let menuWidth = this.$refs.menu.$el.clientWidth
      if (Math.min(0, window.innerHeight - menuHeight - mouseY) < 0) {
        this.$refs.menu.$el.style.bottom = `${window.innerHeight - mouseY}px`
        this.$refs.menu.$el.classList.add('top')
      } else {
        this.$refs.menu.$el.style.top = `${mouseY}px`
      }
      this.$refs.menu.$el.style.left = `${mouseX -
        Math.abs(Math.min(0, window.innerWidth - menuWidth - mouseX))}px`
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    hideTooltip () {
      this.showTooltip = null
    },
    formatDate,
    ...mapMutations([
      'setNuggetFilters',
      'setUnreadNuggetFilters',
      'setSubscribedNuggetFilters',
      'setRefreshSubscriptionListToggle'
    ]),
    ...mapActions([
      'updateSelectedNuggets'
    ])
  },
  components: {
    Loading,
    Snackbar,
    LoadingCheckbox,
    NuggetsMenu,
    Filters,
    Sort,
    InfiniteLoading
  }
}
</script>
