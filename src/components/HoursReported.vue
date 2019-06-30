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
              @click=tooltipHandler(header)
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
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
                  <!-- <filters
                    class="filter-content"
                    v-if="isSelected === 'filter'"
                    :mutation="setNeedApprovalItemsFilters"
                    :header="header"
                    :model="needApprovalItemsFilters"
                  /> -->
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
              <p>-</p>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title.capitalize() }}</p>
            </td>
            <td class="cell lead-resource">
              <p>-</p>
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
import { mapState, mapActions, mapMutations } from 'vuex'
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
  name: 'HoursReported',
  mixins: [clickout],
  data () {
    return {
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
          field: 'id',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'id',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Name',
          className: 'title',
          field: 'title',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'title',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Tempo',
          className: 'tempo',
          field: 'boarding',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'boarding',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Type',
          className: 'type',
          field: 'kind',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'kind',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Mojo',
          className: 'mojo',
          field: 'mojo',
          isSortingActive: null,
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Project',
          className: 'project',
          field: 'project',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'project',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Lead Resource',
          className: 'lead-resource',
          field: 'leadResource',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'leadResource',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Priority',
          className: 'priority',
          field: 'priority',
          isSortingActive: this.hoursReportedItemsSortCriteria.field === 'priority',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'hoursReportedItems',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'hoursReportedItemsSortCriteria'
    ])
  },
  watch: {
    'hoursReportedItemsSortCriteria': {
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
        field: header.field,
        descending: descending
      })
    },
    ...mapMutations([
      'setHoursReportedItemsSortCriteria'
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
    Filters
  }
}
</script>
