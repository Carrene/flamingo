<template>
  <div id="missingHoursItems">

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
                  :class="{ascending: !missingHoursSortCriteria.descending}"
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
                    :mutation="setMissingHoursFilters"
                    :header="header"
                    :model="missingHoursFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="missingHoursSortCriteria"
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
            v-for="item in missingHoursItems"
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
                <p>{{ item.issue.boarding }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind }}</p>
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
            <td class="cell project">
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority }}</p>
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
      <!-- FIXME: ADD THIS LATER -->
      <!-- <infinite-loading
        spinner="spiral"
        @infinite="infiniteHandler"
        :identifier="infiniteLoaderIdentifier"
      >
        <div slot="spinner">
          <loading></loading>
        </div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading> -->
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
  name: 'MissingHoursItems',
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
          isSortingActive: this.missingHoursSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null
        },
        {
          label: 'Name',
          className: 'title',
          isSortingActive: this.missingHoursSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          isSortingActive: this.missingHoursSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings
        },
        {
          label: 'Type',
          className: 'type',
          isSortingActive: this.missingHoursSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds
        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.missingHoursSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null
        },
        {
          label: 'Project',
          className: 'project',
          isSortingActive: this.missingHoursSortCriteria.field === 'phase',
          isFilteringActive: null,
          field: 'project',
          filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          isSortingActive: this.missingHoursSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities
        },
        {
          label: 'Phase',
          className: 'phase',
          isSortingActive: this.missingHoursSortCriteria.field === 'phase',
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
      'missingHoursSortCriteria',
      'missingHoursFilters',
      'missingHoursItems',
      'phases',
      'selectedItem'
    ])
  },
  watch: {
    'missingHoursSortCriteria': {
      deep: true,
      handler () {
        this.listBadNews()
      }
    },
    'missingHoursFilters': {
      deep: true,
      handler () {
        this.listBadNews()
      }
    }
  },
  methods: {
    // FIXME: ADD THIS LATER
    // infiniteHandler ($state) {
    //   this.updateListItem($state)
    // },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setMissingHoursSortCriteria({
        field: header.field,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setMissingHoursSortCriteria',
      'setMissingHoursFilters'
    ]),
    ...mapActions([
      'listBadNews',
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
