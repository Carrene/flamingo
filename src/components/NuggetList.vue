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

    <!-- LOADING -->

    <loading v-if="loading"/>

    <!-- EMPTY STATE -->

    <div class="empty-state" v-else-if="!nuggetsOfSelectedProject.length">
      <img src="../assets/empty.svg">
      <div class="text">
        <p class="title-line1">You don't have</p>
        <p class="title-line2">  any nugget.</p>
        <p class="subtitle">Create new nugget on the right section.</p>
      </div>
      <button type="button" class="primary-button medium">Learn About Maestro</button>
    </div>

    <nugget-card-view v-else-if="viewMode === 'card'"/>
    <nugget-table-view v-else />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import NuggetCardView from './NuggetCardView'
import NuggetTableView from './NuggetTableView'
import Loading from './Loading'
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
      showSortTooltip: null,
      loading: false
    }
  },
  watch: {
    'sortCriteria' () {
      this.loading = true
      this.listNuggets(() => {
        this.loading = false
      })
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
      'selectedProject',
      'nuggetsOfSelectedProject'
    ])
  },
  mounted () {
    this.loading = true
    this.listNuggets(() => {
      this.loading = false
    })
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
    NuggetTableView,
    Loading
  }
}
</script>
