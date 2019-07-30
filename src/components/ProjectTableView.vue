<template>
  <div id="projectTableView">

    <!-- PROJECTS LIST -->

    <div class="entities">

      <!-- TABLE -->

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
                  :class="{ascending: !projectSortCriteria.descending}"
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
                    :mutation="setProjectFilters"
                    :header="header"
                    :model="projectFilters"
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
            :class="{selected: selectedProject && (project.id === selectedProject.id)}"
            v-for="project in projects"
            :key="project.id"
            @click="activateProject({project: project})"
            @dblclick="activateNuggetView(project)"
          >

            <!-- ID CELL -->

            <td
              class="id cell"
              :title="project.id"
            >
              <p>P{{ project.id }}</p>
            </td>

            <!-- NAME CELL -->

            <td
              class="name cell"
              :title="project.title"
            >
              <p>{{ project.title }}</p>
            </td>

            <!-- PACE CELL -->

            <td class="pace cell">
              <div
                class="pace-card"
                :class="['pace', project.boarding || 'none']"
              >
                <p :title="project.boarding ? project.boarding.formatText() : '-'">
                  {{ project.boarding ? project.boarding.formatText() : '-' }}
                </p>
              </div>
            </td>

            <!-- STATUS CELL -->

            <td
              class="status cell"
              :title="project.status.formatText()"
            >
              <p>{{ project.status.formatText() }}</p>
            </td>

            <!-- WORKFLOW CELL -->

            <td
              class="workflow cell"
              :title="project.workflow"
            >
              <p>{{ project.workflowTitle }}</p>
            </td>

            <!-- GROUP CELL -->

            <td
              class="group cell"
              :title="project.groupTitle"
            >
              <p>{{ project.groupTitle }}</p>
            </td>

            <!-- RELEASE CELL -->

            <td
              class="release cell"
              :title="project.releaseTitle"
            >
              <p>{{ project.releaseTitle }}</p>
            </td>

            <!-- RELEASE CUTOFF -->

            <td
              class="release-cutoff cell"
              :title="formatTargetDate(project.releaseCutoff)"
            >
              <p>{{ formatTargetDate(project.releaseCutoff) }}</p>
            </td>

            <!-- PROJECT CUTOFF -->

            <td
              class="project-cutoff cell"
              :title="formatTargetDate(project.dueDate)"
            >
              <p>{{ formatTargetDate(project.dueDate) }}</p>
            </td>

            <!-- MANAGER CELL -->

            <td
              class="manager cell"
              :title="project.managerTitle"
            >
              <p>{{ project.managerTitle }}</p>
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
import { mixin as clickout } from 'vue-clickout'
import InfiniteLoading from 'vue-infinite-loading'

const Filters = () => import(
  /* webpackChunkName: "Filters" */ './Filters'
)
const Sort = () => import(
  /* webpackChunkName: "Sort" */ './Sort'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  mixins: [clickout],
  name: 'ProjectTableView',
  data () {
    return {
      projectMetadata: server.metadata.models.Project,
      sortIconColor: '#008290',
      iconSrc: require('@/assets/chevron-down.svg'),
      showTooltip: null,
      isSelected: 'sort',
      showInfiniteLoader: false
    }
  },
  props: {
    projects: Array,
    sortAction: Function,
    sortCriteria: Object
  },
  computed: {
    headers () {
      return [
        {
          label: this.projectMetadata.fields.id.label,
          isSortingActive: this.sortCriteria.field === 'id',
          isFilteringActive: null,
          field: 'id',
          filteringItems: null,
          className: 'id'
        },
        {
          label: this.projectMetadata.fields.title.label,
          isSortingActive: this.sortCriteria.field === 'title',
          isFilteringActive: null,
          field: 'title',
          filteringItems: null,
          className: 'name'
        },
        {
          label: this.projectMetadata.fields.boarding.label,
          isSortingActive: this.sortCriteria.field === 'boarding',
          isFilteringActive: this.projectFilters.boarding.length,
          field: 'boarding',
          filteringItems: this.projectBoardings,
          className: 'pace'
        },
        {
          label: this.projectMetadata.fields.status.label,
          isSortingActive: this.sortCriteria.field === 'status',
          isFilteringActive: this.projectFilters.status.length,
          field: 'status',
          filteringItems: this.projectStatuses,
          className: 'status'
        },
        {
          label: this.projectMetadata.fields.workflowId.label,
          isSortingActive: this.sortCriteria.field === 'workflowId',
          isFilteringActive: null,
          field: 'workflowId',
          filteringItems: null,
          className: 'workflow'
        },
        {
          label: this.projectMetadata.fields.groupId.label,
          isSortingActive: this.sortCriteria.field === 'groupId',
          isFilteringActive: null,
          field: 'groupId',
          filteringItems: null,
          className: 'group'
        },
        {
          label: this.projectMetadata.fields.releaseId.label,
          isSortingActive: this.sortCriteria.field === 'releaseId',
          isFilteringActive: null,
          field: 'releaseId',
          filteringItems: null,
          className: 'release'
        },
        {
          label: this.projectMetadata.fields.releaseCutoff.label,
          isSortingActive: this.sortCriteria.field === 'releaseCutoff',
          isFilteringActive: null,
          field: 'releaseCutoff',
          filteringItems: null,
          className: 'release-cutoff'
        },
        {
          label: this.projectMetadata.fields.dueDate.label,
          isSortingActive: this.sortCriteria.field === 'dueDate',
          isFilteringActive: null,
          field: 'dueDate',
          filteringItems: null,
          className: 'project-cutoff'
        },
        {
          label: this.projectMetadata.fields.managerTitle.label,
          isSortingActive: this.sortCriteria.field === 'managerTitle',
          isFilteringActive: null,
          field: 'managerTitle',
          filteringItems: null,
          className: 'manager'
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'selectedProject',
      'selectedNuggets',
      'Project',
      'projectSortCriteria',
      'Member',
      'Release',
      'Group',
      'projectFilters',
      'projectStatuses',
      'projectBoardings',
      'infiniteLoaderIdentifier',
      'globalLoading'
    ])
  },
  watch: {
    'projects': {
      immediate: true,
      async handler (newValue, oldValue) {
        if (!oldValue && newValue.length) {
          await this.activateProject({ project: this.selectedProject || newValue[0] })
        }
        this.showInfiniteLoader = true
      }
    }
  },
  methods: {
    async activateNuggetView (project) {
      await this.activateProject({ project: project, updateRoute: false })
      this.activateNugget({ nugget: null, updateRoute: true })
    },
    formatTargetDate (isoString) {
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
      this.listProjects({ selectedProjectId: this.selectedProject ? this.selectedProject.id : undefined, $state })
    },
    ...mapMutations([
      'setProjectFilters'
    ]),
    ...mapActions([
      'activateProject',
      'activateNugget',
      'getMemberTitle',
      'getReleaseTitle',
      'getGroupTitle',
      'getWorkflowTitle',
      'listProjects'
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
