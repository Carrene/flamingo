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

    <!-- Nuggets LIST -->

    <div class="entities" v-if="projects.length">
      <div class="table">
        <div class="row header">
          <p></p>
          <p>Title</p>
          <p>Pace</p>
          <p>Status</p>
          <p>Release</p>
          <p>Manager</p>
          <p>Target Date</p>
        </div>
        <div class="row" v-for="nugget in nuggets" :key="nugget.id">
          <p class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications" height="20px">
          </p>
          <p class="title">{{ nugget.title }}</p>
          <p class="pace">{{ nugget.pace }}</p>
          <p class="status">{{ nugget.status }}</p>
          <p class="release">{{ nugget.release }}</p>
          <p class="manager">{{ nugget.manager }}</p>
          <p class="target-date">{{ nugget.targetDate }}</p>
        </div>
      </div>

    </div>

    <!-- FIXME: Add style to this -->

    <div class="entities" v-else>
      You don't have any nuggets yet
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
      // TODO: Remove these after implementation of dynamic data
      nuggets: [
        {
          id: 1,
          notifications: 4,
          title: 'Alpha',
          pace: 'On Time',
          status: 'Active',
          release: 'Alpha 100',
          manager: 'David M. Smith',
          targetDate: '14/10/2018'
        },
        {
          id: 2,
          notifications: 6,
          title: 'Maestro',
          pace: 'Delayed',
          status: 'Queued',
          release: 'Maestro 100',
          manager: 'David M. Smith',
          targetDate: '14/10/2018'
        },
        {
          id: 3,
          notifications: 4,
          title: 'CAS',
          pace: 'Frozen',
          status: 'Active',
          release: 'Maestro 100',
          manager: 'David M. Smith',
          targetDate: '14/10/2018'
        },
        {
          id: 4,
          notifications: 4,
          title: 'Cucumber',
          pace: 'At Risk',
          status: 'On Hold',
          release: 'Maestro 100',
          manager: 'David M. Smith',
          targetDate: '14/10/2018'
        }
      ]
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
  },
  props: [
    'projectId'
  ]
}
</script>
