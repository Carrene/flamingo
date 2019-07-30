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
                  v-model="item.issue.batchTitle"
                  @input="callForChange"
                  :clearable="false"
                  :options="batches"
                  index="value"
                ></v-select>
              </div>
            </td>
            <td
              class="cell grace-period"
              :class="{'expired': item.gracePeriod < 0}"
            >
              <p>{{ convertHoursToHoursAndMinutes(item.gracePeriod) }}</p>
            </td>
            <td class="cell extend">
              <loading-checkbox
                class="check-box"
                :size="16"
                :checked="extendingCandidateItemIds.has(item.id)"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
                @click.native="toggleExtendCandidate(item.id)"
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
  name: 'MissingEstimateItems',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      selectedPhase: 'Backlog',
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
          isSortingActive: this.missingEstimateSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null,
          sortCriteria: 'issueId'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.missingEstimateSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null,
          sortCriteria: 'issueTitle'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.missingEstimateSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.itemBoardings,
          sortCriteria: 'issueBoarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.missingEstimateSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'

        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.missingEstimateSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null,
          sortCriteria: 'batch'

        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: this.missingEstimateSortCriteria.field === 'gracePeriod',
          isFilteringActive: null,
          field: 'gracePeriod',
          filteringItems: null,
          sortCriteria: 'gracePeriod'

        },
        {
          label: 'Extend',
          className: 'extend',
          isSortingActive: this.missingEstimateSortCriteria.field === 'extend',
          isFilteringActive: null,
          field: 'extend',
          filteringItems: null,
          sortCriteria: 'extend'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.missingEstimateSortCriteria.field === 'projectTitle',
          isFilteringActive: this.missingEstimateFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.missingEstimateSortCriteria.field === 'issuePriority',
          isFilteringActive: null,
          field: 'issuePriority',
          filteringItems: this.itemPriorities,
          sortCriteria: 'issuePriority'

        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.missingEstimateSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'itemBoardings',
      'batches',
      'itemKinds',
      'itemPriorities',
      'missingEstimateSortCriteria',
      'missingEstimateFilters',
      'missingEstimateItems',
      'phases',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'extendingCandidateItemIds',
      'allProjects'
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
        field: header.sortCriteria,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    callForChange (newValue) {
      this.missingEstimateItems.forEach(item => { item.changed() })
    },
    toggleExtendCandidate (itemId) {
      let clonedCandidateItems = new Set(this.extendingCandidateItemIds)
      if (clonedCandidateItems.has(itemId)) {
        clonedCandidateItems.delete(itemId)
      } else {
        clonedCandidateItems.add(itemId)
      }
      this.setExtendingCandidateItemIds(clonedCandidateItems)
    },
    convertHoursToHoursAndMinutes,
    ...mapMutations([
      'setMissingEstimateSortCriteria',
      'setMissingEstimateFilters',
      'setExtendingCandidateItemIds'
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
