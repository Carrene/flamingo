<template>
  <div id="newlyAssigned">

    <!-- TABLE -->

    <div class="table-box">

      <table
        class="table newly-assigned"
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
                  :class="{ascending: !newlyAssignedSortCriteria.descending}"
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
                    :mutation="setNewlyAssignedFilters"
                    :header="header"
                    :model="newlyAssignedFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="newlyAssignedSortCriteria"
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
            v-for="item of newlyAssignedItems"
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
import InfiniteLoading from 'vue-infinite-loading'
import { mapState, mapActions, mapMutations } from 'vuex'
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
  name: 'NewlyAssigned',
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
          isSortingActive: this.newlyAssignedSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null
        },
        {
          label: 'Name',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null,
          className: 'name'
        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings
        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds
        },
        {
          label: 'Project',
          className: 'project',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'project',
          isFilteringActive: null,
          field: 'project',
          filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities
        },
        {
          label: 'Phase',
          className: 'phase',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'phase',
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
      'newlyAssignedItems',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'phases',
      'newlyAssignedSortCriteria',
      'newlyAssignedFilters',
      'itemBoardings',
      'itemKinds',
      'itemPriorities'
    ])
  },
  watch: {
    'newlyAssignedSortCriteria': {
      deep: true,
      handler () {
        this.listItems()
      }
    },
    'newlyAssignedFilters': {
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
      this.setNewlyAssignedSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setNewlyAssignedSortCriteria',
      'setNewlyAssignedFilters'
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
