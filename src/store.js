import Vuex from 'vuex'
import Vue from 'vue'
import router from './router'
import { default as server, casServer } from './server'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedContainer: null,
    containers: [],
    nuggetsOfSelectedContainer: [],
    releases: [],
    viewMode: 'table',
    theme: 'light',
    sortCriteria: 'title',
    selectedNugget: null,
    Nugget: null,
    Container: null,
    Release: null,
    Member: null,
    CasMember: null
  },
  actions: {
    listProjects (store, [selectedProjectId, done]) {
      store.state.Project.load()
        .sort(store.state.sortCriteria)
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
      store.state.Nugget.load('projectId', store.state.selectedProject.id)
        .sort(store.state.sortCriteria)
        .send()
        .then(resp => {
          store.commit('setNuggetsOfSelectedContainer', resp.models)
          if (selectedNuggetId) {
            store.commit(
              'selectNugget',
              resp.models.find(nugget => {
                return nugget.id === parseInt(selectedNuggetId)
              })
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
    setSortCriteria (state, sortCriteria) {
      state.sortCriteria = sortCriteria
    },
    changeViewMode (state) {
      state.viewMode = state.viewMode === 'card' ? 'table' : 'card'
    },
    changeTheme (state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },

    // NUGGETS MUTATIONS

    setNuggetsOfSelectedContainer (state, value) {
      state.nuggetsOfSelectedContainer = value
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
                'projectId'
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
    setContainers (state, containers) {
      state.containers = containers
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
    createContainerClass (state) {
      if (!state.Container) {
        class Container extends server.metadata.models.Container {
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
        state.Container = Container
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
