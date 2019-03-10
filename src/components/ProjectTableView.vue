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
              :class="[{active: header.isSortingActive || header.isFilteringActive}, header.className]"
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
            v-for="project in decoratedProjects"
            :key="project.id"
            @click="activateProject({project: project})"
            @dblclick="activateNuggetView(project)"
          >
            <td
              class="name cell"
              :title="project.title"
            >
              <p>{{ project.title }}</p>
            </td>
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
            <td
              class="status cell"
              :title="project.status.formatText()"
            >
              <p>{{ project.status.formatText() }}</p>
            </td>
            <td
              class="group cell"
              :title="project.groupTitle"
            >
              <p>{{ project.groupTitle }}</p>
            </td>
            <td
              class="release cell"
              :title="project.releaseTitle"
            >
              <p>{{ project.releaseTitle }}</p>
            </td>
            <td
              class="release-cutoff cell"
              :title="formatTargetDate(project.dueDate)"
            >
              <p>{{ formatTargetDate(project.dueDate) }}</p>
            </td>
            <td
              class="manager cell"
              :title="project.managerTitle"
            >
              <p>{{ project.managerTitle }}</p>
            </td>
            <td
              class="created-at cell"
              :title="formatTargetDate(project.createdAt)"
            >
              <p>{{ formatTargetDate(project.createdAt) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import db from '../localdb'
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
  name: 'ProjectTableView',
  data () {
    return {
      projectMetadata: server.metadata.models.Project,
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
          label: this.projectMetadata.fields.dueDate.label,
          isSortingActive: this.sortCriteria.field === 'dueDate',
          isFilteringActive: null,
          field: 'dueDate',
          filteringItems: null,
          className: 'release-cutoff'
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
          label: this.projectMetadata.fields.createdAt.label,
          isSortingActive: this.sortCriteria.field === 'createdAt',
          isFilteringActive: null,
          field: 'createdAt',
          filteringItems: null,
          className: 'created-at'
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
      'projectBoardings'
    ])
  },
  asyncComputed: {
    // title of messages are generated asynchronously
    async decoratedProjects () {
      if (!this.projects) {
        return []
      }
      return Promise.all(this.projects.map(async (item) => {
        let project = new this.Project(item)
        let managerTitle = 'None!'
        let releaseTitle = '-'
        if (item.managerId) {
          managerTitle = await this.getManagerTitle(project.managerId)
        }
        if (project.releaseId) {
          releaseTitle = await this.getReleaseTitle(project.releaseId)
        }
        let groupTitle = await this.getGroupTitle(project.groupId)
        project.managerTitle = managerTitle
        project.releaseTitle = releaseTitle
        project.groupTitle = groupTitle
        return project
      }))
    }
  },
  methods: {
    activateNuggetView (project) {
      this.activateProject({ project: project, updateRoute: false })
      this.activateNugget({ nugget: this.selectedNuggets.length === 1 ? this.selectedNuggets[0] : null })
    },
    formatTargetDate (isoString) {
      if (isoString) {
        return moment(isoString).format('DD/MM/YYYY')
      } else {
        return '-'
      }
    },
    async getManagerTitle (id) {
      let record = await db.read('managers', id)
      if (!record) {
        let resp = await this.Member.get(id).send()
        try {
          await db.add('managers', resp.json.id, resp.json.title)
        } catch (error) { } finally {
          record = await db.read('managers', id)
        }
      }
      return record.value
    },
    async getReleaseTitle (id) {
      let record = await db.read('releases', id)
      if (!record) {
        let resp = await this.Release.get(id).send()
        try {
          await db.add('releases', resp.json.id, resp.json.title)
        } catch (error) { } finally {
          record = await db.read('releases', id)
        }
      }
      return record.value
    },
    async getGroupTitle (id) {
      let record = await db.read('groups', id)
      if (!record) {
        let resp = await await this.Group.get(id).send()
        try {
          await db.add('groups', resp.json.id, resp.json.title)
        } catch (error) { } finally {
          record = await db.read('groups', id)
        }
      }
      return record.value
    },
    tooltipHandler (header) {
      this.showTooltip = header.label
      this.isSelected = 'sort'
    },
    hideTooltip () {
      this.showTooltip = null
    },
    ...mapMutations([
      'setProjectFilters'
    ]),
    ...mapActions([
      'activateProject',
      'activateNugget'
    ])
  },
  components: {
    Filters,
    Sort
  }
}
</script>
