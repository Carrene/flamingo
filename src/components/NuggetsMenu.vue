<template>
  <div id="nuggetsMenu">
    <ul class="menu">

      <li
        class="item"
        v-if="isSubscribeVisible || selectedNuggets.length !== 1"
        @click="subscription"
      >Subscribe</li>

      <li
        class="item"
        v-if="!isSubscribeVisible || selectedNuggets.length !== 1"
        @click="unSubscription"
      >Unsubscribe</li>

      <li
        class="item project"
        @mouseover="showingProjectSubmenu=true"
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
            @click="updatePrpject(project.id)"
          >
            {{ project.title }}
          </div>
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
            {{ priority }}
          </div>
        </div>
      </li>

      <li
        class="item status"
        @mouseover="showingStatusSubmenu=true"
        @mouseout="showingStatusSubmenu=false"
      >
        <p>Change Status</p>
        <simple-svg
          :filepath="require('@/assets/right-arrow.svg')"
          fill="#232323"
          class="arrow-icon"
        />
        <div
          class="submenu"
          v-if="showingStatusSubmenu"
        >
          <div
            class="submenu-item"
            v-for="status in nuggetStatuses"
            :key="status"
             @click="updateStatus(status)"
          >
            {{ status }}
          </div>
        </div>
      </li>

      <li class="item" @click="reportBug">Report Bug</li>

    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import server from './../server.js'

export default {
  name: 'NuggetsMenu',
  data () {
    return {
      showingProjectSubmenu: false,
      showingStatusSubmenu: false,
      showingPrioritySubmenu: false
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
      'projects',
      'nuggetPriorities',
      'nuggetStatuses',
      'selectedNuggets',
      'Nugget'
    ])
  },
  methods: {
    subscription () {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        jsonPatchRequest.addRequest(nugget.subscribe())
      }
      jsonPatchRequest.send().finally(() => {
        this.$emit('hideMenu')
      })
    },
    unSubscription () {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        jsonPatchRequest.addRequest(nugget.unsubscribe())
      }
      jsonPatchRequest.send().finally(() => {
        this.$emit('hideMenu')
      })
    },
    updatePrpject (projectId) {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        nugget.projectId = projectId
        jsonPatchRequest.addRequest(nugget.save())
      }
      jsonPatchRequest.send().then(resps => {
        this.listNuggets()
      }).finally(() => {
        this.$emit('hideMenu')
      })
    },
    updatePriority (priority) {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        nugget.priority = priority
        jsonPatchRequest.addRequest(nugget.save())
      }
      jsonPatchRequest.send().finally(() => {
        this.$emit('hideMenu')
      })
    },
    updateStatus (status) {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        nugget.priority = status
        jsonPatchRequest.addRequest(nugget.save())
      }
      jsonPatchRequest.send().finally(() => {
        this.$emit('hideMenu')
      })
    },
    reportBug () {
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let nugget of this.selectedNuggets) {
        nugget.kind = 'bug'
        jsonPatchRequest.addRequest(nugget.save())
      }
      jsonPatchRequest.send().finally(() => {
        this.$emit('hideMenu')
      })
    },
    ...mapActions([
      'listNuggets'
    ])
  },
  mounted () {
    this.$emit('mounted')
  }
}
</script>
