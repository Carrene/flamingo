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
                <p
                  :title="header.label"
                  @click="tooltipHandler(header)"
                >{{ header.label }}</p>

                <simple-svg
                  :filepath="iconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isSortingActive"
                  :class="{ascending: !expiredTriageSortCriteria.descending}"
                ></simple-svg>
              </div>

              <div
                class="tooltip-container filter-tooltip left"
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
                    :mutation="setExpiredTriageFilters"
                    :header="header"
                    :model="expiredTriageFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="expiredTriageSortCriteria"
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
            v-for="nugget in expiredTriageNuggets"
            :key="nugget.id"
            @click="activateNugget({nugget, updateRoute: false})"
            :class="{'selected-item': selectedNuggets.length === 1 && selectedNuggets[0].id === nugget.id}"
          >
            <td class="cell id">
              <p> {{ nugget.id }} </p>
            </td>
            <td class="cell title">
              <p> {{ nugget.title }} </p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="nugget.boarding "
              >
                <p>{{ nugget.boarding.capitalize() }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ nugget.kind.capitalize() }}</p>
            </td>
            <td class="cell batch">
              <div class="input-container">
                <v-select
                  v-model="nugget.batch"
                  :clearable="false"
                  :options="batches"
                  index="value"
                ></v-select>
              </div>
            </td>
            <td class="cell phase">
              <div class="phase-box">
                <p
                  class="backlog-phase"
                  @click.stop="nugget.stage = 'backlog'"
                  :class="nugget.stage === 'backlog' ? 'selected-phase' : null"
                >Backlog</p>
                <p
                  class="triage-phase"
                  @click.stop="nugget.stage = 'triage'"
                  :class="nugget.stage=== 'triage' ? 'selected-phase' : null"
                >Triage</p>
              </div>
            </td>
            <td class="cell return-to-triage">
              <div class="input-container">
                <div class="datepicker-container">
                  <input
                    :value="formatDate(nugget.returntotriagejobs.length ? nugget.returntotriagejobs[ nugget.returntotriagejobs.length - 1 ].at : null)"
                    type="text"
                    class="light-primary-input calendar"
                    @click="toggleTriageDatepicker"
                    ref="triage"
                    readonly
                  >
                  <div
                    v-if="showTriageDatepicker && selectedNuggets.length === 1 && selectedNuggets[0].id === nugget.id"
                    class="datepicker"
                    v-on-clickout="toggleTriageDatepicker.bind(undefined, false)"
                  >
                    <custom-datepicker
                      primary-color="#2F2445"
                      :wrapperStyles="datepickerOptions.wrapperStyles"
                      @dateSelected="setTriageDate($event, nugget)"
                      :limits="datepickerOptions.limits"
                      :date="computeShowingReturnToTriageDate(nugget)"
                    />
                  </div>
                </div>
                <div>
                </div>
              </div>
            </td>
            <td
              class="cell grace-period"
              :class="{'expired': nugget.responseTime < 0}"
            >
              <p>{{ convertHoursToHoursAndMinutes(nugget.responseTime) }}</p>
            </td>
            <td class="cell project">
              <p>{{ nugget.project.title.capitalize() }}</p>
            </td>
            <td class="cell origin">
              <p>{{ nugget.origin.capitalize() }}</p>
            </td>
            <td class="cell priority">
              <p>{{ nugget.priority.capitalize() }}</p>
            </td>
            <td class="cell creator">
              <p>{{ nugget.creator }}</p>
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
import CustomDatepicker from 'vue-custom-datepicker'
import { mixin as clickout } from 'vue-clickout'
import moment from 'moment'
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
      selectedPhase: 'Backlog',
      showingTable: true,
      showTooltip: null,
      isSelected: 'sort',
      iconSrc: require('@/assets/chevron-down.svg'),
      sortIconColor: '#008290',
      showTriageDatepicker: false,
      datepickerOptions: {
        wrapperStyles: {
          width: '100%',
          background: '#194173',
          color: '#ffffff',
          position: 'relative'
        },
        limits: {
          start: moment().format('YYYY-MM-DD'),
          end: null
        }
      }
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.nuggetMetadata.fields.id.label,
          className: 'id',
          isSortingActive: this.expiredTriageSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null,
          sortCriteria: 'id'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.expiredTriageSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null,
          sortCriteria: 'title'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.expiredTriageSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.nuggetBoardings,
          sortCriteria: 'boarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.expiredTriageSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.nuggetKinds,
          sortCriteria: 'kind'

        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.expiredTriageSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null,
          sortCriteria: 'batch'

        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.expiredTriageSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: 'Return to Triage',
          className: 'return-to-triage',
          isSortingActive: this.expiredTriageSortCriteria.field === 'returnToTriage',
          isFilteringActive: null,
          field: 'returnToTriage',
          filteringItems: null,
          sortCriteria: 'returnToTriage'

        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: this.expiredTriageSortCriteria.field === 'responseTime',
          isFilteringActive: null,
          field: 'responseTime',
          filteringItems: null,
          sortCriteria: 'responseTime'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.expiredTriageSortCriteria.field === 'projectTitle',
          isFilteringActive: this.expiredTriageFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: 'Origin',
          className: 'origin',
          isSortingActive: this.expiredTriageSortCriteria.field === 'origin',
          isFilteringActive: null,
          field: 'origin',
          filteringItems: null,
          sortCriteria: 'origin'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.expiredTriageSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: null,
          sortCriteria: 'priority'

        },
        {
          label: this.nuggetMetadata.fields.createdByMemberId.label,
          className: 'creator',
          isSortingActive: this.expiredTriageSortCriteria.field === 'createdByMemberId',
          isFilteringActive: null,
          field: 'createdByMemberId',
          filteringItems: null,
          sortCriteria: 'createdByMemberId'

        }
      ]
    },
    ...mapState([
      'nuggetBoardings',
      'nuggetKinds',
      'nuggetPriorities',
      'expiredTriageSortCriteria',
      'expiredTriageFilters',
      'expiredTriageNuggets',
      'phases',
      'selectedNuggets',
      'infiniteLoaderIdentifier',
      'batches',
      'allProjects'
    ])
  },
  watch: {
    'expiredTriageSortCriteria': {
      deep: true,
      handler () {
        this.listBadNews()
      }
    },
    'expiredTriageFilters': {
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
      this.setExpiredTriageSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    toggleTriageDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showTriageDatepicker = value
      } else {
        this.showTriageDatepicker = !this.showTriageDatepicker
      }
    },
    setTriageDate (date, nugget) {
      nugget.returntotriagejobs = nugget.returntotriagejobs.concat({
        at: date,
        issueId: nugget.id,
        type: 'return_to_triage_job',
        status: 'new',
        id: Math.max(...nugget.returntotriagejobs.map(item => item.id)) + 1 || 1
      })
      this.showTriageDatepicker = false
    },
    computeShowingReturnToTriageDate (nugget) {
      return nugget.returntotriagejobs.length ? nugget.returntotriagejobs[nugget.returntotriagejobs.length - 1].at : null
    },
    convertHoursToHoursAndMinutes,
    ...mapMutations([
      'setExpiredTriageFilters',
      'setExpiredTriageSortCriteria'
    ]),
    ...mapActions([
      'listBadNews',
      'activateNugget',
      'updateBadNewsList'
    ]),
    formatDate
  },
  components: {
    InfiniteLoading,
    Loading,
    Sort,
    Filters,
    CustomDatepicker
  }
}
</script>
