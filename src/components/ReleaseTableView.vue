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
                  :class="{ascending: !releaseSortCriteria.descending}"
                ></simple-svg>
              </div>
              <div
                class="tooltip-container filter-tooltip"
                :class="header.field === 'id' || header.field === 'title' ? 'left' : 'center'"
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
            v-for="release in decoratedReleases"
            :key="release.id"
            @click="activateRelease({release: release})"
            @dblclick="activateProjectView(release)"
          >

            <!-- ID -->

            <td
              class="id cell"
              :title="release.id"
            >
              <p>R{{ release.id }}</p>
            </td>

            <!-- NAME -->

            <td
              class="name cell"
              :title="release.title"
            >
              <p>{{ release.title }}</p>
            </td>

            <!-- TARGET DATE -->

            <td
              class="target-date cell"
              :title="formatDate(release.launchDate)"
            >
              <p>{{ formatDate(release.launchDate) }}</p>
            </td>

            <!-- CUTOFF -->

            <td
              class="cutoff cell"
              :title="formatDate(release.cutoff)"
            >
              <p>{{ formatDate(release.cutoff) }}</p>
            </td>

            <!-- GROUP -->

            <td
              class="group cell"
              :title="release.groupTitle"
            >
              <div class="group-card">
                <p>{{ release.groupTitle }}</p>
              </div>
            </td>

            <!-- PROJECTS -->

            <td
              class="projects cell"
              :title="release.projects.length ? release.projects.map(project => project.title).join(',') : '-'"
            >
              <div
                class="projects-card"
                v-if="!release.projects.length"
              >
                <p>-</p>
              </div>
              <div
                class="projects-card"
                v-for="(project, index) in release.projects"
                :key="index"
                v-else
              >
                <p>{{ project.title }}</p>
              </div>
            </td>

            <!-- MANAGER -->

            <td
              class="manager cell"
              :title="release.managerTitle"
            >
              <p>{{ release.managerTitle }}</p>
            </td>
            <td class="cell empty">
              <p></p>
            </td>
          </tr>
        </tbody>
      </table>
      <infinite-loading
        v-if="showInfiniteLoader && !globalLoading"
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
import { mapMutations, mapState, mapActions } from 'vuex'
import server from '../server'
import moment from 'moment'
import InfiniteLoading from 'vue-infinite-loading'
import { mixin as clickout } from 'vue-clickout'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
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
      isSelected: 'sort',
      showInfiniteLoader: false
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
          label: this.releaseMetadata.fields.id.label,
          isSortingActive: this.sortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null,
          className: 'id'
        },
        {
          label: this.releaseMetadata.fields.title.label,
          isSortingActive: this.sortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null,
          className: 'name'
        },
        {
          label: this.releaseMetadata.fields.launchDate.label,
          isSortingActive: this.sortCriteria.field === 'launchDate',
          isFilteringActive: null,
          field: 'launchDate',
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
          label: this.releaseMetadata.fields.groupId.label,
          isSortingActive: this.sortCriteria.field === 'groupId',
          isFilteringActive: null,
          field: 'groupId',
          filteringItems: null,
          className: 'group-id'
        },
        {
          label: this.releaseMetadata.fields.projects.label,
          isSortingActive: this.sortCriteria.field === 'projectTitle',
          isFilteringActive: null,
          field: 'projectTitle',
          filteringItems: null,
          className: 'projects'
        },
        {
          label: this.releaseMetadata.fields.managerId.label,
          isSortingActive: this.sortCriteria.field === 'managerId',
          isFilteringActive: null,
          field: 'managerId',
          filteringItems: null,
          className: 'manager-id'
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'Member',
      'releases',
      'selectedRelease',
      'selectedProject',
      'releaseSortCriteria',
      'releaseFilters',
      'infiniteLoaderIdentifier',
      'globalLoading'
    ])
  },
  asyncComputed: {
    async decoratedReleases () {
      if (!this.releases) {
        return []
      }
      return Promise.all(this.releases.map(async (item) => {
        let managerTitle = await this.getMemberTitle(item.managerId)
        let groupTitle = await this.getGroupTitle(item.groupId)
        item.managerTitle = managerTitle
        item.groupTitle = groupTitle
        return item
      }))
    }
  },
  watch: {
    'releases': {
      immediate: true,
      async handler (newValue, oldValue) {
        if (!oldValue && newValue.length) {
          await this.activateRelease({ release: newValue[0] })
        }
        this.showInfiniteLoader = true
      }
    }
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
    infiniteHandler ($state) {
      this.listReleases({
        selectedReleaseId: this.selectedRelease ? this.selectedRelease.id : null,
        $state
      })
    },
    ...mapMutations([
      'setReleaseSortCriteria',
      'setReleaseFilters'
    ]),
    ...mapActions([
      'activateRelease',
      'activateProject',
      'getMemberTitle',
      'getGroupTitle',
      'listReleases'
    ])
  },
  components: {
    Filters,
    Sort,
    InfiniteLoading,
    Loading
  }
}
</script>
