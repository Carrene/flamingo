<template>
  <div id="nuggetList">
    <div class="header">

      <!-- FILTER -->

        <div class="header-icon" :class="{selected : filters.length}">
          <img :src="filterSrc" @click="showFilterTooltip = !showFilterTooltip">
          <div class="tooltip-container" v-if="showFilterTooltip">
            <div class="filter-container">
              <label class="filter-label">Filter Projects</label>

              <div class="checkbox-container" v-for="(item, index) in filterType" :key="index">
                <input type="checkbox" :id="`checkbox${index}`" name="filter" :value="item" class="checkbox" v-model="filters"/>
                <label :for="`checkbox${index}`" class="check"></label>
                <label :for="`checkbox${index}`" class="filter-item">{{ item }}</label>
              </div>
            </div>
          </div>
        </div>

      <!-- SORT -->

        <div class="header-icon" @click="sort" :class="{selected : sortingBy}">
          <img :src="sortSrc">
          <div class="tooltip-container" v-if="showSortTooltip">
            <div class="sort-container">
              <label class="sort-label">Sort Projects</label>

              <div class="radio-container" v-for="(item, index) in sortType" :key="index" >
                <input type="radio" :id="`radio${index}`" name="sort" :value="index" class="radio" v-model="sortingBy" :checked="index === sortingBy"/>
                <label :for="`radio${index}`" class="check"></label>
                <label :for="`radio${index}`" class="sort-item">{{ item }}</label>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- PROJECTS LIST -->

    <div class="entities" v-if="projects.length">
      <div
        class="entity-details"
        v-for="project in projects"
        :key="project.id"
        :class="{selected: project.id === selectedProject.id}"
        @click="selectProject(project)"
      >
        <div class="row-1">
          <p class="project-name">{{ project.title }}</p>
          <div class="event-log">
            <p class="number">{{ eventLogMessage }}</p>
            <img src="../assets/event.svg" class="event-icon icons">
          </div>
          <div class="unread-msg">
            <p class="number">{{ unreadMessage }}</p>
            <img src="../assets/message.svg" class="unread-msg-icon icons">
          </div>
        </div>
        <div class="row-2">
          <div :class="project.boarding ? project.boarding : 'status'">
            <img
              src="../assets/atrisk.svg"
              class="status-icon"
              v-if="project.boarding === 'atrisk'"
            >
            <img
              src="../assets/ontime.svg"
              class="status-icon"
              v-if="project.boarding === 'on-time'"
            >
            <img
              src="../assets/delayed.svg"
              class="status-icon"
              v-if="project.boarding === 'delayed'"
            >
            <p>
              {{ project.status }}
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- FIXME: Add style to this -->

    <div class="entities" v-else>
      You don't have any projects yet
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'ProjectList',
  data () {
    return {
      filterType: ['Global (Public)', 'Group 1', 'Group 2'],
      sortType: {
        title: 'Title',
        lastActivity: 'Last activity'
      },
      filters: [],
      sortingBy: 'title',
      selectedTab: null,
      showFilterTooltip: null,
      showSortTooltip: null,
      // TODO: Change below data to dynamic.
      unreadMessage: '',
      eventLogMessage: ''
    }
  },
  computed: {
    filterSrc () {
      return require(`@/assets/filter${this.filters.length ? '-selected' : ''}.svg`)
    },
    sortSrc () {
      return require(`@/assets/sort${this.sortingBy ? '-selected' : ''}.svg`)
    },
    ...mapState([
      'projects',
      'selectedProject'
    ])
  },
  watch: {
    'sortingBy' (newValue) {
      this.setSortCriteria(newValue)
      this.listProjects()
    }
  },
  methods: {
    sort () {
      this.selectedTab = 'sort'
      this.showSortTooltip = !this.showSortTooltip
    },
    filter () {

    },
    ...mapMutations([
      'selectProject',
      'setSortCriteria'
    ]),
    ...mapActions([
      'listProjects'
    ])
  }
}
</script>
