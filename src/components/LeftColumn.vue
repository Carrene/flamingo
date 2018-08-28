<template>
  <div class="left-column">
    <div class="button-field">
      <button type="button" class="button">New Project</button>
    </div>
    <div class="projects">
      <div
        class="project-details"
        v-for="project in projects"
        :key="project.id"
        :class="[project.id, {selected: project.id === selectedProject.id}]"
        @click="selectProject(project)"
      >
        <div class="row-1">
          <p class="project-name">{{ project.title}}</p>
          <div class="event-log">
            <p class="number">{{ eventLogMessage }}</p>
            <img src="../assets/event-icon.svg" class="event-icon icons">
          </div>
          <div class="unread-msg">
            <p class="number">{{ unreadMessage }}</p>
            <img src="../assets/message-icon.svg" class="unread-msg-icon icons">
          </div>
        </div>
        <div class="row-2">
          <div class="status" :class="project.status">
            <img
              src="../assets/atrisk-icon.svg"
              class="status-icon"
              v-if="project.status === 'atrisk' || project.status === 'on-hold'"
            >
            <img
              src="../assets/ontime-icon.svg"
              class="status-icon"
              v-if="project.status === 'done' || project.status === 'in-progress'"
            >
            <img
              src="../assets/delayed-icon.svg"
              class="status-icon"
              v-if="project.status === 'delayed'"
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
  name: 'Home',
  data () {
    return {
      // TODO: Change below data to dynamic
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
