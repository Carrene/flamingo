import Vuex from 'vuex'
import Vue from 'vue'
import router from './router'
import {
  default as server,
  casServer
} from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: null,
    projects: [],
    nuggetsOfSelectedProject: [],
    releases: [],
    viewMode: 'table',
    theme: 'light',
    projectSortCriteria: {
      field: 'title',
      descending: false
    },
    projectFilters: {
      boardings: [],
      statuses: []
    },
    nuggetSortCriteria: {
      field: 'title',
      descending: false
    },
    nuggetFilters: {
      isSubscribed: 'all',
      boardings: [],
      statuses: [],
      kinds: []
    },
    selectedNugget: null,
    Nugget: null,
    Project: null,
    Release: null,
    Member: null,
    CasMember: null,
    projectStatuses: ['queued', 'active', 'on-hold', 'done'],
    nuggetStatuses: ['to-do', 'in-progress', 'on-hold', 'done', 'complete'],
    nuggetKinds: ['bug', 'enhancement', 'feature'],
    boardings: ['on-time', 'delayed', 'frozen', 'at-risk']
  },
  getters: {
    computedProjectFilters (state) {
      let result = {}
      if (state.projectFilters.boardings.length) {
        result['boarding'] = `IN(${state.projectFilters.boardings.join(',')})`
      }
      if (state.projectFilters.statuses.length) {
        result['status'] = `IN(${state.projectFilters.statuses.join(',')})`
      }
      return result
    },
    computedNuggetFilters (state) {
      let result = {
        projectId: state.selectedProject ? state.selectedProject.id : null
      }
      if (state.nuggetFilters.isSubscribed !== 'all') {
        result['isSubscribed'] = state.nuggetFilters.isSubscribed
      }
      if (state.nuggetFilters.boardings.length) {
        result['boarding'] = `IN(${state.nuggetFilters.boardings.join(',')})`
      }
      if (state.nuggetFilters.statuses.length) {
        result['status'] = `IN(${state.nuggetFilters.statuses.join(',')})`
      }
      if (state.nuggetFilters.kinds.length) {
        result['kind'] = `IN(${state.nuggetFilters.kinds.join(',')})`
      }
      return result
    }
  },
  actions: {
    listProjects (store, [selectedProjectId, done]) {
      store.state.Project.load(store.getters.computedProjectFilters)
        .sort(`${store.state.projectSortCriteria.descending ? '-' : ''}${store.state.projectSortCriteria.field}`)
        .send()
        .then(resp => {
          store.commit('setProjects', resp.models)
          if (selectedProjectId) {
            store.commit(
              'selectProject',
              resp.models.find(project => {
                return project.id === parseInt(selectedProjectId)
              }) || store.dispatch('getProject', selectedProjectId)
            )
          }
          if (done) {
            done()
          }
        })
    },
    async listNuggets (store, [projectId, selectedNuggetId, done]) {
      if (
        !store.state.selectedProject ||
        store.state.selectedProject.id !== parseInt(projectId)
      ) {
        await store.dispatch('getProject', projectId)
      }
      store.state.Nugget.load(store.getters.computedNuggetFilters)
        .sort(`${store.state.nuggetSortCriteria.descending ? '-' : ''}${store.state.nuggetSortCriteria.field}`)
        .send()
        .then(resp => {
          store.commit('setNuggetsOfSelectedProject', resp.models)
          if (selectedNuggetId) {
            store.commit(
              'selectNugget',
              resp.models.find(nugget => {
                return nugget.id === parseInt(selectedNuggetId)
              }) || resp.models[0]
            )
          }
          if (done) {
            done()
          }
        })
    },
    listReleases ({
      state,
      commit
    }) {
      return state.Release.load()
        .send()
        .then(resp => {
          commit('setReleases', resp.models)
        })
    },
    async getProject (store, projectId) {
      let resp = await store.state.Project.get(projectId).send()
      store.commit('selectProject', resp.models[0])
    }
  },
  mutations: {
    setProjectSortCriteria (state, options) {
      state.projectSortCriteria.field = options.field
      state.projectSortCriteria.descending = options.descending
    },
    setProjectFilters (state, filters) {
      state.projectFilters = filters
    },
    setNuggetSortCriteria (state, options) {
      state.nuggetSortCriteria.field = options.field
      state.nuggetSortCriteria.descending = options.descending
    },
    setNuggetFilters (state, filters) {
      state.nuggetFilters = filters
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'card' ? 'table' : 'card'
    },
    changeTheme (state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },

    // NUGGETS MUTATIONS

    setNuggetsOfSelectedProject (state, value) {
      state.nuggetsOfSelectedProject = value
    },
    selectNugget (state, nugget) {
      state.selectedNugget = nugget
      if (router.currentRoute.name === 'Nuggets') {
        router.push({
          name: 'Nuggets',
          params: {
            projectId: state.selectedProject.id,
            nuggetId: nugget.id
          }
        })
      }
    },
    clearSelectedNugget (state) {
      state.selectedNugget = null
      if (router.currentRoute.name === 'Nuggets') {
        router.push({
          name: 'Nuggets',
          params: {
            projectId: state.selectedProject.id,
            nuggetId: null
          }
        })
      }
    },
    createNuggetClass (state) {
      if (!state.Nugget) {
        class Nugget extends server.metadata.models.Issue {
          prepareForSubmit (verb, url, data) {
            if (verb === this.constructor.__verbs__.create) {
              let allowedFields = [
                'title',
                'description',
                'dueDate',
                'kind',
                // FIXME: Delete this days is a computed value
                'days',
                'projectId',
                'status'
              ]
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
              // FIXME: Delete this days is a computed value
              data.days = 0
            }
            if (verb === this.constructor.__verbs__.update) {
              let allowedFields = [
                'title',
                'description',
                'dueDate',
                'kind',
                'status'
              ]
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
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.subscribe
              )
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          unsubscribe () {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.unsubscribe
              )
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
        }
        state.Nugget = Nugget
      }
    },

    // CONTAINERS MUTATIONS

    selectProject (state, project) {
      state.selectedProject = project
      if (router.currentRoute.name === 'Projects') {
        router.push({
          name: 'Projects',
          params: {
            projectId: project.id,
            nuggetId: null
          }
        })
      }
    },
    setProjects (state, projects) {
      state.projects = projects
    },
    clearSelectedProject (state) {
      state.selectedProject = null
      if (router.currentRoute.name === 'Projects') {
        router.push({
          name: 'Projects',
          params: {
            projectId: null,
            nuggetId: null
          }
        })
      }
    },
    createProjectClass (state) {
      if (!state.Project) {
        class Project extends server.metadata.models.Project {
          prepareForSubmit (verb, url, data) {
            if (verb === this.constructor.__verbs__.update) {
              let allowedFields = ['title', 'description', 'status']
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            if (verb === this.constructor.__verbs__.create) {
              let allowedFields = [
                'workflowId',
                'title',
                'description',
                'releaseId',
                'status'
              ]
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
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.subscribe
              )
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          unsubscribe () {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.unsubscribe
              )
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
    },

    // CAS MEMBERS MUTATIONS

    createCasMemberClass (state) {
      if (!state.CasMember) {
        class Member extends casServer.metadata.models.Member {
          prepareForSubmit (verb, url, data) {
            if (verb === this.constructor.__verbs__.update) {
              let allowedFields = ['name']
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            return data
          }
          updateAvatar (image) {
            return this.constructor.__client__
              .requestModel(this.constructor, this.updateURL, this.constructor.__verbs__.update)
              .setEncoding('multipart')
              .addParameter('avatar', image)
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
        }
        state.CasMember = Member
      }
    }
  }
})
