<template>
  <div class="home-right-column">
    <div v-if="selectedProject" class="project-information">
      <div class="description-container">
        <img src="../assets/description-icon.svg" class="information-icon">
        <p class="description-title">Description</p>
        <img src="./../assets/edit-icon.svg" class="information-icon"/>
        <p class="description">{{ selectedProject.description }}</p>
        <p class="character-count">{{ selectedProject.description.length }}/512</p>
      </div>
      <div class="project-date">
        <img src="../assets/due-date-icon.svg" class="information-icon">
        <p>Due-Date</p>
        <p class="due-date">{{ moment(selectedProject.dueDate).format('DD/MM/YYYY') }}</p>
        <img src="../assets/create-at-icon.svg" class="information-icon">
        <p>Create At</p>
        <p class="create-at-date">{{ moment(selectedProject.createdAt).format('DD/MM/YYYY') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'HomeRightColumn',
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
