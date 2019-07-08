<template>
  <div id="triageNuggets">

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
                  :class="{ascending: !triageNuggetsSortCriteria.descending}"
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
                    :mutation="setTriageNuggetsFilters"
                    :header="header"
                    :model="triageNuggetsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="triageNuggetsSortCriteria"
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
            v-for="nugget of triageNuggets"
            :key="nugget.id"
            @click="activateNugget({nugget, updateRoute: false})"
            :class="{'selected-item': selectedNuggets.length === 1 && selectedNuggets[0].id === nugget.id}"
          >
            <td class="cell id">
              <p>N{{ nugget.id }} </p>
            </td>
            <td class="cell title">
              <p>{{ nugget.title }}</p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="nugget.boarding "
              >
                <p>{{ nugget.boarding.capitalize() }}</p>
              </div>
            </td>
            <td class="cell type">
              <p>{{ nugget.kind.capitalize() }}</p>
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
                    />
                  </div>
                </div>
                <div>
                </div>
              </div>
            </td>
            <td class="cell origin">
              <p>{{ nugget.origin.capitalize() }}</p>
            </td>
            <td class="cell project">
              <p>{{ nugget.project.title.capitalize() }}</p>
            </td>
            <td class="cell priority">
              <p>{{ nugget.priority.capitalize() }}</p>
            </td>
            <td class="cell creator">
              <p>{{ nugget.creator }}</p>
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
import { formatDate } from './../helpers.js'
import InfiniteLoading from 'vue-infinite-loading'
import { mixin as clickout } from 'vue-clickout'
import moment from 'moment'
import CustomDatepicker from 'vue-custom-datepicker'
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
  name: 'TriageNuggets',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      selectedAssigned: null,
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
          isSortingActive: this.triageNuggetsSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds
        },
        {
          // FIXME: Change label when backend is ready
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseTitle',
          filteringItems: null
        },
        {
          label: 'Return to Triage',
          className: 'return-to-triage',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'returnToTriage',
          isFilteringActive: null,
          field: 'returnToTriage',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.origin.label,
          className: 'origin',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'origin',
          isFilteringActive: null,
          field: 'origin',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'projectTitle',
          isFilteringActive: null,
          field: 'projectTitle',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities
        },
        {
          label: this.nuggetMetadata.fields.createdByMemberId.label,
          className: 'creator',
          isSortingActive: this.triageNuggetsSortCriteria.field === 'createdByMemberId',
          isFilteringActive: null,
          field: 'createdByMemberId',
          filteringItems: null
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'itemPriorities',
      'triageNuggets',
      'selectedNuggets',
      'infiniteLoaderIdentifier',
      'triageNuggetsFilters',
      'triageNuggetsSortCriteria'

    ])
  },
  watch: {
    'triageNuggetsSortCriteria': {
      deep: true,
      handler () {
        this.listGoodNews()
      }
    },
    'triageNuggetsFilters': {
      deep: true,
      handler () {
        this.listGoodNews()
      }
    }
  },
  methods: {
    infiniteHandler ($state) {
      this.updateListGoodNews($state)
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setTriageNuggetsSortCriteria({
        field: header.field,
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
      // this.$ref.triage.focus()
    },
    ...mapMutations([
      'setTriageNuggetsFilters',
      'setTriageNuggetsSortCriteria'
    ]),
    ...mapActions([
      'updateListGoodNews',
      'listGoodNews',
      'activateNugget'
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
