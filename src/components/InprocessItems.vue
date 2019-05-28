<template>
  <div id="inprocessItems">

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
              :class="[{'active-sorting': header.isSortingActive }, header.className]"
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
                  :class="{ascending: !inProcessNuggetsSortCriteria.descending}"
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
                  <!-- <div
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
                  </div> -->
                </div>
                <div class="tooltip-content">
                  <!-- <filters
                    class="filter-content"
                    v-if="isSelected === 'filter'"
                    :mutation="setProjectFilters"
                    :header="header"
                    :model="projectFilters"
                  /> -->
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="inProcessNuggetsSortCriteria"
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
            v-for="item of inprocessItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>{{ item.issueId }}</p>
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
            <td
              class="cell time-card"
              :class="item.perspective.toLowerCase()"
            >
              <p>{{ item.perspective }}</p>
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
            <td class="cell project">
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority.capitalize() }}</p>
            </td>
            <td class="cell phase">
              <p>{{ phases.find(phase => item.phaseId === phase.id).title }}</p>
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

export default {
  mixins: [clickout],
  name: 'InprocessItems',
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
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null
        },
        {
          label: 'Name',
          className: 'name',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: null
        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: null
        },
        {
          label: 'Time Card',
          className: 'time-card',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'perspective',
          isFilteringActive: null,
          field: 'perspective',
          filteringItems: null
        },
        {
          label: 'My Start',
          className: 'my-start',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'startDate',
          isFilteringActive: null,
          field: 'startDate',
          filteringItems: null
        },
        {
          label: 'My Target',
          className: 'my-target',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'endDate',
          isFilteringActive: null,
          field: 'endDate',
          filteringItems: null
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'hoursWorked',
          isFilteringActive: null,
          field: 'hoursWorked',
          filteringItems: null
        },
        {
          label: 'Project',
          className: 'project',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'project',
          isFilteringActive: null,
          field: 'project',
          filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: null
        },
        {
          label: 'Phase',
          className: 'phase',
          isSortingActive: this.inProcessNuggetsSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'phase',
          filteringItems: null
        }
      ]
    },
    ...mapState([
      'inprocessItems',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'phases',
      'inProcessNuggetsSortCriteria'
    ])
  },
  watch: {
    'inProcessNuggetsSortCriteria': {
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
      this.setInProcessNuggetsSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setInProcessNuggetsSortCriteria'
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
    Sort
  }
}
</script>
