<template>
  <div id="completedDoneItems">

    <!-- TABLE -->

    <div class="table-box">

      <table
        class="table"
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
                  :class="{ascending: !completedDoneSortCriteria.descending}"
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
                <div class="tooltip-header"
                :class="header.filteringItems ? 'double-tooltip' : 'single-tooltip'">
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
                    :mutation="setCompletedDoneFilters"
                    :header="header"
                    :model="completedDoneFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="completedDoneSortCriteria"
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
            v-for="item of completedDoneItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>N{{ item.issue.id }}</p>
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
            <td class="cell my-start">
              <p>{{ formatDate(item.startDate) }}</p>
            </td>
            <td class="cell my-target">
              <p>{{ formatDate(item.endDate) }}</p>
            </td>
            <td class="cell hours-worked">
              <p> <span>{{ item.hoursWorked ? Math.round(item.hoursWorked) : "0" }} </span>/ <span>{{ Math.round(item.estimatedHours) }}</span></p>
            </td>
            <td class="cell status">
              <p>{{ item.status }}</p>
            </td>
            <td class="cell phase">
              <p>{{ phases.find(phase => item.phaseId === phase.id).title }}</p>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title }}</p>
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
  name: 'CompletedDoneItems',
  data () {
    return {
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
          isSortingActive: this.completedDoneSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null,
          sortCriteria: 'issueId'

        },
        {
          label: 'Name',
          className: 'name',
          isSortingActive: this.completedDoneSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null,
          sortCriteria: 'issueTitle'

        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.completedDoneSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.itemBoardings,
          sortCriteria: 'issueBoarding'

        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.completedDoneSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'

        },
        {
          label: 'My Start',
          className: 'my-start',
          isSortingActive: this.completedDoneSortCriteria.field === 'startDate',
          isFilteringActive: null,
          field: 'startDate',
          filteringItems: null,
          sortCriteria: 'startDate'

        },
        {
          label: 'My Target',
          className: 'my-target',
          isSortingActive: this.completedDoneSortCriteria.field === 'endDate',
          isFilteringActive: null,
          field: 'endDate',
          filteringItems: null,
          sortCriteria: 'endDate'

        },
        {
          label: 'Hours Worked',
          className: 'hours-worked',
          isSortingActive: this.completedDoneSortCriteria.field === 'hoursWorked',
          isFilteringActive: null,
          field: 'hoursWorked',
          filteringItems: null,
          sortCriteria: 'hoursWorked'

        },
        {
          label: 'Status',
          className: 'status',
          isSortingActive: this.completedDoneSortCriteria.field === 'status',
          isFilteringActive: null,
          field: 'status',
          filteringItems: null,
          sortCriteria: 'status'

        },
        {
          label: 'Phase',
          className: 'phase',
          isSortingActive: this.completedDoneSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: 'Project',
          className: 'project',
          isSortingActive: this.completedDoneSortCriteria.field === 'projectTitle',
          isFilteringActive: this.completedDoneFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'completedDoneItems',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'phases',
      'completedDoneSortCriteria',
      'completedDoneFilters',
      'itemBoardings',
      'itemKinds',
      'itemPriorities',
      'allProjects'
    ])
  },
  watch: {
    'completedDoneSortCriteria': {
      deep: true,
      handler () {
        this.listItems()
      }
    },
    'completedDoneFilters': {
      deep: true,
      handler () {
        this.listItems()
      }
    }
  },
  methods: {
    infiniteHandler ($state) {
      this.updateListItem($state)
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setCompletedDoneSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setCompletedDoneSortCriteria',
      'setCompletedDoneFilters'
    ]),
    ...mapActions([
      'listItems',
      'updateListItem',
      'selectItem'
    ]),
    formatDate
  },
  components: {
    InfiniteLoading,
    Loading,
    Sort,
    Filters
  }
}
</script>
