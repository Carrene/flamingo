<template>
  <div id="backlogNuggets">

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
                  :class="{ascending: !backlogNuggetsSortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip"
                :class="[
                  header.label === 'ID' ? 'left' : 'center',
                  header.filteringItems ? 'double-tooltip' : 'single-tooltip'
                ]"
                v-if="showTooltip === header.label"
                v-on-clickout.capture="hideTooltip"
              >
                <div
                  class="tooltip-header"
                  :class="header.filteringItems ? 'double-tooltip' : 'single-tooltip'"
                >
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
                    :mutation="setBacklogNuggetsFilters"
                    :header="header"
                    :model="backlogNuggetsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="backlogNuggetsSortCriteria"
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
            v-for="nugget of backlogNuggets"
            :key="nugget.id"
            @click="activateNugget({nugget, updateRoute: false})"
            :class="{'selected-item': selectedNuggets.length === 1 && selectedNuggets[0].id === nugget.id}"
          >
            <td
              class="cell id"
              :title="`N${nugget.id}`"
            >
              <p>N{{ nugget.id }}</p>
            </td>
            <td
              class="cell title"
              :title="nugget.title"
            >
              <p> {{ nugget.title }} </p>
            </td>

            <td
              class="cell tempo"
              :title="nugget.boarding.capitalize()"
            >
              <div
                class="tempo-card"
                :class="nugget.boarding"
              >
                <p> {{ nugget.boarding.capitalize() }}</p>
              </div>
            </td>
            <td
              class="type cell"
              :title="nugget.kind.capitalize()"
            >
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
            <td class="cell move-to">
              <loading-checkbox
                @click.native="nugget.stage === 'backlog' ? nugget.stage = 'triage' : nugget.stage = 'backlog'"
                :checked="nugget.stage === 'triage'"
                class="check-box"
                :size="16"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
              ></loading-checkbox>
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
              class="cell project"
              :title="nugget.project.title.capitalize()"
            >
              <p> {{ nugget.project.title.capitalize() }} </p>
            </td>
            <td
              class="cell priority"
              :title="nugget.priority.capitalize()"
            >
              <p> {{ nugget.priority.capitalize() }} </p>
            </td>
            <td
              class="cell creator"
              :title="nugget.creator"
            >
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
import server from './../server.js'
import { mapState, mapActions, mapMutations } from 'vuex'
import { formatDate } from './../helpers.js'
import InfiniteLoading from 'vue-infinite-loading'
import { mixin as clickout } from 'vue-clickout'
import moment from 'moment'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
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
  name: 'BacklogNuggets',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
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
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null,
          sortCriteria: 'id'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null,
          sortCriteria: 'title'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'boarding',
          isFilteringActive: null,
          field: 'boarding',
          filteringItems: this.itemBoardings,
          sortCriteria: 'boarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'kind',
          isFilteringActive: null,
          field: 'kind',
          filteringItems: this.itemKinds,
          sortCriteria: 'kind'

        },
        {
          // FIXME: Change label when backend is ready
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null,
          sortCriteria: 'batch'

        },
        {
          label: 'Move To Triage',
          className: 'move-to',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: 'Return to Triage',
          className: 'return-to-triage',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'returnToTriage',
          isFilteringActive: null,
          field: 'returnToTriage',
          filteringItems: null,
          sortCriteria: 'returnToTriage'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'projectTitle',
          isFilteringActive: this.backlogNuggetsFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'priority',
          isFilteringActive: null,
          field: 'priority',
          filteringItems: this.itemPriorities,
          sortCriteria: 'priority'

        },
        {
          label: this.nuggetMetadata.fields.createdByMemberId.label,
          className: 'creator',
          isSortingActive: this.backlogNuggetsSortCriteria.field === 'creator',
          isFilteringActive: null,
          field: 'creator',
          filteringItems: null,
          sortCriteria: 'creator'

        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'batches',
      'infiniteLoaderIdentifier',
      'selectedNuggets',
      'backlogNuggets',
      'backlogNuggetsFilters',
      'backlogNuggetsSortCriteria',
      'allProjects'
    ])
  },
  watch: {
    'backlogNuggetsSortCriteria': {
      deep: true,
      handler () {
        this.listGoodNews()
      }
    },
    'backlogNuggetsFilters': {
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
      this.setBacklogNuggetsSortCriteria({
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
    ...mapMutations([
      'setBacklogNuggetsFilters',
      'setBacklogNuggetsSortCriteria'
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
    CustomDatepicker,
    LoadingCheckbox
  }
}
</script>
