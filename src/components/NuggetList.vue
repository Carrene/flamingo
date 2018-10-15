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
        <div :class="['row', 'content', selectedNugget === nugget.id ? 'selected' : null]"
             v-for="nugget in nuggets"
             :key="nugget.id"
             @click="selectedNugget = nugget.id"
        >
          <div class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications">
          </div>
          <div class="checkbox-container subscribe">
                <input type="checkbox"
                       :id="`checkbox${nugget.id}`"
                       name="subscribe" class="checkbox"
                       v-model="nugget.subscribe"
                />
                <label :for="`checkbox${nugget.id}`" class="check"></label>
          </div>
          <div class="title">
            {{ nugget.title }}
          </div>
          <div :class="['pace', nugget.pace]">
            {{ formatPace(nugget.pace) }}
          </div>
          <div class="status">
            {{ nugget.status }}
          </div>
          <div class="priority">
            {{ nugget.priority }}
          </div>
          <div class="phase">
            {{ nugget.phase }}
          </div>
          <div class="days">
            {{ nugget.days }}
          </div>
          <div class="target-date">
            {{ nugget.targetDate }}
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
      selectedNugget: 1,
      // TODO: Remove these after implementation of dynamic data
      nuggets: [
        {
          id: 1,
          notifications: 4,
          subscribe: true,
          title: 'Alpha',
          pace: 'on-time',
          status: 'Active',
          priority: 'High',
          phase: 'Development',
          days: 25,
          targetDate: '14/10/2018'
        },
        {
          id: 2,
          notifications: 6,
          subscribe: false,
          title: 'Maestro',
          pace: 'delayed',
          status: 'Queued',
          priority: 'Normal',
          phase: 'Triage',
          days: 22,
          targetDate: '14/10/2018'
        },
        {
          id: 3,
          notifications: 4,
          subscribe: true,
          title: 'CAS',
          pace: 'frozen',
          status: 'Active',
          priority: 'High',
          phase: 'Development',
          days: 200,
          targetDate: '14/10/2018'
        },
        {
          id: 4,
          notifications: 4,
          subscribe: false,
          title: 'Cucumber',
          pace: 'at-risk',
          status: 'On Hold',
          priority: 'Normal',
          phase: 'Design',
          days: 22,
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
    formatPace (pace) {
      return pace.split('-').join(' ').capitalize()
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
