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
            v-for="release in decoratedReleases"
            :key="release.id"
            @click="activateRelease({release: release})"
            @dblclick="activateProjectView(release)"
          >

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
              <p>{{ release.groupTitle }}</p>
            </td>

            <!-- MANAGER -->

            <td
              class="manager cell"
              :title="release.managerTitle"
            >
              <p>{{ release.managerTitle }}</p>
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
          className: 'groupId'
        },
        {
          label: this.releaseMetadata.fields.managerId.label,
          isSortingActive: this.sortCriteria.field === 'managerId',
          isFilteringActive: null,
          field: 'managerId',
          filteringItems: null,
          className: 'managerId'
        }
      ]
    },
    ...mapState([
      'Member',
      'releases',
      'selectedRelease',
      'selectedProject',
      'releaseSortCriteria',
      'releaseFilters'
    ])
  },
  asyncComputed: {
    async decoratedReleases () {
      if (!this.releases) {
        return []
      }
      return Promise.all(this.releases.map(async (item) => {
        let managerTitle = await this.getManagerTitle(item.managerId)
        let groupTitle = await this.getGroupTitle(item.groupId)
        item.managerTitle = managerTitle
        item.groupTitle = groupTitle
        return item
      }))
    }
  },
  // async decoratedProjects () {
  //   if (!this.projects) {
  //     return []
  //   }
  //   return Promise.all(this.projects.map(async (item) => {
  //     let project = new this.Project(item)
  //     let managerTitle = 'None!'
  //     let releaseTitle = '-'
  //     if (item.managerId) {
  //       managerTitle = await this.getManagerTitle(project.managerId)
  //     }
  //     if (project.releaseId) {
  //       releaseTitle = await this.getReleaseTitle(project.releaseId)
  //     }
  //     let groupTitle = await this.getGroupTitle(project.groupId)
  //     let workflowTitle = await this.getWorkflowTitle(project.workflowId)
  //     project.managerTitle = managerTitle
  //     project.releaseTitle = releaseTitle
  //     project.groupTitle = groupTitle
  //     project.workflowTitle = workflowTitle
  //     return project
  //   }))
  // },
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
      'activateProject',
      'getManagerTitle',
      'getGroupTitle'
    ])
  },
  components: {
    Filters,
    Sort
  }
}
</script>
