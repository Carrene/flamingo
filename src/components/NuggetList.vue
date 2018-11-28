<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">

      <div class="header-title">
        <p
          class="project-title"
          v-if="!loading"
        >{{ selectedProject.title }}</p>
      </div>

      <!-- FILTER -->

      <div
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
      </div>

      <!-- SORT -->

      <div
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
          <label class="tooltip-header">Sort Nuggets</label>
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
      </div>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- EMPTY STATE -->

    <div
      class="empty-state"
      v-else-if="!nuggetsOfSelectedProject.length"
    >
      <img src="../assets/empty.svg">
      <div class="text">
        <p class="title-line1">You don't have</p>
        <p class="title-line2"> any nuggets.</p>
        <p class="subtitle">Create a new nugget using the right section.</p>
      </div>
      <button
        type="button"
        class="primary-button medium"
      >Learn About Maestro</button>
    </div>

    <nugget-card-view v-else-if="viewMode === 'card'" />
    <nugget-table-view v-else />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import NuggetCardView from './NuggetCardView'
import NuggetTableView from './NuggetTableView'
import Loading from './Loading'
import { mixin as clickaway } from 'vue-clickaway'
import server from '../server.js'

export default {
  mixins: [clickaway],
  name: 'NuggetList',
  data () {
    return {
      filterType: ['Global (Public)', 'Group 1', 'Group 2'],
      nuggetMetadata: server.metadata.models.Issue,
      filters: [],
      showFilterTooltip: null,
      showSortTooltip: null,
      loading: false
    }
  },
  watch: {
    'sortCriteria' () {
      this.loading = true
      this.listNuggets([this.$route.params.projectId, this.$route.params.nuggetId || undefined, () => {
        this.loading = false
        this.showSortTooltip = false
      }])
    }
  },
  computed: {
    sortType () {
      return {
        title: this.nuggetMetadata.fields.title.label,
        isSubscribed: this.nuggetMetadata.fields.isSubscribed.label,
        boarding: this.nuggetMetadata.fields.boarding.label,
        status: this.nuggetMetadata.fields.status.label,
        kind: this.nuggetMetadata.fields.kind.label,
        days: this.nuggetMetadata.fields.days.label,
        dueDate: this.nuggetMetadata.fields.dueDate.label
      }
    },
    ...mapState([
      'viewMode',
      'sortCriteria',
      'selectedProject',
      'nuggetsOfSelectedProject',
      'projects'
    ])
  },
  beforeMount () {
    this.loading = true
    if (!this.projects.length) {
      this.listProjects([this.$route.params.projectId])
    }
    this.listNuggets([this.$route.params.projectId, this.$route.params.nuggetId || undefined, () => {
      this.loading = false
    }])
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
      'listNuggets',
      'listProjects'
    ])
  },
  components: {
    NuggetCardView,
    NuggetTableView,
    Loading
  }
}
</script>
