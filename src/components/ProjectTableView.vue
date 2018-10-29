<template>
  <div id="projectTableView">
    <div class="header">

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
                       @change="setSortCriteria(index)"
                />
                <label :for="`radio${index}`" class="check"></label>
                <label :for="`radio${index}`" class="sort-item">{{ item }}</label>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- PROJECTS LIST -->

    <div class="entities" v-if="projects.length">
      <div class="table">
        <div class="row header">
          <div></div>
          <div>Name</div>
          <div>Pace</div>
          <div>Status</div>
          <div>Release</div>
          <div>Manager</div>
          <div>Target Date</div>
        </div>
        <div class="row content"
             :class="{selected: selectedProject && (project.id === selectedProject.id)}"
             v-for="project in decoratedProjects"
             :key="project.id"
             @click="selectProject(project)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications">
          </div>
          <div class="name">
            {{ project.title }}
          </div>
          <div :class="['pace', project.boarding || 'none']">
            {{ project.boarding ? formatText(project.boarding) : 'None!' }}
          </div>
          <div class="status">
            {{ formatText(project.status) }}
          </div>
          <div class="release">
            {{ project.releaseTitle }}
          </div>
          <div class="manager">
            {{ project.memberTitle }}
          </div>
          <div class="target-date">
            {{ formatTargetDate(project.dueDate) }}
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <img src="../assets/empty.svg">
      <div class="text">
        <p class="title-line1">You don't have</p>
        <p class="title-line2">  any project.</p>
        <p class="subtitle">Click on 'New Project' above.</p>
      </div>
      <button type="button" class="primary-button medium">Learn About Maestro</button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import db from '../localdb'
import server from '../server'
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
      showFilterTooltip: false,
      showSortTooltip: false
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
      'sortCriteria'
    ])
  },
  asyncComputed: {
    // title of messages are generated asynchronously
    async decoratedProjects () {
      if (!this.projects) {
        return []
      }
      return Promise.all(this.projects.map(async (item) => {
        let memberTitle = 'None!'
        let releaseTitle = 'None!'
        if (item.memberId) {
          memberTitle = await this.getManagerTitle(item.memberId)
        }
        if (item.releaseId) {
          releaseTitle = await this.getReleaseTitle(item.releaseId)
        }
        item.memberTitle = memberTitle
        item.releaseTitle = releaseTitle
        return item
      }))
    }
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
    activateNuggetView (project) {
      this.selectProject(project)
      this.selectScope('Nuggets')
    },
    formatText (input) {
      return input.split('-').join(' ').capitalize()
    },
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    async getManagerTitle (id) {
      let record = await db.read('managers', id)
      if (!record) {
        let resp = await server.request(`members/${id}`).send()
        try {
          await db.add('managers', resp.json.id, resp.json.title)
        } catch (error) {} finally {
          record = await db.read('managers', id)
        }
      }
      return record.value
    },
    async getReleaseTitle (id) {
      let record = await db.read('releases', id)
      if (!record) {
        let resp = await server.request(`releases/${id}`).send()
        try {
          await db.add('releases', resp.json.id, resp.json.title)
        } catch (error) {} finally {
          record = await db.read('releases', id)
        }
      }
      return record.value
    },
    ...mapMutations([
      'selectProject',
      'setSortCriteria',
      'selectScope'
    ]),
    ...mapActions([
      'listProjects'
    ])
  }
}
</script>
