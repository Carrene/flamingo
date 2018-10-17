<template>
  <div id="nuggetList">
    <div class="header">

      <!-- TODO: Remove this later -->
      <p class="project-title">{{ selectedProject.title }}</p>

      <!-- FILTER -->

        <div class="header-icon" :class="{selected : filters.length}">
          <img :src="filterSrc" @click="toggleFilterTooltip">
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

        <div class="header-icon" @click="toggleSortTooltip" :class="{selected : sortCriteria}">
          <img :src="sortSrc">
          <div class="tooltip-container" v-if="showSortTooltip">
            <div class="sort-container">
              <label class="sort-label">Sort Projects</label>

              <div class="radio-container" v-for="(item, index) in sortType" :key="index" >
                <input type="radio"
                       :id="`radio${index}`"
                       name="sort"
                       :value="index"
                       class="radio"
                       :checked="index === sortCriteria"
                />
                <label :for="`radio${index}`" class="check"></label>
                <label :for="`radio${index}`" class="sort-item">{{ item }}</label>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Nuggets LIST -->

    <div class="entities" v-if="nuggetsOfSelectedProject.length">
      <div class="table">
        <div class="row header">
          <div></div>
          <div>Subscribe</div>
          <div>Title</div>
          <div>Pace</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Phase</div>
          <div>Days</div>
          <div>Target Date</div>
        </div>
        <div :class="['row', 'content', selectedNugget.id === nugget.id ? 'selected' : null]"
             v-for="nugget in nuggetsOfSelectedProject"
             :key="nugget.id"
             @click="selectNugget(nugget)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications">
          </div>
          <!-- TODO: add subscribe later -->
          <div class="checkbox-container subscribe">
                <input type="checkbox"
                       :id="`checkbox${nugget.id}`"
                       name="subscribe" class="checkbox"
                       value="true"
                       checked
                />
                <label :for="`checkbox${nugget.id}`" class="check"></label>
          </div>
          <div class="title">
            {{ nugget.title }}
          </div>
          <div :class="['pace', nugget.boarding]">
            {{ formatText(nugget.boarding) }}
          </div>
          <div class="status">
            {{ formatText(nugget.status) }}
          </div>
          <!-- TODO: add priority later -->
          <div class="priority">
            High
          </div>
          <div class="phase">
            {{ formatText(nugget.kind) }}
          </div>
          <div class="days">
            {{ nugget.days }}
          </div>
          <div class="target-date">
            {{ formatTargetDate(nugget.dueDate) }}
          </div>
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
import moment from 'moment'
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
      showFilterTooltip: null,
      showSortTooltip: null
    }
  },
  computed: {
    filterSrc () {
      return require(`@/assets/filter${this.filters.length ? '-selected' : ''}.svg`)
    },
    sortSrc () {
      return require(`@/assets/sort${this.sortCriteria ? '-selected' : ''}.svg`)
    },
    ...mapState([
      'projects',
      'selectedProject',
      'sortCriteria',
      'selectedNugget',
      'nuggetsOfSelectedProject'
    ])
  },
  watch: {
    'sortCriteria' () {
      this.listProjects()
    }
  },
  methods: {
    toggleSortTooltip () {
      this.showSortTooltip = !this.showSortTooltip
      this.showFilterTooltip = false
    },
    toggleFilterTooltip () {
      this.showFilterTooltip = !this.showFilterTooltip
      this.showSortTooltip = false
    },
    formatText (input) {
      return input.split('-').join(' ').capitalize()
    },
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    ...mapMutations([
      'selectProject',
      'selectNugget',
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
