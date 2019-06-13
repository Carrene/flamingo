<template>
  <div id="upcomingItems">

    <!-- TABLE -->

    <div class="table-box">

      <table
        class="table upcoming-items"
        v-if="showingTable"
      >
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
                  :filepath="iconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isSortingActive"
                  :class="{ascending: !upcomingNuggetsSortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip"
                :class="header.field === 'issueId' || header.field === 'title' ? 'left' : 'center'"
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
                    :mutation="setUpcomingNuggetsFilters"
                    :header="header"
                    :model="upcomingNuggetsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="upcomingNuggetsSortCriteria"
                    :sort-action="sort"
                    :header="header"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            class="row"
            v-for="item in upcomingItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>N{{ item.issueId }}</p>
            </td>
            <td class="cell name">
              <p>{{ item.issue.title }}</p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="item.issue.boarding"
              >
                <p>{{ item.issue.boarding.capitalize() }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind.capitalize() }}</p>
            </td>
            <td class="cell starts-in">
              <p>{{ calculateStartingDate(item.startDate) }} Day</p>
            </td>
            <td class="cell my-start">
              <p>{{ formatDate(item.startDate) }}</p>
            </td>
            <td class="cell my-target">
              <p>{{ formatDate(item.endDate) }}</p>
            </td>
            <td class="cell hours-worked">
              <p><span>{{ item.hoursWorked ? Math.round(item.hoursWorked) : "0" }} </span>/ <span>{{ Math.round(item.estimatedHours) }}</span></p>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority.capitalize() }}</p>
            </td>
            <td class="cell phase">
              <p>{{ phases.find(phase => item.phaseId === phase.id).title }}</p>
            </td>
            <td class="cell empty">
              <p></p>
            </td>
          </tr>
        </tbody>
      </table>
      <infinite-loading
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

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { formatDate } from './../helpers.js'
import InfiniteLoading from 'vue-infinite-loading'
import { mixin as clickout } from 'vue-clickout'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Sort = () => import(
  /* webpackChunkName: "Sort" */ './Sort'
)
const Filters = () => import(
  /* webpackChunkName: "Filters" */ './Filters'
)

export default {
  mixins: [clickout],
  name: 'UpcomingItems',
  data () {
    return {
      selectedAssigned: null,
      showingTable: true,
      showTooltip: null,
      isSelected: 'sort',
      iconSrc: require('@/assets/chevron-down.svg'),
      sortIconColor: '#008290'
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'ID',
          className: 'id',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null
        },
        {
          label: 'Name',
          className: 'name',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings
        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds
        },
        {
          label: 'Starts In',
          className: 'starts-in',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'startDate',
          isFilteringActive: null,
          field: 'startDate',
          filteringItems: null
        },
        {
          label: 'My Start',
          className: 'my-start',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'startDate',
          isFilteringActive: null,
          field: 'startDate',
          filteringItems: null
        },
        {
          label: 'My Target',
          className: 'my-target',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'endDate',
          isFilteringActive: null,
          field: 'endDate',
          filteringItems: null
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'hoursWorked',
          isFilteringActive: null,
          field: 'hoursWorked',
          filteringItems: null
        },
        {
          label: 'Project',
          className: 'project',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'project',
          isFilteringActive: null,
          field: 'project',
          filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities
        },
        {
          label: 'Phase',
          className: 'phase',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'phase',
          filteringItems: null
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'selectedItem',
      'upcomingItems',
      'infiniteLoaderIdentifier',
      'phases',
      'upcomingNuggetsSortCriteria',
      'upcomingNuggetsFilters',
      'itemPriorities',
      'itemKinds',
      'itemBoardings'
    ])
  },
  watch: {
    'upcomingNuggetsSortCriteria': {
      deep: true,
      handler () {
        this.listItems()
      }
    },
    'upcomingNuggetsFilters': {
      deep: true,
      handler () {
        this.listItems()
      }
    }
  },
  methods: {
    calculateStartingDate (startDate) {
      let today = new Date()
      let startDateObject = new Date(startDate)
      let timeDiff = Math.abs(startDateObject.getTime() - today.getTime())
      var diffDays = Math.ceil(timeDiff / (86400000)) // 1000 * 3600 * 24 = 86400000 (Number of milliseconds in one day)
      return diffDays
    },
    infiniteHandler ($state) {
      this.updateListItem($state)
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setUpcomingNuggetsSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    formatDate: formatDate,
    ...mapMutations([
      'setUpcomingNuggetsSortCriteria',
      'setUpcomingNuggetsFilters'
    ]),
    ...mapActions([
      'listItems',
      'updateListItem',
      'selectItem'
    ])
  },
  components: {
    InfiniteLoading,
    Loading,
    Sort,
    Filters
  }
}
</script>
