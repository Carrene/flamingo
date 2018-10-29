import Vuex from 'vuex'
import Vue from 'vue'
import server from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: null,
    projects: [],
    nuggetsOfSelectedProject: [],
    releases: [],
    viewMode: 'chat',
    theme: 'light',
    sortCriteria: 'title',
    editing: false,
    selectedScope: 'Projects',
    selectedNugget: null,
    Nugget: null,
    Project: null,
    Release: null,
    Member: null
  },
  actions: {
    listProjects ({ state, commit }) {
      state.Project
        .load()
        .sort(state.sortCriteria)
        .send()
        .then(resp => {
          commit('setProjects', resp.models)
          commit('selectProject', resp.models[0])
        }).catch()
    },
    listNuggets ({ state, commit }) {
      state.Nugget
        .load('projectId', state.selectedProject.id)
        .sort(state.sortCriteria)
        .send()
        .then(resp => {
          commit('setNuggetsOfSelectedProject', resp.models)
          commit('selectNugget', resp.models[0])
        })
    },
    listReleases ({ state, commit }) {
      state.Release.load().send().then(resp => {
        commit('setReleases', resp.models)
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
    setReleases (state, releases) {
      state.releases = releases
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
      if (!state.Nugget) {
        class Nugget extends server.metadata.models.Issue {
          prepareForSubmit (verb, url, data) {
            if (verb === 'DEFINE') {
              delete data.type_
            }
            return data
          }
        }
        state.Nugget = Nugget
      }
    },
    createProjectClass (state) {
      if (!state.Project) {
        class Project extends server.metadata.models.Project {
          prepareForSubmit (verb, url, data) {
            if (verb === 'UPDATE') {
              let allowedFields = ['groupId', 'memberId', 'title', 'description', 'status']
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            if (verb === 'CREATE') {
              delete data.dueDate
              delete data.type_
              data.memberId = this.constructor.__client__.authenticator.member.id
            }
            return data
          }
          subscribe () {
            return this.constructor.__client__
              .requestModel(this.constructor, this.updateURL, this.constructor.__verbs__.subscribe)
              .addParameters(this.toJson())
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
        }
        state.Project = Project
      }
    },
    createReleaseClass (state) {
      if (!state.Release) {
        class Release extends server.metadata.models.Release {}
        state.Release = Release
      }
    },
    createMemberClass (state) {
      if (!state.Member) {
        class Member extends server.metadata.models.Member {}
        state.Member = Member
      }
    }
  }
})
