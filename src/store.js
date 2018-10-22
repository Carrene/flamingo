import Vuex from 'vuex'
import Vue from 'vue'
import server from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: {
      id: null,
      description: '',
      title: null,
      dueDate: null,
      releaseId: null
    },
    projects: [],
    nuggetsOfSelectedProject: [],
    viewMode: 'chat',
    theme: 'light',
    sortCriteria: 'title',
    editing: false,
    selectedScope: 'Projects',
    selectedNugget: null
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
    },
    listNuggets ({ commit }) {
      server
        .request('issues')
        .setVerb('LIST')
        .sort(this.state.sortCriteria)
        .addQueryString('projectId', this.state.selectedProject.id)
        .send()
        .then(resp => {
          commit('setNuggetsOfSelectedProject', resp.json)
          commit('selectNugget', resp.json[0])
        })
    }
  },
  mutations: {
    // PROJECTS MUTATIONS
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
    clearSelected (state) {
      state.selectedProject = {
        id: null,
        description: '',
        title: null,
        dueDate: null}
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'chat' ? 'table' : 'chat'
    },
    changeTheme (state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setEditing (state, value) {
      state.editing = value
    },
    selectScope (state, value) {
      state.selectedScope = value
    },
    // NUGGETS MUTATIONS
    setNuggetsOfSelectedProject (state, value) {
      state.nuggetsOfSelectedProject = value
    },
    selectNugget (state, nugget) {
      state.selectedNugget = nugget
    },
    clearSelectedNugget (state) {
      state.selectedNugget = null
    }
  }
})
