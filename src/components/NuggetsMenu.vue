<template>
  <div id="nuggetsMenu">
    <ul class="menu">

      <li
        class="item"
        v-if="isSubscribeVisible || selectedNuggets.length !== 1"
        @click="subscribe"
      >Subscribe</li>

      <li
        class="item"
        v-if="!isSubscribeVisible || selectedNuggets.length !== 1"
        @click="unsubscribe"
      >Unsubscribe</li>

      <li
        class="item project"
        @mouseover="showProjectSubmenu"
        @mouseout="showingProjectSubmenu=false"
      >
        <p>Change Project</p>
        <simple-svg
          :filepath="require('@/assets/right-arrow.svg')"
          fill="#232323"
          class="arrow-icon"
        />
        <div
          class="submenu"
          v-if="showingProjectSubmenu"
        >
          <div
            class="submenu-item"
            v-for="project in projects"
            :key="project.id"
            @click="updateProject(project.id)"
          >
            {{ project.title }}
          </div>
          <infinite-loading
            spinner="spiral"
            @infinite="infiniteHandler"
            :distance="1"
          >
            <div slot="spinner">
              <loading></loading>
            </div>
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
      </li>

      <li
        class="item priority"
        @mouseover="showingPrioritySubmenu=true"
        @mouseout="showingPrioritySubmenu=false"
      >
        <p>Change Priority</p>
        <simple-svg
          :filepath="require('@/assets/right-arrow.svg')"
          fill="#232323"
          class="arrow-icon"
        />
        <div
          class="submenu"
          v-if="showingPrioritySubmenu"
        >
          <div
            class="submenu-item"
            v-for="priority in nuggetPriorities"
            :key="priority"
            @click="updatePriority(priority)"
          >
            {{ priority.formatText() }}
          </div>
        </div>
      </li>

      <li
        class="item"
        @click="reportBug"
        v-if="selectedNuggets.length === 1 && selectedNuggets[0].kind === 'feature'"
      >Report Bug</li>

    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import server from './../server.js'
import InfiniteLoading from 'vue-infinite-loading'
import Loading from './../components/Loading'

export default {
  name: 'NuggetsMenu',
  data () {
    return {
      showingProjectSubmenu: false,
      showingStatusSubmenu: false,
      showingPrioritySubmenu: false,
      projects: [],
      pageIndex: 0,
      pageSize: 3
    }
  },
  computed: {
    isSubscribeVisible () {
      if (this.selectedNuggets.length === 1 && !this.selectedNuggets[0].isSubscribed) {
        return true
      } else if (this.selectedNuggets.length === 1 && this.selectedNuggets[0].isSubscribed) {
        return false
      }
    },
    ...mapState([
      'nuggetPriorities',
      'selectedNuggets',
      'Nugget',
      'Project'
    ])
  },
  methods: {
    async subscribe () {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        if (!nugget.isSubscribed) {
          jsonPatchRequest.addRequest(nugget.subscribe())
        }
      }
      if (jsonPatchRequest.requests.length) {
        await jsonPatchRequest.send()
        for (let nugget of this.selectedNuggets) {
          await nugget.reload().send()
        }
      }
      this.$emit('hideMenu')
    },
    async unsubscribe () {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        if (nugget.isSubscribed) {
          jsonPatchRequest.addRequest(nugget.unsubscribe())
        }
      }
      if (jsonPatchRequest.requests.length) {
        await jsonPatchRequest.send()
        for (let nugget of this.selectedNuggets) {
          await nugget.reload().send()
          this.setRefreshSubscriptionListToggle()
        }
      }
      this.$emit('hideMenu')
    },
    async updateProject (projectId) {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        nugget.projectId = projectId
        if (nugget.__status__ === 'dirty') {
          jsonPatchRequest.addRequest(nugget.save())
        }
      }
      if (jsonPatchRequest.requests.length) {
        await jsonPatchRequest.send()
        this.listNuggets({ selectedNuggetId: this.$route.params.nuggetId, searchQuery: this.nuggetSearchQuery })
      }
    },
    async updatePriority (priority) {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        if (nugget.priority !== priority) {
          nugget.priority = priority
          jsonPatchRequest.addRequest(nugget.save())
        }
      }
      await jsonPatchRequest.send()
      this.$emit('hideMenu')
    },
    async updateStatus (status) {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        if (nugget.status !== status) {
          nugget.status = status
          jsonPatchRequest.addRequest(nugget.save())
        }
      }
      await jsonPatchRequest.send()
      this.$emit('hideMenu')
    },
    async reportBug () {
      this.setRelatedIssueId(this.selectedNuggets[0].id)
      this.setRelatedProjectId(this.selectedNuggets[0].projectId)
      this.updateSelectedNuggets(this.selectedNuggets[0])
      this.$emit('hideMenu')
    },
    listProjects ($state) {
      this.Project.load()
        .skip(this.pageIndex * this.pageSize)
        .take(this.pageSize)
        .send().then(resp => {
          if (resp.models.length) {
            this.projects = this.projects.concat(resp.models)
            this.pageIndex++
            if ($state) {
              $state.loaded()
            }
          } else {
            if ($state) {
              $state.complete()
            }
          }
        })
    },
    infiniteHandler ($state) {
      this.listProjects($state)
    },
    showProjectSubmenu () {
      if (this.projects.length) {
        this.showingProjectSubmenu = true
      }
    },
    ...mapMutations([
      'setRefreshSubscriptionListToggle',
      'setRelatedIssueId',
      'setRelatedProjectId'
    ]),
    ...mapActions([
      'listNuggets',
      'updateSelectedNuggets'
    ])
  },
  mounted () {
    this.listProjects()
  },
  components: {
    InfiniteLoading,
    Loading
  }
}
</script>
