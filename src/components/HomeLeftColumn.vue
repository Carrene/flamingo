<template>
  <div id="homeLeftColumn">
    <div class="header">

      <!--FILTER-->

      <v-popover>
        <img src="../assets/filter.svg" class="tooltip-target header-icon">
        <template slot="popover" class="tooltip-content">
          <div class="filter-container">
            <label class="filter-label">Filter Projects</label>

            <!--CHECKBOX-->

            <div class="checkbox-container" v-for="(item, index) in filterType" :key="index">
              <input type="checkbox" :id="`checkbox${index}`" name="filter" :value="item" class="checkbox" v-model="filters"/>
              <label :for="`checkbox${index}`" class="check"></label>
              <label :for="`checkbox${index}`" class="filter-item">{{ item }}</label>
            </div>
          </div>
        </template>
      </v-popover>

      <!--SORT-->

      <v-popover>
        <img src="../assets/sort.svg" class="tooltip-target header-icon">
        <template slot="popover" class="tooltip-content">
          <div class="sort-container">
            <label class="sort-label">Sort Projects</label>

          <!--RADIO BUTTON-->

            <div class="radio-container" v-for="(item, index) in sortType" :key="index" >
              <input type="radio" :id="`radio${index}`" name="sort" :value="index" class="radio" v-model="sortingBy" :checked="index === sortingBy"/>
              <label :for="`radio${index}`" class="check"></label>
              <label :for="`radio${index}`" class="sort-item">{{ item }}</label>
            </div>
          </div>
        </template>
      </v-popover>
    </div>

    <!--PROJECTS LIST-->

    <div class="entities">
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
          <div class="status">
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
            <p class="status-type">
              {{ project.status }}
            </p>
          </div>
          <p class="activity">last activity:30min ago</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'HomeLeftColumn',
  data () {
    return {
      filterType: ['Global (Public)', 'Group 1', 'Group 2'],
      sortType: {
        title: 'Title',
        lastActivity: 'Last activity'
      },
      filters: [],
      sortingBy: 'title',
      // TODO: Change below data to dynamic.
      unreadMessage: '299',
      eventLogMessage: '52'
    }
  },
  computed: {
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
    ...mapMutations([
      'selectProject',
      'setSortCriteria'
    ]),
    ...mapActions(['listProjects'])
  }
}
</script>
