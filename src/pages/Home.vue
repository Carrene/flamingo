<template>
  <div id="home" v-if="viewMode === 'chat'">
    <home-left-column />
    <div class="chat-container">
      <div class="header">
        <div class="search">
          <img src="../assets/search-icon.svg" class="search-icon" @click="showSearchResult = !showSearchResult"/>
          <input type="text" placeholder="SEARCH" class="primary-input">
          <div :class="notification ? 'notification' : null">
            <img src="../assets/notification-icon.svg" class="notification-icon"/>
          </div>
        </div>
        <div class="avatar" >
          <img src="../assets/avatar.svg" class="pic online"/>
          <img src="../assets/admin-icon.svg" class="role-icon" v-if="role === 'admin'"/>
          <img src="../assets/manager-icon.svg" class="role-icon" v-else-if="role === 'manager'"/>
          <img src="../assets/guest-icon.svg" class="role-icon" v-else-if="role === 'guest'"/>
          <img src="../assets/resource-icon.svg" class="role-icon" v-else-if="role === 'resource'"/>
        </div>
        <div class="search-result" v-if="showSearchResult">
          <div class="field">Images</div>
          <div class="field">Files</div>
          <div class="field">Conversation</div>
          <div class="field">Event Log</div>
          <div class="field">Members</div>
        </div>
      </div>
      <chat v-if="selectedProject.id"/>
      <div class="picture"  v-if="!selectedProject.id">
        <img src="../assets/new-project-picture.svg" class="img">
      </div>
    </div>
    <home-right-column/>
  </div>
</template>

<script>
import Vue from 'vue'
import HomeLeftColumn from '../components/HomeLeftColumn'
import HomeRightColumn from '../components/HomeRightColumn'
import Components from '@carrene/chatbox'
import { mapState, mapActions } from 'vuex'

Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})

export default {
  name: 'Home',
  data () {
    return {
      showSearchResult: false,
      showRightColumn: false,
      // TODO: Change below data to dynamic
      notification: true,
      role: 'admin'
    }
  },
  watch: {
    'selectedProject' (newValue) {
      if (newValue) {
        this.showRightColumn = true
      }
    }
  },
  computed: mapState([
    'viewMode', 'selectedProject'
  ]),
  methods: {
    ...mapActions(['listProjects'])
  },
  mounted () {
    this.listProjects()
  },
  components: {
    HomeLeftColumn,
    HomeRightColumn,
    ...Components
  }
}
</script>
