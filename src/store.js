import Vuex from 'vuex'
import Vue from 'vue'
import server from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: null,
    projects: [],
    nuggetsOfSelectedProject: [],
    viewMode: 'chat',
    theme: 'light',
    sortCriteria: 'title',
    editing: false,
    selectedScope: 'Projects',
    selectedNugget: null,
    nuggetClass: null,
    projectClass: null
  },
  actions: {
    listProjects ({ commit }) {
      server.metadata.models.Project
        .load()
        .sort(this.state.sortCriteria)
        .send()
        .then(resp => {
          commit('setProjects', resp.models)
          commit('selectProject', resp.models[0])
        }).catch()
    },
    listNuggets ({ commit }) {
      server.metadata.models.Issue
        .load('projectId', this.state.selectedProject.id)
        .sort(this.state.sortCriteria)
        .send()
        .then(resp => {
          commit('setNuggetsOfSelectedProject', resp.models)
          commit('selectNugget', resp.models[0])
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
    clearSelectedProject (state) {
      state.selectedProject = null
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
    },
    createNuggetClass (state) {
      if (!state.nuggetClass) {
        class Nugget extends server.metadata.models.Issue {}
        state.nuggetClass = Nugget
      }
    },
    createProjectClass (state) {
      if (!state.projectClass) {
        class Project extends server.metadata.models.Project {}
        state.projectClass = Project
      }
    }
  }
})
