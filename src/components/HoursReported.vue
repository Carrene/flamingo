<template>
  <div id="hoursReported">
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
                  :class="{ascending: !hoursReportedItemsSortCriteria.descending}"
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
                <div class="tooltip-header"
                :class="header.filteringItems ? 'double-tooltip' : 'single-tooltip'">
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
                    :mutation="setHoursReportedItemsFilters"
                    :header="header"
                    :model="hoursReportedItemsFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="hoursReportedItemsSortCriteria"
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
            v-for="item of hoursReportedItems"
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
            <td class="cell mojo">
              <mojo
                :progress="item.mojoProgress"
                :hours="item.mojoRemainingHours"
                :boarding="item.mojoBoarding"
              ></mojo>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title.capitalize() }}</p>
            </td>
            <td class="cell resource">
              <p>{{ item.resource }}</p>
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
import InfiniteLoading from 'vue-infinite-loading'
import { mixin as clickout } from 'vue-clickout'
import Mojo from './Mojo'
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
  name: 'HoursReported',
  mixins: [clickout],
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
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
          field: 'issueId',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'issueId',
          isFilteringActive: null,
          filteringItems: null,
          sortCriteria: 'issueId'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          field: 'issueTitle',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          filteringItems: null,
          sortCriteria: 'issueTitle'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          field: 'issueBoarding',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          filteringItems: this.itemBoardings,
          sortCriteria: 'issueBoarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          field: 'issueKind',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'

        },
        {
          label: 'Mojo',
          className: 'mojo',
          field: 'mojo',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'mojo',
          isFilteringActive: null,
          filteringItems: null,
          sortCriteria: 'mojo'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          field: 'projectId',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'projectTitle',
          isFilteringActive: this.hoursReportedItemsFilters.projectId.length,
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: 'Resource',
          className: 'lead-resource',
          field: 'leadResource',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'leadResource',
          isFilteringActive: null,
          filteringItems: null,
          sortCriteria: 'leadResource'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          field: 'issuePriority',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'issuePriority',
          isFilteringActive: null,
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
      'itemBoardings',
      'itemPriorities',
      'itemKinds',
      'hoursReportedItems',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'hoursReportedItemsSortCriteria',
      'hoursReportedItemsFilters',
      'allProjects'
    ])
  },
  watch: {
    'hoursReportedItemsSortCriteria': {
      deep: true,
      handler () {
        this.listGoodNews()
      }
    },
    'hoursReportedItemsFilters': {
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
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setHoursReportedItemsSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    ...mapMutations([
      'setHoursReportedItemsSortCriteria',
      'setHoursReportedItemsFilters'
    ]),
    ...mapActions([
      'updateListGoodNews',
      'selectItem',
      'listGoodNews'
    ])
  },
  components: {
    InfiniteLoading,
    Loading,
    Sort,
    Filters,
    Mojo
  }
}
</script>
