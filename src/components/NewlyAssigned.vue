<template>
  <div id="newlyAssigned">

    <!-- TABLE -->

    <div class="table-box">

      <table
        class="table newly-assigned"
        v-if="showingTable"
      >
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
                  :class="{ascending: !newlyAssignedSortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip"
                :class="[
                  header.field === 'issueId' || header.field === 'title' ? 'left' : 'center',
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
                    :mutation="setNewlyAssignedFilters"
                    :header="header"
                    :model="newlyAssignedFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sort-criteria="newlyAssignedSortCriteria"
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
            v-for="item of newlyAssignedItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td
              class="cell id"
              :title="`N${item.issue.id}`"
            >
              <p>N{{ item.issue.id }}</p>
            </td>
            <td
              class="cell name"
              :title="item.issue.title"
            >
              <p>{{ item.issue.title }}</p>
            </td>

            <td
              class="cell tempo"
              :title="item.issue.boarding.capitalize()"
            >
              <div
                class="tempo-card"
                :class="item.issue.boarding"
              >
                <p>{{ item.issue.boarding.capitalize() }}</p>
              </div>
            </td>
            <td
              class="type cell"
              :title="item.issue.kind.capitalize()"
            >
              <p>{{ item.issue.kind.capitalize() }}</p>
            </td>
            <td
              class="cell phase"
              :title="phases.find(phase => item.phaseId === phase.id).title"
            >
              <p>{{ phases.find(phase => item.phaseId === phase.id).title }}</p>
            </td>
            <td
              class="cell project"
              :title="item.issue.project.title"
            >
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td
              class="cell priority"
              :title="item.issue.priority.capitalize()"
            >
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
import InfiniteLoading from 'vue-infinite-loading'
import { mapState, mapActions, mapMutations } from 'vuex'
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
  name: 'NewlyAssigned',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      selectedAssigned: null,
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
          isSortingActive: this.newlyAssignedSortCriteria.field === 'issueId',
          isFilteringActive: null,
          field: 'issueId',
          filteringItems: null,
          sortCriteria: 'issueId'

        },
        {
          label: this.nuggetMetadata.fields.title.label,
          isSortingActive: this.newlyAssignedSortCriteria.field === 'issueTitle',
          isFilteringActive: null,
          field: 'issueTitle',
          filteringItems: null,
          className: 'name',
          sortCriteria: 'issueTitle'

        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          className: 'tempo',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'issueBoarding',
          isFilteringActive: null,
          field: 'issueBoarding',
          filteringItems: this.itemBoardings,
          sortCriteria: 'issueBoarding'

        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          className: 'type',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'issueKind',
          isFilteringActive: null,
          field: 'issueKind',
          filteringItems: this.itemKinds,
          sortCriteria: 'issueKind'

        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          className: 'phase',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'phaseTitle',
          isFilteringActive: null,
          field: 'phaseId',
          filteringItems: null,
          sortCriteria: 'phaseTitle'

        },
        {
          label: this.nuggetMetadata.fields.project.label,
          className: 'project',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'projectTitle',
          isFilteringActive: this.newlyAssignedFilters.projectId.length,
          field: 'projectId',
          filteringItems: this.allProjects,
          sortCriteria: 'projectTitle'

        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          className: 'priority',
          isSortingActive: this.newlyAssignedSortCriteria.field === 'issuePriority',
          isFilteringActive: null,
          field: 'issuePriority',
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
      'newlyAssignedItems',
      'selectedItem',
      'infiniteLoaderIdentifier',
      'phases',
      'newlyAssignedSortCriteria',
      'newlyAssignedFilters',
      'itemBoardings',
      'itemKinds',
      'itemPriorities',
      'allProjects'
    ])
  },
  watch: {
    'newlyAssignedSortCriteria': {
      deep: true,
      handler () {
        this.listItems()
      }
    },
    'newlyAssignedFilters': {
      deep: true,
      handler () {
        this.listItems()
      }
    }
  },
  methods: {
    infiniteHandler ($state) {
      this.updateListItem($state)
    },
    hideTooltip () {
      this.showTooltip = null
    },
    sort (header, descending = false) {
      this.setNewlyAssignedSortCriteria({
        field: header.sortCriteria,
        descending: descending
      })
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    ...mapMutations([
      'setNewlyAssignedSortCriteria',
      'setNewlyAssignedFilters'
    ]),
    ...mapActions([
      'listItems',
      'updateListItem',
      'selectItem'
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
