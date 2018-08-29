<template>
  <div class="right-column">
    <div v-if="selectedProject" class="project-information">
      <img src="../assets/description-icon.svg" class="information-icon">
      <p class="title">Description</p>
      <p class="text">{{ selectedProject.description }}</p>
      <img src="../assets/due-date-icon.svg" class="information-icon">
      <div class="due-date">
        <p>Due-Date</p>
        <p class="date">{{ moment(selectedProject.dueDate).format('DD/MM/YYYY') }}</p>
      </div>
      <img src="../assets/create-at-icon.svg" class="information-icon">
      <div class="create-at">
        <p>Create At</p>
        <p class="date">{{ moment(selectedProject.createdAt).format('DD/MM/YYYY') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  watch: {
    'selectedProjectId' (newValue) {
      this.listIssues()
    }
  },
  computed: mapState([
    'selectedProject'
  ]),
  methods: {
    moment: moment
  }
}
</script>
