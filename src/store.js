import Vuex from 'vuex'
import Vue from 'vue'
import { server } from './server'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: {
      description: '',
      title: null,
      dueDate: moment().format('MM/DD/YYYY'),
      releaseId: null
    },
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
          commit('selectProject', resp.json[0])
        })
    }
  },
  mutations: {
    selectProject (state, project) {
      state.selectedProject = project
    },
    setProjects (state, projects) {
      state.projects = projects
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'chat' ? 'table' : 'chat'
    },
    clearSelected (state) {
      state.selectedProject = {
        description: '',
        title: null,
        dueDate: moment().format('YYYY-MM-DD')}
    }
  }
})
