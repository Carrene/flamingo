<template>
  <div id="projectCardView">

    <!-- CONTAINERS LIST -->

    <div class="entities">
      <div
        class="entity-details"
        v-for="project in projects"
        :key="project.id"
        :class="{selected: selectedProject && (project.id === selectedProject.id)}"
        @click="activateProject({project: project})"
        @dblclick="activateNuggetView(project)"
      >
        <div class="row-1">
          <p class="project-name">{{ project.title }}</p>
          <div class="event-log">
            <p class="number"></p>
            <img
              src="../assets/events.svg"
              class="event-icon icons"
            >
          </div>
          <div class="unread-msg">
            <p class="number"></p>
            <img
              src="../assets/message.svg"
              class="unread-msg-icon icons"
            >
          </div>
        </div>
        <div class="row-2">
          <div :class="project.boarding ? project.boarding : 'status'">
            <img
              :src="require(`@/assets/${project.boarding}.svg`)"
              class="status-icon"
              v-if="project.boarding"
            >
            <p>
              {{ project.status }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ProjectCardView',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'projects',
      'selectedProject'
    ])
  },
  methods: {
    activateNuggetView (project) {
      this.activateProject({ project: project, updateRoute: false })
      this.activateNugget({ nugget: null })
    },
    ...mapActions([
      'activateProject',
      'activateNugget'
    ])
  }
}
</script>
