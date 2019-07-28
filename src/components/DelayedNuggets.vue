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
                    :mutation="setDelayedNuggetsFilters"
                    :header="header"
                    :model="expiredTriageFilters"
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
      </table>
      <!-- <table class="table">
        <tbody class="content">
          <tr
            class="row"
            v-for="item in missingHoursItems"
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
      </infinite-loading> -->
    </div>

  </div>
</template>

<script>
import server from './../server'
import { mapState, mapMutations } from 'vuex'
// import { formatDate } from './../helpers.js'
// import InfiniteLoading from 'vue-infinite-loading'
import { mixin as clickout } from 'vue-clickout'
// const Loading = () => import(
//   /* webpackChunkName: "Loading" */ './Loading'
// )
// const Sort = () => import(
//   /* webpackChunkName: "Sort" */ './Sort'
// )
// const Filters = () => import(
//   /* webpackChunkName: "Filters" */ './Filters'
// )

export default {
  mixins: [clickout],
  name: 'DelayedNuggets',
  data () {
    return {
      showTooltip: null,
      nuggetMetadata: server.metadata.models.Issue
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
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          className: 'title',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.itemBoardings
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds
        },
        {
          label: 'Batch',
          className: 'batch',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'batch',
          isFilteringActive: null,
          field: 'batch',
          filteringItems: null
        },
        {
          label: 'Mojo',
          className: 'mojo',
          field: 'mojo',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'mojo',
          isFilteringActive: null,
          filteringItems: null
        },
        {
          label: 'Grace Period',
          className: 'grace-period',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'responseTime',
          isFilteringActive: null,
          field: 'responseTime',
          filteringItems: null
        },
        {
          label: 'Extend',
          className: 'extend',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'extend',
          isFilteringActive: null,
          field: 'extend',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'projectTitle',
          isFilteringActive: null,
          field: 'projectTitle',
          filteringItems: null
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.delayedNuggetsSortCriteria.field === 'phaseId',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'delayedNuggetsSortCriteria',
      'batches',
      'itemBoardings',
      'itemKinds',
      'itemPriorities',
      'missingHoursSortCriteria',
      'missingHoursFilters',
      'missingHoursItems',
      'phases',
      'selectedItem',
      'infiniteLoaderIdentifier'
    ])
  },
  // watch: {
  //   'missingHoursSortCriteria': {
  //     deep: true,
  //     handler () {
  //       this.listBadNews()
  //     }
  //   },
  //   'missingHoursFilters': {
  //     deep: true,
  //     handler () {
  //       this.listBadNews()
  //     }
  //   }
  // },
  methods: {
    //   infiniteHandler ($state) {
    //     this.updateBadNewsList($state)
    //   },
    hideTooltip () {
      this.showTooltip = null
    },
    //   sort (header, descending = false) {
    //     this.setMissingHoursSortCriteria({
    //       field: header.field,
    //       descending: descending
    //     })
    //   },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    //   callForChange (newValue) {
    //     this.missingHoursItems.forEach(item => { item.changed() })
    //   },
    ...mapMutations([
      'setDelayedNuggetsFilters'
    ])
    //   ...mapActions([
    //     'listBadNews',
    //     'selectItem',
    //     'updateBadNewsList'
    //   ]),
    //   formatDate
    // },
    // components: {
    //   InfiniteLoading,
    //   Loading,
    //   Sort,
    //   Filters
  }
}
</script>
