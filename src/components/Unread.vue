<template>
  <div id="unread">

    <!-- HEADER -->

    <div class="header">

      <div class="header-title">
        <!-- <p
          class="project-title"
          v-if="!loading"
        >{{ selectedProject.title }}</p> -->
      </div>
    </div>

    <!-- CONTENT -->

    <div class="content">

      <!-- LOADING -->

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!nuggets.length"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any unread nuggets.</p>
        </div>
        <button
          type="button"
          class="primary-button medium"
        >Learn About Maestro</button>
      </div>

      <nugget-table-view
        :nuggets="nuggets"
        :selectAction="selectAction"
        v-else
      />
    </div>
  </div>
</template>

<script>
import server from './../server.js'
import { mapState, mapMutations, mapActions } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

const NuggetTableView = () => import(
  /* webpackChunkName: "NuggetTableView" */ './NuggetTableView'
)

export default {
  name: 'Unread',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      loading: false,
      nuggets: []
    }
  },
  computed: {
    ...mapState([
      'Nugget',
      'Project',
      'Workflow',
      'eventLogUnreadCount'
    ])
  },
  methods: {
    async loadUnread () {
      this.loading = true
      let response = await this.Nugget.load({ isSubscribed: 1, seenAt: null }).send()
      this.nuggets = response.models
      this.setNuggetsUnreadCount(response.totalCount)
      this.loading = false
    },
    async getPhases (projectId) {
      let response = await this.Project.get(projectId).send()
      let project = response.models[0]
      let workflow = new this.Workflow({ id: project.workflowId })
      response = await workflow.listPhases().send()
      this.setPhasesOfSelectedWorkflow(response.models)
      Promise.resolve()
    },
    async selectAction ({ nugget }) {
      await this.getPhases(nugget.projectId)
      this.activateNugget({ nugget: nugget, updateRoute: false })
      this.see(nugget)
    },
    see (nugget) {
      nugget.see().send()
    },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setNuggetsUnreadCount'
    ]),
    ...mapActions([
      'activateNugget'
    ])
  },
  mounted () {
    this.loadUnread()
  },
  components: {
    Loading,
    NuggetTableView
  }
}
</script>
