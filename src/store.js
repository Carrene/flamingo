import Vuex from 'vuex'
import Vue from 'vue'
import server from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: {},
    projects: null,
    viewMode: 'chat'
  },
  actions: {
    listProjects ({ commit }) {
      server
        .request('projects')
        .setVerb('LIST')
        .send()
        .then(resp => {
          commit('setProjects', resp.json)
          commit('setSelectProject', resp.json[0])
        })
    }
  },
  mutations: {
    setSelectProject (state, project) {
      state.selectedProject = project
    },
    setProjects (state, projects) {
      state.projects = projects
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'chat' ? 'table' : 'chat'
    },
    clearSelected (state) {
      state.selectedProject = {}
    }
  }
})
