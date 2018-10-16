import Vuex from 'vuex'
import Vue from 'vue'
import { server } from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: {
      description: '',
      title: null,
      dueDate: null,
      releaseId: null
    },
    projects: [],
    viewMode: 'chat',
    theme: 'light',
    sortCriteria: 'title',
    editing: false,
    selectedScope: 'Projects'
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
      state.editing = false
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
    changeTheme (state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    clearSelected (state) {
      state.selectedProject = {
        description: '',
        title: null,
        dueDate: null}
    },
    setEditing (state, value) {
      state.editing = value
    },
    selectScope (state, value) {
      state.selectedScope = value
    }
  }
})
