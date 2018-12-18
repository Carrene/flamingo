import Vuex from 'vuex'
import Vue from 'vue'
import router from './router'
import {
  default as server,
  casServer
} from './server'
import {
  SCOPES,
  APPLICATION_ID
} from './settings'

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
      field: 'createdAt',
      descending: false
    },
    projectFilters: {
      boardings: [],
      statuses: []
    },
    nuggetSortCriteria: {
      field: 'createdAt',
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
    Organization: null,
    OrganizationMember: null,
    CasMember: null,
    projectBoardings: ['on-time', 'delayed', 'at-risk', 'frozen'],
    projectStatuses: ['queued', 'active', 'on-hold', 'done'],
    nuggetBoardings: ['on-time', 'delayed', 'at-risk', 'paused'],
    nuggetStatuses: ['to-do', 'in-progress', 'on-hold', 'done', 'complete'],
    nuggetKinds: ['bug', 'feature']
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
        .sort(
          `${store.state.projectSortCriteria.descending ? '-' : ''}${
            store.state.projectSortCriteria.field
          }`
        )
        .send()
        .then(resp => {
          store.commit('setProjects', resp.models)
          if (resp.models.length) {
            if (selectedProjectId) {
              store.commit(
                'selectProject',
                resp.models.find(project => {
                  return project.id === parseInt(selectedProjectId)
                }) || resp.models[0]
              )
            } else {
              store.commit('selectProject', resp.models[0])
            }
          } else {
            store.commit('clearSelectedProject')
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
        .sort(
          `${store.state.nuggetSortCriteria.descending ? '-' : ''}${
            store.state.nuggetSortCriteria.field
          }`
        )
        .send()
        .then(resp => {
          store.commit('setNuggetsOfSelectedProject', resp.models)
          if (resp.models.length && selectedNuggetId) {
            store.commit(
              'selectNugget',
              resp.models.find(nugget => {
                return nugget.id === parseInt(selectedNuggetId)
              }) || resp.models[0]
            )
          } else {
            store.commit('clearSelectedNugget')
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

    // PROJECTS MUTATIONS

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
          attach (file, caption) {
            let request = this.constructor.__client__
              .requestModel(
                this.constructor,
                `${this.updateURL}/files`,
                this.constructor.__verbs__.attach
              )
              .setEncoding('multipart')
              .addParameter('attachment', file)
            if (caption) {
              request.addParameter('caption', caption)
            }
            return request
          }
          deleteAttachment (id) {
            return this.constructor.__client__.requestModel(
              this.constructor,
              `${this.updateURL}/files/${id}`,
              this.constructor.__verbs__.delete
            )
          }
          listAttachments () {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                `${this.updateURL}/files`,
                this.constructor.__verbs__.load
              )
              .sort('-createdAt')
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
        class Member extends server.metadata.models.Member {
          getOrganizations () {
            return this.constructor.__client__.requestModel(
              this.constructor,
              `${this.updateURL}/organizations`,
              this.constructor.__verbs__.load
            )
          }
        }
        state.Member = Member
      }
    },

    createOrganizationMemberClass (state) {
      if (!state.OrganizationMember) {
        class OrganizationMember extends server.metadata.models
          .OrganizationMember {}
        state.OrganizationMember = OrganizationMember
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
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.update
              )
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
    },

    // ORGANIZATIONS MUTATIONS

    createOrganizationClass (state) {
      if (!state.Organization) {
        class Organization extends server.metadata.models.Organization {
          invite (member) {
            let payload = {
              email: member.email,
              role: member.organizationRole,
              scopes: SCOPES.join(','),
              applicationId: APPLICATION_ID,
              redirectUri: window.location.origin
            }
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                `${this.updateURL}/invitations`,
                this.constructor.__verbs__.create
              )
              .addParameters(payload)
          }
        }
        state.Organization = Organization
      }
    }
  }
})
