<template>
  <div id="projectList">

    <!-- HEADER -->

    <div class="header">

      <!-- FILTER -->

      <!-- <div
        class="header-icon"
        :class="{selected : filters.length}"
      >
        <simple-svg
          :filepath="require('@/assets/filter.svg')"
          :fill="filters.length ? '#5E5375' : '#FFFFFF'"
          class="icon"
          @click.native="toggleFilterTooltip"
        />
        <div
          class="tooltip-container center filter"
          v-if="showFilterTooltip"
          v-on-clickaway="toggleFilterTooltip.bind(undefined, false)"
        >
          <label class="tooltip-header">Filter Projects</label>
          <div class="tooltip-content">
            <div
              class="checkbox-container"
              v-for="(item, index) in filterType"
              :key="index"
            >
              <input
                type="checkbox"
                :id="`checkbox${index}`"
                name="filter"
                :value="item"
                class="checkbox"
                v-model="filters"
              />
              <label
                :for="`checkbox${index}`"
                class="check"
              ></label>
              <label
                :for="`checkbox${index}`"
                class="label"
              >{{ item }}</label>
            </div>
          </div>
        </div>
      </div> -->

      <!-- SORT -->

      <!-- <div
        class="header-icon"
        :class="{selected : sortCriteria}"
      >
        <simple-svg
          :filepath="require('@/assets/sort.svg')"
          :fill="sortCriteria ? '#5E5375' : '#FFFFFF'"
          class="icon"
          @click.native="toggleSortTooltip"
        />
        <div
          class="tooltip-container center sort"
          v-if="showSortTooltip"
          v-on-clickaway="toggleSortTooltip.bind(undefined, false)"
        >
          <label class="tooltip-header">Sort Projects</label>
          <div class="tooltip-content">
            <div
              class="radio-container"
              v-for="(item, index) in sortType"
              :key="index"
            >
              <input
                type="radio"
                :id="`radio${index}`"
                name="sort"
                :value="index"
                class="radio"
                :checked="index === sortCriteria"
                @change="setSortCriteria(index)"
              />
              <label
                :for="`radio${index}`"
                class="check"
              ></label>
              <label
                :for="`radio${index}`"
                class="label"
              >{{ item }}</label>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <loading v-if="loading" />

    <!-- EMPTY STATE -->

    <div
      class="empty-state"
      v-else-if="!projects.length"
    >
      <img src="../assets/empty.svg">
      <div class="text">
        <p class="title-line1">You don't have</p>
        <p class="title-line2"> any projects.</p>
        <p class="subtitle">Create a new project using the right section.</p>
      </div>
      <button
        type="button"
        class="primary-button medium"
      >Learn About Maestro</button>
    </div>

    <project-card-view v-else-if="viewMode === 'card'" />
    <project-table-view v-else />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ProjectCardView from './ProjectCardView'
import ProjectTableView from './ProjectTableView'
import Loading from './Loading'
import { mixin as clickaway } from 'vue-clickaway'
import server from './../server.js'

export default {
  mixins: [clickaway],
  name: 'ProjectList',
  data () {
    return {
      filterType: ['Global (Public)', 'Group 1', 'Group 2'],
      projectMetadata: server.metadata.models.Project,
      filters: [],
      showFilterTooltip: false,
      showSortTooltip: false,
      loading: false
    }
  },
  computed: {
    sortType () {
      return {
        title: this.projectMetadata.fields.title.label,
        boarding: this.projectMetadata.fields.boarding.label,
        status: this.projectMetadata.fields.status.label,
        releaseId: this.projectMetadata.fields.releaseId.label,
        dueDate: this.projectMetadata.fields.dueDate.label,
        memberId: this.projectMetadata.fields.memberId.label
      }
    },
    ...mapState([
      'viewMode',
      'sortCriteria',
      'projects'
    ])
  },
  watch: {
    'sortCriteria' () {
      this.loading = true
      this.toggleSortTooltip()
      this.listProjects([this.$route.params.projectId || undefined, () => {
        this.loading = false
      }])
    }
  },
  methods: {
    toggleSortTooltip (value) {
      if (typeof value === 'boolean') {
        this.showSortTooltip = value
      } else {
        this.showSortTooltip = !this.showSortTooltip
      }
    },
    toggleFilterTooltip (value) {
      if (typeof value === 'boolean') {
        this.showFilterTooltip = value
      } else {
        this.showFilterTooltip = !this.showFilterTooltip
      }
    },
    ...mapMutations([
      'setSortCriteria'
    ]),
    ...mapActions([
      'listProjects'
    ])
  },
  mounted () {
    if (!this.projects.length) {
      this.loading = true
      this.listProjects([this.$route.params.projectId || undefined, () => {
        this.loading = false
      }])
    }
  },
  components: {
    ProjectCardView,
    ProjectTableView,
    Loading
  }
}
</script>
