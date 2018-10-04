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
    projects: [],
    viewMode: 'chat',
    sortCriteria: 'id'
  },
  actions: {
    listProjects ({ commit }) {
      server
        .request('projects')
        .setVerb('LIST')
        .sort(this.state.sortCriteria)
        .send()
        .then(resp => {
          commit('setProjects', resp.json)
          commit('selectProject', resp.json[0])
        }).catch()
    }
  },
  mutations: {
    selectProject (state, project) {
      state.selectedProject = project
    },
    setProjects (state, projects) {
      state.projects = projects
    },
    setSortCriteria (state, sortCriteria) {
      state.sortCriteria = sortCriteria
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
