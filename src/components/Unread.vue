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
        :selectAction="activateNugget"
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
      'Workflow'
    ])
  },
  methods: {
    async loadUnread () {
      this.loading = true
      let response = await this.Nugget.load({ isSubscribed: 1, seenAt: null }).send()
      this.nuggets = response.models
      this.loading = false
    },
    async activateNugget (nugget) {
      let response = await this.Project.get(nugget.projectId).send()
      let project = response.models[0]
      let workflow = new this.Workflow({ id: project.workflowId })
      response = await workflow.listPhases().send()
      this.setPhasesOfSelectedWorkflow(response.models)
      this.selectNugget(nugget)
      nugget.see().send()
    },
    ...mapMutations([
      'selectNugget',
      'setPhasesOfSelectedWorkflow'
    ]),
    ...mapActions([
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
