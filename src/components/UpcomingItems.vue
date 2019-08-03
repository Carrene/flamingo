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
                :class="[
                  header.field === 'issueId' || header.field === 'title' ? 'left' : 'center',
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
            <td
              class="cell id"
              :title="`N${item.issue.id}`"
            >
              <p>N{{ item.issue.id }}</p>
            </td>
            <td
              class="cell name"
              :title="item.issue.title"
            >
              <p>{{ item.issue.title }}</p>
            </td>

            <td
              class="cell tempo"
              :title="item.issue.boarding.capitalize()"
            >
              <div
                class="tempo-card"
                :class="item.issue.boarding"
              >
                <p>{{ item.issue.boarding.capitalize() }}</p>
              </div>
            </td>
            <td
              class="type cell"
              :title="item.issue.kind.capitalize()"
            >
              <p>{{ item.issue.kind.capitalize() }}</p>
            </td>
            <td
              class="cell starts-in"
              :title="calculateStartingDate(item.startDate)"
            >
              <p>{{ calculateStartingDate(item.startDate) }} Day</p>
            </td>
            <td
              class="cell my-start"
              :title="formatDate(item.startDate)"
            >
              <p>{{ formatDate(item.startDate) }}</p>
            </td>
            <td
              class="cell my-target"
              :title="formatDate(item.endDate)"
            >
              <p>{{ formatDate(item.endDate) }}</p>
            </td>
            <td
              class="cell hours-worked"
              :title="`${ item.hoursWorked ? Math.round(item.hoursWorked) : '0'}/${Math.round(item.estimatedHours)}`"
            >
              <p><span>{{ item.hoursWorked ? Math.round(item.hoursWorked) : "0" }} </span>/ <span>{{ Math.round(item.estimatedHours) }}</span></p>
            </td>
            <td
              class="cell phase"
              :title="phases.find(phase => item.phaseId === phase.id).title"
            >
              <p>{{ phases.find(phase => item.phaseId === phase.id).title }}</p>
            </td>
            <td
              class="cell project"
              :title="item.issue.project.title"
            >
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td
              class="cell priority"
              :title="item.issue.priority.capitalize()"
            >
              <p>{{ item.issue.priority.capitalize() }}</p>
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
import server from './../server'
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
      nuggetMetadata: server.metadata.models.Issue,
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
          label: this.nuggetMetadata.fields.id.label,
          className: 'id',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null,
          sortCriteria: 'issueId'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'name',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null,
          sortCriteria: 'issueTitle'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.itemBoardings,
          sortCriteria: 'issueBoarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'

        },
        {
          label: 'Starts In',
          className: 'starts-in',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'startDate',
          isFilteringActive: null,
          field: 'startDate',
          filteringItems: null,
          sortCriteria: 'startDate'

        },
        {
          label: 'My Start',
          className: 'my-start',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'startDate',
          isFilteringActive: null,
          field: 'startDate',
          filteringItems: null,
          sortCriteria: 'startDate'

        },
        {
          label: 'My Target',
          className: 'my-target',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'endDate',
          isFilteringActive: null,
          field: 'endDate',
          filteringItems: null,
          sortCriteria: 'endDate'

        },
        {
          label: 'Hours Worked',
          className: 'hours-worked',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'hoursWorked',
          isFilteringActive: null,
          field: 'hoursWorked',
          filteringItems: null,
          sortCriteria: 'hoursWorked'

        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'projectTitle',
          isFilteringActive: this.upcomingNuggetsFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.upcomingNuggetsSortCriteria.field === 'issuePriority',
          isFilteringActive: null,
          field: 'issuePriority',
          filteringItems: this.itemPriorities,
          sortCriteria: 'issuePriority'

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
      'itemBoardings',
      'allProjects'
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
        field: header.sortCriteria,
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
