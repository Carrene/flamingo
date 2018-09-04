import Vuex from 'vuex'
import Vue from 'vue'
import server from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: null,
    projects: [],
    viewMode: 'chat'
  },
  mutations: {
    listProjects (state) {
      server
        .request('projects')
        .setVerb('LIST')
        .send()
        .then(resp => {
          state.projects = resp.json
          state.selectedProject = resp.json[0]
        })
    },
    selectProject (state, project) {
      state.selectedProject = project
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'chat' ? 'table' : 'chat'
    }
  }
})
