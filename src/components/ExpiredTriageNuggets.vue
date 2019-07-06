<template>
  <div id="expiredTriageNuggets">

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
                <p :title="header.label">{{ header.label }}</p>
                <!-- FIXME: ADD THIS LATER -->
                <!-- <simple-svg
                  :filepath="iconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isSortingActive"
                  :class="{ascending: !inProgressNuggetsSortCriteria.descending}"
                ></simple-svg> -->
              </div>
              <!-- FIXME: ADD THIS LATER -->
              <!-- <div
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
                    :mutation="setInProgressNuggetsFilters"
                    :header="header"
                    :model="inProgressNuggetsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="inProgressNuggetsSortCriteria"
                    :sort-action="sort"
                    :header="header"
                  />
                </div>
              </div> -->
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr class="row">
            <td class="cell id">
              <p> - </p>
            </td>
            <td class="cell title">
              <p>-</p>
            </td>

            <td class="cell tempo">
              <div class="tempo-card">
                <p>-</p>
              </div>
            </td>
            <td class="type cell">
              <p>-</p>
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
            <td class="cell phase">
              <div class="phase-box">
                <p
                  class="backlog-phase"
                  :class="selectedPhase === 'Backlog' ? 'selected-phase' : null"
                  @click="selectedPhase = 'Backlog'"
                >Backlog</p>
                <p
                  class="triage-phase"
                  :class="selectedPhase === 'Triage' ? 'selected-phase' : null"
                  @click="selectedPhase = 'Triage'"
                >Triage</p>
              </div>
            </td>
            <td class="cell return-to-triage">
              <p>-</p>
            </td>
            <td class="cell grace-period">
              <p>-</p>
            </td>
            <td class="cell project">
              <p>-</p>
            </td>
            <td class="cell origin">
              <p>-</p>
            </td>
            <td class="cell priority">
              <p>-</p>
            </td>
            <td class="cell creator">
              <p>-</p>
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
  name: 'ExpiredTriageNuggets',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
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
          label: this.nuggetMetadata.fields.id.label,
          className: 'id',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'id',
          // isFilteringActive: null,
          field: 'id'
          // filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'title',
          // isFilteringActive: null,
          field: 'title'
          // filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'boarding',
          // isFilteringActive: null,
          field: 'boarding'
          // filteringItems: this.itemBoardings
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'kind',
          // isFilteringActive: null,
          field: 'kind'
          // filteringItems: this.itemKinds
        },
        {
          label: 'Batch',
          className: 'batch',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'batch',
          // isFilteringActive: null,
          field: 'batch'
          // filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'phaseTitle',
          // isFilteringActive: null,
          field: 'phaseTitle'
          // filteringItems: null
        },
        {
          label: 'Return to Triage',
          className: 'return-to-triage',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'returnToTriage',
          // isFilteringActive: null,
          field: 'returnToTriage'
          // filteringItems: this.itemPriorities
        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'gracePeriod',
          // isFilteringActive: null,
          field: 'gracePeriod'
          // filteringItems: this.itemPriorities
        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'projectTitle',
          // isFilteringActive: null,
          field: 'projectTitle'
          // filteringItems: this.itemPriorities
        },
        {
          label: 'Origin',
          className: 'origin',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'origin',
          // isFilteringActive: null,
          field: 'origin'
          // filteringItems: this.itemPriorities
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'priority',
          // isFilteringActive: null,
          field: 'priority'
          // filteringItems: this.itemPriorities
        },
        {
          label: this.nuggetMetadata.fields.createdByMemberId.label,
          className: 'creator',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'createdByMemberId',
          // isFilteringActive: null,
          field: 'createdByMemberId'
          // filteringItems: this.itemPriorities
        }
      ]
    },
    ...mapState([
    ])
  },
  watch: {
    // FIXME: ADD THIS LATER
    // 'inProgressNuggetsSortCriteria': {
    //   deep: true,
    //   handler () {
    //     this.listItems()
    //   }
    // },
    // 'inProgressNuggetsFilters': {
    //   deep: true,
    //   handler () {
    //     this.listItems()
    //   }
    // }
  },
  methods: {
    // FIXME: ADD THIS LATER
    // infiniteHandler ($state) {
    //   this.updateListItem($state)
    // },
    // hideTooltip () {
    //   this.showTooltip = null
    // },
    // sort (header, descending = false) {
    //   this.setInProgressNuggetsSortCriteria({
    //     field: header.field,
    //     descending: descending
    //   })
    // },
    // tooltipHandler (header) {
    //   this.showTooltip = header.label
    //   this.isSelected = 'sort'
    // },
    ...mapMutations([
    ]),
    ...mapActions([
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
