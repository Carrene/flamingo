<template>
  <div id="missingEstimateItems">

    <!-- TABLE -->

    <div class="table-box">

      <table class="table">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="header.className"
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
                  :class="{ascending: !missingEstimateSortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip"
                :class="header.label === 'ID' ? 'left' : 'center'"
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
                    :mutation="setMissingEstimateFilters"
                    :header="header"
                    :model="missingEstimateFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="missingEstimateSortCriteria"
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
            v-for="item in missingEstimateItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>N{{ item.issue.id }}</p>
            </td>
            <td class="cell title">
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
            <td class="cell batch">
              <div class="input-container">
                <v-select
                  index="index"
                  label="index"
                  disabled
                ></v-select>
              </div>
            </td>
            <td class="cell grace-period">
              <p>-</p>
            </td>
            <td class="cell extend">
              <loading-checkbox
                class="check-box"
                :size="16"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
              ></loading-checkbox>
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
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
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
  name: 'MissingEstimateItems',
  data () {
    return {
      selectedAssigned: null,
      selectedPhase: 'Backlog',
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
          isSortingActive: this.missingEstimateSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null
        },
        {
          label: 'Name',
          className: 'title',
          isSortingActive: this.missingEstimateSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.missingEstimateSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings
        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.missingEstimateSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds
        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.missingEstimateSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null
        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: this.missingEstimateSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'gracePeriod',
          filteringItems: null
        },
        {
          label: 'Extend',
          className: 'extend',
          isSortingActive: this.missingEstimateSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'extend',
          filteringItems: null
        },
        {
          label: 'Project',
          className: 'project',
          isSortingActive: this.missingEstimateSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'project',
          filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          isSortingActive: this.missingEstimateSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities
        },
        {
          label: 'Phase',
          className: 'phase',
          isSortingActive: this.missingEstimateSortCriteria.field === 'phase',
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
      'itemBoardings',
      'itemKinds',
      'itemPriorities',
      'missingEstimateSortCriteria',
      'missingEstimateFilters',
      'missingEstimateItems',
      'phases',
      'selectedItem',
      'infiniteLoaderIdentifier'
    ])
  },
  watch: {
    'missingEstimateSortCriteria': {
      deep: true,
      handler () {
        this.listBadNews()
      }
    },
    'missingEstimateFilters': {
      deep: true,
      handler () {
        this.listBadNews()
      }
    }
  },
  methods: {
    infiniteHandler ($state) {
      this.updateBadNewsList($state)
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setMissingEstimateSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setMissingEstimateSortCriteria',
      'setMissingEstimateFilters'
    ]),
    ...mapActions([
      'listBadNews',
      'selectItem',
      'updateBadNewsList'
    ]),
    formatDate
  },
  components: {
    InfiniteLoading,
    Loading,
    Sort,
    Filters,
    LoadingCheckbox
  }
}
</script>
