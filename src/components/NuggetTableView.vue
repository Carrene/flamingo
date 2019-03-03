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
              :class="[{active: header.isActive}, header.className]"
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
                  v-if="header.isActive"
                  :class="{ascending: !sortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip center"
                v-if="showTooltip === header.label"
                v-on-clickout.capture="hideTooltip"
              >
                <div class="tooltip-header">
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
            @click="selectAction({ nugget: nugget })"
            @contextmenu.prevent="showMenu"
          >
            <td
              class="cell id"
              :title="nugget.id"
            >
              <p>{{ nugget.id }}</p>
            </td>
            <td class="subscribe cell">
              <loading-checkbox
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
              class="cell title"
              :title="nugget.title"
              @click.stop="eventHandler($event, nugget)"
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
              class="priority cell"
              :title="nugget.priority.formatText()"
            >
              <p>{{ nugget.priority.formatText() }}</p>
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
              class="tags cell"
              :title="nugget.tagTitles.length ? nugget.tagTitles.join(',') : '-'"
            >
              <div class="tag-card" v-for="tag in nugget.tagTitles" :key="tag">
                <p>{{ tag }}</p>
              </div>
            </td>
            <td
              class="days cell"
              :title="nugget.days"
            >
              <p>{{ nugget.days }}</p>
            </td>
            <td
              class="target-date cell"
              :title="formatTargetDate(nugget.dueDate)"
            >
              <p>{{ formatTargetDate(nugget.dueDate) }}</p>
            </td>
            <td
              class="created-at cell"
              :title="formatTargetDate(nugget.createdAt)"
            >
              <p>{{ formatTargetDate(nugget.createdAt) }}</p>
            </td>
          </tr>
          <nuggets-menu
            v-if="viewMenu && selectedNuggets.length"
            ref="menu"
            @mounted="setMenuPosition"
            @hideMenu="hideMenu"
            v-on-clickout.capture="hideMenu"
          />
        </tbody>
      </table>
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
import { mapState, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import server from './../server'
import { mixin as clickout } from 'vue-clickout'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
// import ViewState from '../view-state.js'

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
      loading: false,
      nuggetMetadata: server.metadata.models.Issue,
      sortIconColor: '#008290',
      sortIconSrc: require('@/assets/chevron-down.svg'),
      status: null,
      message: null,
      checkboxLoadings: {},
      viewMenu: false,
      mouseEvent: null,
      showTooltip: null,
      isSelected: 'sort'
    }
  },
  props: {
    nuggets: Array,
    selectAction: Function,
    sortAction: Function,
    sortCriteria: Object
  },
  computed: {
    headers () {
      return [
        {
          label: this.nuggetMetadata.fields.id.label,
          isActive: this.sortCriteria.field === 'id',
          field: 'id',
          className: 'id',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.isSubscribed.label,
          isActive: this.sortCriteria.field === 'isSubscribed',
          field: 'isSubscribed',
          className: 'subscribe',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          isActive: this.sortCriteria.field === 'title',
          field: 'title',
          className: 'title',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          isActive: this.sortCriteria.field === 'boarding',
          field: 'boarding',
          className: 'pace',
          filteringItems: this.nuggetBoardings
        },
        {
          label: this.nuggetMetadata.fields.status.label,
          isActive: this.sortCriteria.field === 'status',
          field: 'status',
          className: 'status',
          filteringItems: this.nuggetStatuses
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          isActive: this.sortCriteria.field === 'priority',
          field: 'priority',
          className: 'priority',
          filteringItems: this.nuggetPriorities
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          isActive: this.sortCriteria.field === 'kind',
          field: 'kind',
          className: 'kind',
          filteringItems: this.nuggetKinds
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          isActive: this.sortCriteria.field === 'phaseId',
          field: 'phaseId',
          className: 'phase',
          filteringItems: this.phasesOfSelectedWorkflow
        },
        {
          label: this.nuggetMetadata.fields.tagId.label,
          isActive: this.sortCriteria.field === 'tagId',
          field: 'tagId',
          className: 'tags',
          filteringItems: this.tags
        },
        {
          label: this.nuggetMetadata.fields.days.label,
          isActive: this.sortCriteria.field === 'days',
          field: 'days',
          className: 'days',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.dueDate.label,
          isActive: this.sortCriteria.field === 'dueDate',
          field: 'dueDate',
          className: 'target-date',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.createdAt.label,
          isActive: this.sortCriteria.field === 'createdAt',
          field: 'createdAt',
          className: 'created-at',
          filteringItems: null
        }
      ]
    },
    modelFilters () {
      if (this.$route.name.match('Nuggets')) {
        return this.nuggetFilters
      } else if (this.$route.name.match('Unread')) {
        return this.unreadNuggetFilters
      }
    },
    computedMutation () {
      if (this.$route.name.match('Nuggets')) {
        return this.setNuggetFilters
      } else if (this.$route.name.match('Unread')) {
        return this.setUnreadNuggetFilters
      }
    },
    ...mapState([
      'selectedNuggets',
      'phasesOfSelectedWorkflow',
      'Resource',
      'nuggetStatuses',
      'nuggetBoardings',
      'nuggetKinds',
      'nuggetFilters',
      'nuggetPriorities',
      'tags',
      'nuggetSortCriteria',
      'unreadNuggetFilters',
      'nuggetIsSubscribed'
    ])
  },
  methods: {
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    toggleSubscription (nugget) {
      this.clearMessage()
      this.$set(this.checkboxLoadings, nugget.id, true)
      let request
      if (nugget.isSubscribed) {
        request = nugget.unsubscribe()
      } else {
        request = nugget.subscribe()
      }
      request.send().catch((err) => {
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
      let phase = nugget.getPhase(this.phasesOfSelectedWorkflow)
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
    // async updateList () {
    //   this.loading = true
    //   this.setNuggetsViewState(new ViewState({}))
    //   await this.listNuggets(this.$route.params.nuggetId)
    //   this.loading = false
    // },
    ...mapMutations([
      'setNuggetFilters',
      'setUnreadNuggetFilters',
      'setNuggetsViewState',
      'setNuggetSortCriteria'
    ]),
    ...mapActions([
      'updateSelectedNuggets',
      'listNuggets'
    ])
  },
  components: {
    Loading,
    Snackbar,
    LoadingCheckbox,
    NuggetsMenu,
    Filters,
    Sort
  }
}
</script>
