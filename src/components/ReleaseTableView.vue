<template>
  <div id="releaseTableView">

    <!-- RELEASES LIST -->

    <div class="entities">

      <table class="table">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="[{active: header.isSortingActive || header.isSortingActive}, header.className]"
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
                  :class="{ascending: !releaseSortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip center"
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
                    :mutation="setReleaseFilters"
                    :header="header"
                    :model="releaseFilters"
                  />
                  <sort
                    class="sort-content"
                    v-if="isSelected === 'sort'"
                    :sortCriteria="sortCriteria"
                    :sortAction="sortAction"
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
            :class="{selected: selectedRelease && (release.id === selectedRelease.id)}"
            v-for="release in releases"
            :key="release.id"
            @click="activateRelease({release: release})"
            @dblclick="activateProjectView(release)"
          >
            <td
              class="name cell"
              :title="release.title"
            >
              <p>{{ release.title }}</p>
            </td>
            <td
              class="target-date cell"
              :title="formatDate(release.dueDate)"
            >
              <p>{{ formatDate(release.dueDate) }}</p>
            </td>
            <td
              class="cutoff cell"
              :title="formatDate(release.cutoff)"
            >
              <p>{{ formatDate(release.cutoff) }}</p>
            </td>
            <td
              class="created-at cell"
              :title="formatDate(release.createdAt)"
            >
              <p>{{ formatDate(release.createdAt) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import server from '../server'
import moment from 'moment'
import { mixin as clickout } from 'vue-clickout'
const Filters = () => import(
  /* webpackChunkName: "Filters" */ './Filters'
)
const Sort = () => import(
  /* webpackChunkName: "Sort" */ './Sort'
)

export default {
  mixins: [clickout],
  name: 'ReleaseTableView',
  data () {
    return {
      releaseMetadata: server.metadata.models.Release,
      sortIconColor: '#008290',
      iconSrc: require('@/assets/chevron-down.svg'),
      showTooltip: null,
      isSelected: 'sort'
    }
  },
  props: {
    projects: Array,
    selectAction: Function,
    sortAction: Function,
    sortCriteria: Object
  },
  computed: {
    headers () {
      return [
        {
          label: this.releaseMetadata.fields.title.label,
          isSortingActive: this.sortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null,
          className: 'name'
        },
        {
          label: this.releaseMetadata.fields.dueDate.label,
          isSortingActive: this.sortCriteria.field === 'dueDate',
          isFilteringActive: null,
          field: 'dueDate',
          filteringItems: null,
          className: 'target-date'
        },
        {
          label: this.releaseMetadata.fields.cutoff.label,
          isSortingActive: this.sortCriteria.field === 'cutoff',
          isFilteringActive: null,
          field: 'cutoff',
          filteringItems: null,
          className: 'cutoff'
        },
        {
          label: this.releaseMetadata.fields.createdAt.label,
          isSortingActive: this.sortCriteria.field === 'createdAt',
          isFilteringActive: null,
          field: 'createdAt',
          filteringItems: null,
          className: 'created-at'
        }
      ]
    },
    ...mapState([
      'releases',
      'selectedRelease',
      'selectedProject',
      'releaseSortCriteria',
      'releaseFilters'
    ])
  },
  methods: {
    activateProjectView (release) {
      this.activateRelease({ release: release, updateRoute: false })
      this.activateProject({ project: this.selectedProject })
    },
    formatDate (isoString) {
      if (isoString) {
        return moment(isoString).format('DD/MM/YYYY')
      } else {
        return '-'
      }
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    hideTooltip () {
      this.showTooltip = null
    },
    ...mapMutations([
      'setReleaseSortCriteria',
      'setReleaseFilters'
    ]),
    ...mapActions([
      'activateRelease',
      'activateProject'
    ])
  },
  components: {
    Filters,
    Sort
  }
}
</script>
