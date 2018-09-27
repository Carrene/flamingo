<template>
  <div id="homeLeftColumn">
    <div class="header">
      <img src="../assets/filter.svg" class="header-icon">
      <img src="../assets/sort.svg" class="header-icon">
    </div>
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
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'HomeLeftColumn',
  data () {
    return {
      // TODO: Change below data to dynamic.
      unreadMessage: '299',
      eventLogMessage: '52'
    }
  },
  computed: mapState([
    'projects',
    'selectedProject'
  ]),
  methods: {
    ...mapMutations([
      'selectProject'
    ])
  }
}
</script>
