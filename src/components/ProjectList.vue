<template>
  <div id="projectList">
    <project-card-view v-if="viewMode === 'card'"/>
    <project-table-view v-else/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProjectCardView from './ProjectCardView'
import ProjectTableView from './ProjectTableView'
export default {
  name: 'ProjectList',
  computed: {
    ...mapState([
      'viewMode'
    ])
  },
  components: {
    ProjectCardView,
    ProjectTableView
  }
}
</script>
