<template>
  <div id="unread">

    <!-- HEADER -->

    <div class="header"></div>

    <!-- CONTENT -->

    <div class="content">

      <!-- LOADING -->

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!unreadNuggets.length"
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
        :nuggets="unreadNuggets"
        :selectAction="selectAction"
        :sortCriteria="unreadNuggetSortCriteria"
        :sortAction="sort"
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
      loading: false
    }
  },
  computed: {
    ...mapState([
      'unreadNuggets',
      'unreadNuggetSortCriteria',
      'Nugget',
      'Project',
      'Workflow',
      'Nugget'
    ])
  },
  methods: {
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
    sort (header) {
      this.setUnreadNuggetSortCriteria({
        field: header.field,
        descending: header.isActive ? !this.unreadNuggetSortCriteria.descending : false
      })
    },
    see (nugget) {
      nugget.see().send()
    },
    ...mapMutations([
      'setPhasesOfSelectedWorkflow',
      'setUnreadNuggetSortCriteria'
    ]),
    ...mapActions([
      'activateNugget',
      'listUnreadNuggets'
    ])
  },
  async mounted () {
    this.loading = true
    await this.listUnreadNuggets()
    this.loading = false
  },
  components: {
    Loading,
    NuggetTableView
  }
}
</script>
