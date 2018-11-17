import Vuex from 'vuex'
import Vue from 'vue'
import server from './server'
import router from './router'

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
    Member: null
  },
  actions: {
    listContainers (store, [selectedContainerId, done]) {
      store.state.Container.load()
        .sort(store.state.sortCriteria)
        .send()
        .then(resp => {
          store.commit('setContainers', resp.models)
          if (selectedContainerId) {
            store.commit(
              'selectContainer',
              resp.models.find(container => {
                return container.id === parseInt(selectedContainerId)
              })
            )
          }
          if (done) {
            done()
          }
        })
    },
    async listNuggets (store, [containerId, selectedNuggetId, done]) {
      if (
        !store.state.selectedContainer ||
        store.state.selectedContainer.id !== parseInt(containerId)
      ) {
        await store.dispatch('getContainer', containerId)
      }
      store.state.Nugget.load('containerId', store.state.selectedContainer.id)
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
    async getContainer (store, containerId) {
      let resp = await store.state.Container.get(containerId).send()
      store.commit('selectContainer', resp.models[0])
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
      router.push({
        name: 'Nuggets',
        params: {
          containerId: state.selectedContainer.id,
          nuggetId: nugget.id
        }
      })
    },
    clearSelectedNugget (state) {
      state.selectedNugget = null
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
                'days',
                'containerId'
              ]
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            if (verb === this.constructor.__verbs__.update) {
              let allowedFields = [
                'title',
                'description',
                'dueDate',
                'kind',
                'days',
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

    selectContainer (state, container) {
      state.selectedContainer = container
      if (router.currentRoute.name === 'Containers') {
        router.push({
          name: 'Containers',
          params: {
            containerId: container.id
          }
        })
      }
    },
    setContainers (state, containers) {
      state.containers = containers
    },
    clearSelectedContainer (state) {
      state.selectedContainer = null
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
    }
  }
})
