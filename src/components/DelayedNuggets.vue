<template>
  <div id="delayedNuggets">

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
                  :class="{ascending: !delayedNuggetsSortCriteria.descending}"
                ></simple-svg>
              </div>

              <div
                class="tooltip-container filter-tooltip left"
                :class="(header.filteringItems) ? 'double-tooltip':'single-tooltip'"
                v-if="showTooltip === header.label"
                v-on-clickout.capture="hideTooltip"
              >
                <div class="tooltip-header"
                :class="(header.filteringItems) ? 'double-tooltip':'single-tooltip'">
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
                    :mutation="setDelayedNuggetsFilters"
                    :header="header"
                    :model="delayedNuggetsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="delayedNuggetsSortCriteria"
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
            v-for="item in delayedNuggets"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p> {{ item.issue.id }} </p>
            </td>

            <td class="cell title">
              <p> {{ item.issue.title }} </p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="item.issue.boarding "
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

            <td class="cell mojo">
              <mojo
                :progress="item.mojoProgress"
                :hours="item.mojoRemainingHours"
                :boarding="item.mojoBoarding"
              ></mojo>
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
import server from './../server'
import { mapState, mapMutations, mapActions } from 'vuex'
import { convertHoursToHoursAndMinutes } from './../helpers.js'
import InfiniteLoading from 'vue-infinite-loading'
import Mojo from './Mojo'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
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
  name: 'DelayedNuggets',
  data () {
    return {
      isSelected: 'sort',
      showTooltip: null,
      nuggetMetadata: server.metadata.models.Issue,
      iconSrc: require('@/assets/chevron-down.svg'),
      sortIconColor: '#008290',
      allowedBoardings: ['at-risk', 'frozen', 'delayed']
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.nuggetMetadata.fields.id.label,
          className: 'id',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null,
          sortCriteria: 'issueId'
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null,
          sortCriteria: 'issueTitle'
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.allowedBoardings,
          sortCriteria: 'issueBoarding'
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'
        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null,
          sortCriteria: 'batch'
        },
        {
          label: 'Mojo',
          className: 'mojo',
          field: 'mojo',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'mojo',
          isFilteringActive: null,
          filteringItems: null,
          sortCriteria: 'mojo'
        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'responseTime',
          isFilteringActive: null,
          field: 'responseTime',
          filteringItems: null,
          sortCriteria: 'responseTime'
        },
        {
          label: 'Extend',
          className: 'extend',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'extend',
          isFilteringActive: null,
          field: 'extend',
          filteringItems: null,
          sortCriteria: 'extend'
        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'projectId',
          isFilteringActive: null,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'phaseId',
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
      'allProjects',
      'extendingCandidateItemIds',
      'delayedNuggets',
      'delayedNuggetsSortCriteria',
      'delayedNuggetsFilters',
      'batches',
      'itemBoardings',
      'itemKinds',
      'itemPriorities',
      'phases',
      'selectedItem',
      'infiniteLoaderIdentifier'
    ])
  },
  watch: {
    'delayedNuggetsSortCriteria': {
      deep: true,
      handler () {
        this.listBadNews()
      }
    },
    'delayedNuggetsFilters': {
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
      this.setDelayedNuggetsSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    callForChange (newValue) {
      this.delayedNuggets.forEach(item => { item.changed() })
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
      'setDelayedNuggetsFilters',
      'setDelayedNuggetsSortCriteria',
      'setExtendingCandidateItemIds'
    ]),
    ...mapActions([
      'listBadNews',
      'selectItem',
      'updateBadNewsList'
    ])
  },
  components: {
    Loading,
    InfiniteLoading,
    Sort,
    Filters,
    Mojo,
    LoadingCheckbox
  }
}

</script>
