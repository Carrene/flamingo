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
    viewMode: 'table',
    theme: 'light',
    sortCriteria: 'title',
    selectedScope: 'Projects',
    selectedNugget: null,
    Nugget: null,
    Project: null,
    Release: null,
    Member: null
  },
  getters: {
    activeRoom: state => {
      let roomObject = {
        roomId: null,
        isSubscribed: false
      }
      if (state.selectedScope === 'Projects') {
        if (state.selectedProject) {
          roomObject.roomId = state.selectedProject.roomId
          roomObject.isSubscribed = state.selectedProject.isSubscribed
        }
      } else if (state.selectedScope === 'Nuggets') {
        if (state.selectedNugget) {
          roomObject.roomId = state.selectedNugget.roomId
          roomObject.isSubscribed = state.selectedNugget.isSubscribed
        }
      }
      return roomObject
    }
  },
  actions: {
    listProjects (store, [selectedProjectId, done]) {
      store.state.Project
        .load()
        .sort(store.state.sortCriteria)
        .send()
        .then(resp => {
          store.commit('setProjects', resp.models)
          if (selectedProjectId) {
            store.commit('selectProject', resp.models.find(project => {
              return project.id === selectedProjectId
            }))
          } else {
            store.commit('selectProject', resp.models[0])
          }
          if (done) {
            done()
          }
        })
    },
    listNuggets (store, [selectedNuggetId, done]) {
      store.state.Nugget
        .load('projectId', store.state.selectedProject.id)
        .sort(store.state.sortCriteria)
        .send()
        .then(resp => {
          store.commit('setNuggetsOfSelectedProject', resp.models)
          if (selectedNuggetId) {
            store.commit('selectNugget', resp.models.find(nugget => {
              return nugget.id === selectedNuggetId
            }))
          } else {
            store.commit('selectNugget', resp.models[0])
          }
          if (done) {
            done()
          }
        })
    },
    listReleases ({ state, commit }) {
      return state.Release.load().send().then(resp => {
        commit('setReleases', resp.models)
      })
    }
  },
  mutations: {
    setSortCriteria (state, sortCriteria) {
      state.sortCriteria = sortCriteria
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'card' ? 'table' : 'card'
    },
    changeTheme (state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
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
            if (verb === 'UPDATE') {
              let allowedFields = ['title', 'days', 'dueDate', 'kind', 'description', 'status']
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            return data
          }
          subscribe () {
            return this.constructor.__client__
              .requestModel(this.constructor, this.updateURL, this.constructor.__verbs__.subscribe)
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          unsubscribe () {
            return this.constructor.__client__
              .requestModel(this.constructor, this.updateURL, this.constructor.__verbs__.unsubscribe)
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
        }
        state.Nugget = Nugget
      }
    },

    // PROJECTS MUTATIONS

    selectProject (state, project) {
      state.selectedProject = project
    },
    setProjects (state, projects) {
      state.projects = projects
    },
    clearSelectedProject (state) {
      state.selectedProject = null
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
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          unsubscribe () {
            return this.constructor.__client__
              .requestModel(this.constructor, this.updateURL, this.constructor.__verbs__.unsubscribe)
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
        }
        state.Project = Project
      }
    },

    // RELEASE MUTATIONS
    
    setReleases (state, releases) {
      state.releases = releases
    },
    createReleaseClass (state) {
      if (!state.Release) {
        class Release extends server.metadata.models.Release {}
        state.Release = Release
      }
    },

    // MEMBERS MUTATIONS

    createMemberClass (state) {
      if (!state.Member) {
        class Member extends server.metadata.models.Member {}
        state.Member = Member
      }
    }
  }
})
