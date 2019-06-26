<template>
  <div id="needApprovalItems">

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
              @click=tooltipHandler(header)
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
                <simple-svg
                  :filepath="iconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isSortingActive"
                  :class="{ascending: !needApprovalItemsSortCriteria.descending}"
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
                    :mutation="setNeedApprovalItemsFilters"
                    :header="header"
                    :model="needApprovalItemsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="needApprovalItemsSortCriteria"
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
            v-for="item of needApprovalItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>N{{ item.id }} </p>
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
            <td class="cell phase-completed">
              <p>-</p>
            </td>
            <td class="cell approve">
              <loading-checkbox
                @click.native="toggleApprove(item)"
                :checked="item.isDone"
                class="check-box"
                :size="16"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
              ></loading-checkbox>
            </td>
            <td class="cell grace-period">
              <p>-</p>
            </td>
            <td class="cell priority">
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
  name: 'needApprovalItems',
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
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null
        },
        {
          label: 'Name',
          className: 'title',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings
        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds
        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: null,
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null
        },
        {
          label: 'Phase Completed',
          className: 'phase-completed',
          isSortingActive: null,
          isFilteringActive: null,
          field: 'phaseCompleted',
          filteringItems: null
        },
        {
          label: 'Approve',
          className: 'approve',
          isSortingActive: null,
          isFilteringActive: null,
          field: 'approve',
          filteringItems: null
        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: null,
          isFilteringActive: null,
          field: 'gracePeriod',
          filteringItems: this.itemPriorities
        },
        {
          label: 'Priority',
          className: 'priority',
          isSortingActive: null,
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities
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
      'needApprovalItems',
      'needApprovalItemsSortCriteria',
      'needApprovalItemsFilters',
      'infiniteLoaderIdentifier',
      'selectedItem',
      'infiniteLoaderIdentifier'
    ])
  },
  watch: {
    'needApprovalItemsSortCriteria': {
      deep: true,
      handler () {
        this.listGoodNews()
      }
    },
    'needApprovalItemsFilters': {
      deep: true,
      handler () {
        this.listGoodNews()
      }
    }
  },
  methods: {
    toggleApprove (item) {
      if (item.isDone) {
        item.isDone = false
      } else {
        item.isDone = true
      }
    },
    infiniteHandler ($state) {
      this.updateListGoodNews($state)
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setNeedApprovalItemsSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setNeedApprovalItemsSortCriteria',
      'setNeedApprovalItemsFilters'
    ]),
    ...mapActions([
      'listGoodNews',
      'selectItem',
      'updateListGoodNews'
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
