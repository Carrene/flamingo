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
              :class="[{'active-filtering': header.isFilteringActive, 'active-sorting': header.isSortingActive }, header.className]"
            >
              <div class="title-container">
                <p
                  :title="header.label"
                  @click=tooltipHandler(header)
                >{{ header.label }}</p>
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
                :class="[header.label === 'ID' ? 'left' : 'center', (header.filteringItems) ? 'single-tooltip': 'double-tooltip']"
                v-if="showTooltip === header.label"
                v-on-clickout.capture="hideTooltip"
              >
                <div class="tooltip-header"
                :class="(header.filteringItems) ? 'single': 'double'">
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
              <p>N{{ item.issue.id }} </p>
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
                  v-model="item.issue.batchTitle"
                  @input="callForChange"
                  :clearable="false"
                  :options="batches"
                  index="value"
                ></v-select>
              </div>
            </td>
            <td class="cell phase-completed">
              <p>{{ getPhaseTitle(item) }}</p>
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
            <td
              class="cell grace-period"
              :class="{'expired': item.gracePeriod < 0}"
            >
              <p>{{ convertHoursToHoursAndMinutes(item.gracePeriod) }}</p>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title.capitalize() }}</p>
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
import server from './../server'
import { mapState, mapActions, mapMutations } from 'vuex'
import { formatDate, convertHoursToHoursAndMinutes } from './../helpers.js'
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
      nuggetMetadata: server.metadata.models.Issue,
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
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null,
          sortCriteria: 'issueId'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null,
          sortCriteria: 'issueTitle'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.itemBoardings,
          sortCriteria: 'issueBoarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'

        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null,
          sortCriteria: 'batch'

        },
        {
          label: 'Phase Completed',
          className: 'phase-completed',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: 'Approve',
          className: 'approve',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'approve',
          isFilteringActive: null,
          field: 'approve',
          filteringItems: null,
          sortCriteria: 'approve'

        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'gracePeriod',
          isFilteringActive: null,
          field: 'gracePeriod',
          filteringItems: null,
          sortCriteria: 'gracePeriod'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'projectTitle',
          isFilteringActive: this.needApprovalItemsFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.needApprovalItemsSortCriteria.field === 'issuePriority',
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
      'batches',
      'itemBoardings',
      'itemKinds',
      'itemPriorities',
      'needApprovalItems',
      'needApprovalItemsSortCriteria',
      'needApprovalItemsFilters',
      'infiniteLoaderIdentifier',
      'selectedItem',
      'phases',
      'allProjects'
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
    getPhaseTitle (item) {
      return this.phases
        .find(phase =>
          phase.id === item.phaseId
        ).title
    },
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
        field: header.sortCriteria,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    callForChange (newValue) {
      this.needApprovalItems.forEach(item => { item.changed() })
    },
    convertHoursToHoursAndMinutes,
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
