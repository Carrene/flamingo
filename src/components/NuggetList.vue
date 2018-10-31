<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">

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

    <!-- EMPTY STATE -->

    <div class="empty-state">
      <img src="../assets/empty.svg">
      <div class="text">
        <p class="title-line1">You don't have</p>
        <p class="title-line2">  any nugget.</p>
        <p class="subtitle">Click on 'New nugget' above.</p>
      </div>
      <button type="button" class="primary-button medium">Learn About Maestro</button>
    </div>

    <nugget-card-view v-if="viewMode === 'card'"/>
    <nugget-table-view v-else/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import NuggetCardView from './NuggetCardView'
import NuggetTableView from './NuggetTableView'
export default {
  name: 'NuggetList',
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
  watch: {
    'sortCriteria' () {
      this.listNuggets()
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
      'viewMode',
      'sortCriteria',
      'selectedProject'
    ])
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
    ...mapMutations([
      'setSortCriteria'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  components: {
    NuggetCardView,
    NuggetTableView
  }
}
</script>
