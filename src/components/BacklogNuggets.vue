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
              :class="header.className"
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
          <tr
            class="row"
            v-for="nugget of backlogNuggets"
            :key="nugget.id"
          >
            <td class="cell id">
              <p> {{ nugget.id }} </p>
            </td>
            <td class="cell title">
              <p> {{ nugget.title }} </p>
            </td>

            <td class="cell tempo">
              <div class="tempo-card" :class="nugget.boarding">
                <p> {{ nugget.boarding }}</p>
              </div>
            </td>
            <td class="type cell">
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

              <div class="input-container">
                <div class="datepicker-container">
                  <input
                    type="text"
                    class="light-primary-input calendar"
                    @click="toggleTriageDatepicker"
                    ref="triage"
                    readonly
                    disabled
                  >
                  <div
                    v-if="showTriageDatepicker"
                    class="datepicker"
                    v-on-clickout="toggleTriageDatepicker.bind(undefined, false)"
                  >
                    <custom-datepicker
                      primary-color="#2F2445"
                      :wrapperStyles="datepickerOptions.wrapperStyles"
                      @dateSelected="setTriageDate($event)"
                      :limits="datepickerOptions.limits"
                    />
                  </div>
                </div>
                <div>
                </div>
              </div>

            </td>
            <td class="cell priority">
              <p> {{ nugget.priority.capitalize() }} </p>
            </td>
            <td class="cell creator">
              <p>-</p>
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
  name: 'BacklogNuggets',
  data () {
    return {
      selectedAssigned: null,
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
          label: 'ID',
          className: 'id',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'id',
          // isFilteringActive: null,
          field: 'id'
          // filteringItems: null
        },
        {
          label: 'Name',
          className: 'title',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'title',
          // isFilteringActive: null,
          field: 'title'
          // filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'boarding',
          // isFilteringActive: null,
          field: 'boarding'
          // filteringItems: this.itemBoardings
        },
        {
          label: 'Type',
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
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'phase',
          // isFilteringActive: null,
          field: 'batch'
          // filteringItems: null
        },
        {
          label: 'Phase',
          className: 'phase',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'phase',
          // isFilteringActive: null,
          field: 'phase'
          // filteringItems: null
        },
        {
          label: 'Return to Triage',
          className: 'return-to-triage',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'perspective',
          // isFilteringActive: null,
          field: 'returnToTriage'
          // filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'priority',
          // isFilteringActive: null,
          field: 'priority'
          // filteringItems: this.itemPriorities
        },
        {
          label: 'Creator',
          className: 'creator',
          // FIXME: ADD THIS LATER
          // isSortingActive: this.inProgressNuggetsSortCriteria.field === 'priority',
          // isFilteringActive: null,
          field: 'creator'
          // filteringItems: this.itemPriorities
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'infiniteLoaderIdentifier',
      'backlogNuggets'
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
    infiniteHandler ($state) {
      this.updateListGoodNews($state)
    },
    // FIXME: ADD THIS LATER

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
    toggleTriageDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showTriageDatepicker = value
      } else {
        this.showTriageDatepicker = !this.showTriageDatepicker
      }
    },
    setTriageDate (date) {
      this.showTriageDatepicker = false
      this.$ref.triage.focus()
    },
    ...mapMutations([
    ]),
    ...mapActions([
      'updateListGoodNews'

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
