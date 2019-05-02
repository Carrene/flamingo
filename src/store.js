import Vuex from 'vuex'
import Vue from 'vue'
import { default as server, casServer, jaguarServer } from './server'
import { SCOPES, APPLICATION_ID } from './settings'
import router from './router'
import ViewState from './view-state'
import localDB from './localdb'

Vue.use(Vuex)

function initialState () {
  return {
    // MAIN ENTITIES

    releases: [],
    selectedRelease: null,
    projects: [],
    selectedProject: null,
    nuggetsOfSelectedProject: [],
    unreadNuggets: [],
    subscribedNuggets: [],
    selectedNuggets: [],
    events: [],
    eventTypes: [],
    roomId: null,
    currentTab: 'Unread',

    // FORM ENTITIES

    workflows: [],
    phasesOfSelectedWorkflow: [],
    tags: [],
    groups: [],
    skills: [],

    // FILTERING AND SORTING

    releaseSortCriteria: {
      field: 'title',
      descending: false
    },

    releaseFilters: {},

    projectSortCriteria: {
      field: 'title',
      descending: false
    },
    projectFilters: {
      boarding: [],
      status: []
    },
    nuggetSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    unreadNuggetSortCriteria: {
      field: 'modifiedAt',
      descending: true
    },
    subscribedNuggetSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    nuggetFilters: {
      isSubscribed: [],
      boarding: [],
      status: [],
      kind: [],
      phaseId: [],
      priority: [],
      tagId: []
    },
    unreadNuggetFilters: {
      isSubscribed: [],
      boarding: [],
      status: [],
      kind: [],
      phaseId: [],
      priority: [],
      tagId: []
    },
    subscribedNuggetFilters: {
      isSubscribed: [],
      boarding: [],
      status: [],
      kind: [],
      phaseId: [],
      priority: [],
      tagId: []
    },

    haveAnyNugget: false,
    haveAnyUnreadNugget: false,
    haveAnySubscribedNugget: false,
    haveAnyProject: false,
    haveAnyRelease: false,

    // VIEW STATE

    releasesViewState: new ViewState({}),
    projectsViewState: new ViewState({}),
    nuggetsViewState: new ViewState({}),
    unreadNuggetsViewState: new ViewState({}),
    subscribedNuggetsViewState: new ViewState({}),

    // MODELS

    Release: null,
    Project: null,
    Nugget: null,
    DraftNugget: null,
    Member: null,
    Organization: null,
    Tag: null,
    Workflow: null,
    Phase: null,
    Invitation: null,
    File: null,
    Resource: null,
    Group: null,
    CasMember: null,
    JaguarMessage: null,
    JaguarTarget: null,
    Skill: null,
    Event: null,
    EventType: null,

    // LOCAL FORM DATA

    projectBoardings: ['on-time', 'delayed', 'at-risk', 'frozen'],
    projectStatuses: ['queued', 'active', 'on-hold', 'done'],
    nuggetBoardings: ['on-time', 'delayed', 'at-risk', 'frozen'],
    nuggetStatuses: ['to-do', 'in-progress', 'on-hold', 'complete', 'done'],
    nuggetKinds: ['bug', 'feature'],
    nuggetPriorities: ['low', 'normal', 'high'],
    nuggetIsSubscribed: [
      {
        id: 0,
        title: 'Not Subscribed'
      },
      {
        id: 1,
        title: 'Subscribed'
      }
    ],

    // WEBSOCKET ENTITIES

    chatboxCallbackAttached: false,
    eventLogCallbackAttached: false,
    unreadCallbackAttached: false,
    mentionCallbackAttached: false,

    // OTHER

    nuggetsUnreadCount: null,
    eventLogUnreadCount: null,
    debug: true,
    refreshSubscriptionListToggle: false,
    relatedIssueId: null,
    relatedProjectId: null
  }
}

export default new Vuex.Store({
  state: initialState(),
  getters: {
    computedReleaseFilters (state) {
      let result = {}
      return result
    },

    computedProjectFilters (state) {
      let result = {}
      if (state.selectedRelease) {
        result.releaseId = state.selectedRelease.id
      }
      if (state.projectFilters.boarding.length) {
        result.boarding = `IN(${state.projectFilters.boarding.join(',')})`
      }
      if (state.projectFilters.status.length) {
        result.status = `IN(${state.projectFilters.status.join(',')})`
      }
      return result
    },

    computedNuggetFilters (state) {
      let result = {
        projectId: state.selectedProject ? state.selectedProject.id : null
      }
      if (state.nuggetFilters.isSubscribed.length) {
        result.isSubscribed = `IN(${state.nuggetFilters.isSubscribed.join(
          ','
        )})`
      }
      if (state.nuggetFilters.boarding.length) {
        result.boarding = `IN(${state.nuggetFilters.boarding.join(',')})`
      }
      if (state.nuggetFilters.status.length) {
        result.status = `IN(${state.nuggetFilters.status.join(',')})`
      }
      if (state.nuggetFilters.kind.length) {
        result.kind = `IN(${state.nuggetFilters.kind.join(',')})`
      }
      if (state.nuggetFilters.priority.length) {
        result.priority = `IN(${state.nuggetFilters.priority.join(',')})`
      }
      if (state.nuggetFilters.phaseId.length) {
        result.phaseId = `IN(${state.nuggetFilters.phaseId.join(',')})`
      }
      if (state.nuggetFilters.tagId.length) {
        result.tagId = `IN(${state.nuggetFilters.tagId.join(',')})`
      }
      return result
    },

    computedUnreadNuggetFilters (state) {
      let result = {
        unread: true
      }
      if (state.unreadNuggetFilters.isSubscribed.length) {
        result.isSubscribed = `IN(${state.unreadNuggetFilters.isSubscribed.join(
          ','
        )})`
      }
      if (state.unreadNuggetFilters.boarding.length) {
        result.boarding = `IN(${state.unreadNuggetFilters.boarding.join(',')})`
      }
      if (state.unreadNuggetFilters.status.length) {
        result.status = `IN(${state.unreadNuggetFilters.status.join(',')})`
      }
      if (state.unreadNuggetFilters.kind.length) {
        result.kind = `IN(${state.unreadNuggetFilters.kind.join(',')})`
      }
      if (state.unreadNuggetFilters.priority.length) {
        result.priority = `IN(${state.unreadNuggetFilters.priority.join(',')})`
      }
      if (state.unreadNuggetFilters.tagId.length) {
        result.tagId = `IN(${state.unreadNuggetFilters.tagId.join(',')})`
      }
      return result
    },

    computedSubscribedNuggetFilters (state) {
      let result = {
        isSubscribed: 1
      }
      if (state.subscribedNuggetFilters.isSubscribed.length) {
        result.isSubscribed = `IN(${state.subscribedNuggetFilters.isSubscribed.join(
          ','
        )})`
      }
      if (state.subscribedNuggetFilters.boarding.length) {
        result.boarding = `IN(${state.subscribedNuggetFilters.boarding.join(
          ','
        )})`
      }
      if (state.subscribedNuggetFilters.status.length) {
        result.status = `IN(${state.subscribedNuggetFilters.status.join(',')})`
      }
      if (state.subscribedNuggetFilters.kind.length) {
        result.kind = `IN(${state.subscribedNuggetFilters.kind.join(',')})`
      }
      if (state.subscribedNuggetFilters.priority.length) {
        result.priority = `IN(${state.subscribedNuggetFilters.priority.join(
          ','
        )})`
      }
      if (state.subscribedNuggetFilters.tagId.length) {
        result.tagId = `IN(${state.subscribedNuggetFilters.tagId.join(',')})`
      }
      return result
    },

    selectedProjectWorkflow (state) {
      if (state.selectedProject) {
        return new state.Workflow({
          id: state.selectedProject.workflowId
        })
      } else {
        return null
      }
    }
  },
  actions: {
    // RELEASE ACTIONS

    createReleaseClass ({ state, commit }) {
      if (!state.Release) {
        class Release extends server.metadata.models.Release {
          prepareForSubmit (verb, url, data) {
            if (verb === this.constructor.__verbs__.update) {
              let allowedFields = [
                'title',
                'status',
                'description',
                'cutoff',
                'launchDate',
                'groupId',
                'managerId'
              ]
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            if (verb === this.constructor.__verbs__.create) {
              let allowedFields = [
                'title',
                'status',
                'description',
                'cutoff',
                'launchDate',
                'managerId',
                'groupId'
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
        }
        commit('setReleaseClass', Release)
      }
    },

    async listReleases (store, selectedReleaseId) {
      let response = await store.state.Release.load(
        store.getters.computedReleaseFilters
      )
        .sort(
          `${store.state.releaseSortCriteria.descending ? '-' : ''}${
            store.state.releaseSortCriteria.field
          }`
        )
        .skip(
          store.state.releasesViewState.pageSize *
            (store.state.releasesViewState.page - 1)
        )
        .take(store.state.releasesViewState.pageSize)
        .send()
      store.commit('setReleases', response.models)
      store.commit('setReleasesViewState', { pageCount: response.totalPages })
      if (response.models.length) {
        store.commit('setHaveAnyRelease', true)
      }
      if (response.models.length && selectedReleaseId) {
        let release = response.models.find(release => {
          return release.id === parseInt(selectedReleaseId)
        })
        if (release) {
          await store.dispatch('activateRelease', {
            release: release,
            updateRoute: false
          })
        } else {
          await store.dispatch('activateRelease', {
            release: null
          })
        }
      } else {
        await store.dispatch('activateRelease', {
          release: null,
          updateRoute: false
        })
      }
      return response
    },

    async getRelease (store, releaseId) {
      let response = await store.state.Release.get(releaseId).send()
      await store.dispatch('activateRelease', {
        release: response.models[0],
        updateRoute: false
      })
      return response
    },

    async activateRelease (store, { release, updateRoute = true }) {
      if (release && !release.isSubscribed) {
        await release.subscribe().send()
      }
      if (updateRoute) {
        router.push({
          name: 'Releases',
          params: {
            releaseId: release ? release.id : null
          },
          query: store.state.releasesViewState.query
        })
      }
      store.commit('selectRelease', release)
    },

    async getReleaseTitle ({ state }, releaseId) {
      let record = await localDB.read('releases', releaseId)
      if (!record) {
        let resp = await state.Release.get(releaseId).send()
        try {
          await localDB.add('releases', resp.json.id, resp.json.title)
        } catch (error) {
        } finally {
          record = await localDB.read('releases', releaseId)
        }
      }
      return record.value
    },

    // PROJECT ACTIONS

    createProjectClass ({ state, commit }) {
      if (!state.Project) {
        class Project extends server.metadata.models.Project {
          prepareForSubmit (verb, url, data) {
            let allowedFields = [
              'title',
              'description',
              'status',
              'releaseId',
              'workflowId',
              'groupId',
              'managerId',
              'secondaryManagerId'
            ]
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            if (verb === this.constructor.__verbs__.update) {
              delete data.workflowId
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
            let request = state.File.__client__
              .requestModel(
                state.File,
                `${this.updateURL}/${state.File.__url__}`,
                state.File.__verbs__.attach
              )
              .setEncoding('multipart')
              .addParameter('attachment', file)
            if (caption) {
              request.addParameter('caption', caption)
            }
            return request
          }
          deleteAttachment (id) {
            return state.File.__client__.requestModel(
              state.File,
              `${this.updateURL}/${state.File.__url__}/${id}`,
              state.File.__verbs__.delete
            )
          }
          listAttachments () {
            return state.File.load(
              {},
              `${this.updateURL}/${state.File.__url__}`
            ).sort('-createdAt')
          }
        }
        commit('setProjectClass', Project)
      }
    },

    async listProjects (store, selectedProjectId) {
      let response = await store.state.Project.load(
        store.getters.computedProjectFilters
      )
        .sort(
          `${store.state.projectSortCriteria.descending ? '-' : ''}${
            store.state.projectSortCriteria.field
          }`
        )
        .skip(
          store.state.projectsViewState.pageSize *
            (store.state.projectsViewState.page - 1)
        )
        .take(store.state.projectsViewState.pageSize)
        .send()
      store.commit('setProjects', response.models)
      store.commit('setProjectsViewState', { pageCount: response.totalPages })
      if (response.models.length) {
        store.commit('setHaveAnyProject', true)
      }
      if (response.models.length && selectedProjectId) {
        let project = response.models.find(project => {
          return project.id === parseInt(selectedProjectId)
        })
        if (project) {
          await store.dispatch('activateProject', {
            project: project,
            updateRoute: false
          })
        } else {
          await store.dispatch('activateProject', {
            project: null
          })
        }
      } else {
        await store.dispatch('activateProject', {
          project: null,
          updateRoute: false
        })
      }
      return response
    },

    async getProject (store, projectId) {
      let response = await store.state.Project.get(projectId).send()
      await store.dispatch('activateProject', {
        project: response.models[0],
        updateRoute: false
      })
      return response
    },

    async activateProject (store, { project, updateRoute = true }) {
      if (project && !project.isSubscribed) {
        await project.subscribe().send()
      }
      if (store.state.selectedRelease && updateRoute) {
        router.push({
          name: 'Projects',
          params: {
            releaseId: store.state.selectedRelease.id,
            projectId: project ? project.id : null
          },
          query: store.state.projectsViewState.query
        })
      } else if (updateRoute) {
        router.push({
          name: 'ProjectsWithoutRelease',
          params: {
            projectId: project ? project.id : null
          },
          query: store.state.projectsViewState.query
        })
      }
      store.commit('selectProject', project)
      store.commit('resetNuggetFilters')
      store.commit('setHaveAnyNugget', false)
      return project
    },

    // NUGGET ACTIONS

    createNuggetClass ({ state, commit }) {
      if (!state.Nugget) {
        class Nugget extends server.metadata.models.Issue {
          get currentPhaseId () {
            if (this.items && this.items.length) {
              return this.items[this.items.length - 1].phaseId
            }
            return null
          }

          getPhase (phases) {
            return phases.find(phase => {
              return phase.id === this.currentPhaseId
            })
          }

          get assignees () {
            return this.items.reduce((accumulator, item) => {
              let resources = this.items
                .filter(_item => {
                  return _item.phaseId === item.phaseId
                })
                .map(_item => {
                  return _item.memberId
                })
              accumulator[item.phaseId] = resources
              return accumulator
            }, {})
          }

          get tagTitles () {
            return this.tags.map(tag => tag.title)
          }

          get resources () {
            if (this.items.length) {
              return this.items
                .filter(item => {
                  return item.phaseId === this.currentPhaseId
                })
                .map(item => {
                  return item.memberId
                })
            }
            return []
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
          static batchSubscribe (filter) {
            return this.__client__
              .requestModel(this, this.__url__, this.__verbs__.subscribe)
              .filter(filter)
          }
          assign (phaseId, memberId) {
            let request = this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.assign
              )
              .addParameter('phaseId', phaseId)
            if (memberId) {
              request.addParameter('memberId', memberId)
            }
            return request.setPostProcessor((resp, resolve) => {
              this.updateFromResponse(resp)
              resolve(resp)
            })
          }
          unAssign (phaseId, memberId) {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.unAssign
              )
              .addParameters({
                phaseId: phaseId,
                memberId: memberId
              })
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          addTag (tagId) {
            return state.Tag.__client__.requestModel(
              state.Tag,
              `${this.updateURL}/${state.Tag.__url__}/${tagId}`,
              state.Tag.__verbs__.add
            )
          }
          removeTag (tagId) {
            return state.Tag.__client__.requestModel(
              state.Tag,
              `${this.updateURL}/${state.Tag.__url__}/${tagId}`,
              state.Tag.__verbs__.remove
            )
          }
          relateNugget (targetIssueId) {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.relate
              )
              .addParameter('targetIssueId', targetIssueId)
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          unrelateNugget (targetIssueId) {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.unrelate
              )
              .addParameter('targetIssueId', targetIssueId)
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          see () {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.see
              )
              .setPostProcessor((resp, resolve) => {
                this.updateFromResponse(resp)
                resolve(resp)
              })
          }
          async getUnreadEventLogCount () {
            let response = await state.JaguarMessage.load(
              {
                mimetype: 'application/x-auditlog',
                seenAt: null,
                isMine: false
              },
              `${state.JaguarTarget.__url__}/${this.roomId}/${
                state.JaguarMessage.__url__
              }`
            ).send()
            commit('setEventLogUnreadCount', response.totalCount)
          }
          attach (file, caption) {
            let request = state.File.__client__
              .requestModel(
                state.File,
                `${this.updateURL}/${state.File.__url__}`,
                state.File.__verbs__.attach
              )
              .setEncoding('multipart')
              .addParameter('attachment', file)
            if (caption) {
              request.addParameter('caption', caption)
            }
            return request
          }
          deleteAttachment (id) {
            return state.File.__client__.requestModel(
              state.File,
              `${this.updateURL}/${state.File.__url__}/${id}`,
              state.File.__verbs__.delete
            )
          }
          listAttachments () {
            return state.File.load(
              {},
              `${this.updateURL}/${state.File.__url__}`
            ).sort('-createdAt')
          }
          moveProject (projectId) {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.move
              )
              .addParameter('projectId', projectId)
          }
        }
        commit('setNuggetClass', Nugget)
      }
    },

    async listNuggets (store, selectedNuggetId) {
      let response = await store.state.Nugget.load(
        store.getters.computedNuggetFilters
      )
        .sort(
          `${store.state.nuggetSortCriteria.descending ? '-' : ''}${
            store.state.nuggetSortCriteria.field
          }`
        )
        .skip(
          store.state.nuggetsViewState.pageSize *
            (store.state.nuggetsViewState.page - 1)
        )
        .take(store.state.nuggetsViewState.pageSize)
        .send()
      store.commit('setNuggetsOfSelectedProject', response.models)
      store.commit('setNuggetsViewState', { pageCount: response.totalPages })
      if (response.models.length) {
        store.commit('setHaveAnyNugget', true)
      }
      if (response.models.length && selectedNuggetId) {
        let nugget = response.models.find(nugget => {
          return nugget.id === parseInt(selectedNuggetId)
        })
        if (nugget) {
          await store.dispatch('activateNugget', {
            nugget: nugget,
            updateRoute: false
          })
        } else {
          await store.dispatch('activateNugget', {
            nugget: null
          })
        }
      } else {
        await store.dispatch('activateNugget', {
          nugget: null,
          updateRoute: false
        })
      }
      return response
    },

    async listUnreadNuggets (store) {
      let response = await store.state.Nugget.load(
        store.getters.computedUnreadNuggetFilters
      )
        .sort(
          `${store.state.unreadNuggetSortCriteria.descending ? '-' : ''}${
            store.state.unreadNuggetSortCriteria.field
          }`
        )
        .skip(
          store.state.unreadNuggetsViewState.pageSize *
            (store.state.unreadNuggetsViewState.page - 1)
        )
        .take(store.state.unreadNuggetsViewState.pageSize)
        .send()
      store.commit('setUnreadNuggetsViewState', {
        pageCount: response.totalPages
      })
      store.commit('setUnreadNuggets', response.models)
      store.commit('setNuggetsUnreadCount', response.totalCount)
      if (response.models.length) {
        store.commit('setHaveAnyUnreadNugget', true)
      }
      return response
    },

    async listSubscribedNuggets (store, selectedNuggetId) {
      let response = await store.state.Nugget.load(
        store.getters.computedSubscribedNuggetFilters
      )
        .sort(
          `${store.state.subscribedNuggetSortCriteria.descending ? '-' : ''}${
            store.state.subscribedNuggetSortCriteria.field
          }`
        )
        .skip(
          store.state.subscribedNuggetsViewState.pageSize *
            (store.state.subscribedNuggetsViewState.page - 1)
        )
        .take(store.state.subscribedNuggetsViewState.pageSize)
        .send()
      store.commit('setSubscribedNuggetsViewState', {
        pageCount: response.totalPages
      })
      store.commit('setSubscribedNuggets', response.models)
      if (response.models.length) {
        store.commit('setHaveAnySubscribedNugget', true)
      }
      if (response.models.length && selectedNuggetId) {
        let nugget = response.models.find(nugget => {
          return nugget.id === parseInt(selectedNuggetId)
        })
        if (nugget) {
          await store.dispatch('activateNugget', {
            nugget: nugget,
            updateRoute: false
          })
        } else {
          await store.dispatch('activateNugget', {
            nugget: null
          })
        }
      } else {
        await store.dispatch('activateNugget', {
          nugget: null,
          updateRoute: false
        })
      }
      return response
    },

    async activateNugget (store, { nugget, updateRoute = true }) {
      if (nugget) {
        await nugget.getUnreadEventLogCount()
        if (!nugget.seenAt) {
          await nugget.see(nugget).send()
          store.commit(
            'setNuggetsUnreadCount',
            store.state.nuggetsUnreadCount - 1
          )
        }
      }
      if (
        store.state.selectedRelease &&
        updateRoute &&
        store.state.currentTab !== 'Unread' &&
        store.state.currentTab !== 'Subscribed'
      ) {
        router.push({
          name: 'Nuggets',
          params: {
            releaseId: store.state.selectedRelease.id,
            projectId: store.state.selectedProject.id,
            nuggetId: nugget ? nugget.id : null
          },
          query: store.state.nuggetsViewState.query
        })
      } else if (
        updateRoute &&
        store.state.selectedProject &&
        store.state.currentTab !== 'Unread' &&
        store.state.currentTab !== 'Subscribed'
      ) {
        router.push({
          name: 'NuggetsWithoutRelease',
          params: {
            projectId: store.state.selectedProject.id,
            nuggetId: nugget ? nugget.id : null
          },
          query: store.state.nuggetsViewState.query
        })
      } else if (updateRoute && store.state.currentTab !== 'Unread') {
        router.push({
          name: 'Subscribed',
          params: {
            subscribedId: nugget ? nugget.id : null
          },
          query: store.state.subscribedNuggetsViewState.query
        })
      } else if (updateRoute && store.state.currentTab !== 'Subscribed') {
        router.push({
          name: 'Unread',
          params: {
            nuggetId: nugget ? nugget.id : null
          },
          query: store.state.subscribedNuggetsViewState.query
        })
      }
      store.commit('selectNuggets', nugget ? [nugget] : [])
    },

    updateSelectedNuggets (store, requestedNugget) {
      let nuggetAlreadySelected = store.state.selectedNuggets.some(nugget => {
        return requestedNugget.id === nugget.id
      })
      let newArray
      if (nuggetAlreadySelected) {
        newArray = store.state.selectedNuggets.filter(nugget => {
          return nugget.id !== requestedNugget.id
        })
      } else {
        newArray = store.state.selectedNuggets.concat(requestedNugget)
      }
      if (router.currentRoute.name.match('Nuggets')) {
        if (store.state.selectedRelease) {
          router.push({
            name: 'Nuggets',
            params: {
              releaseId: store.state.selectedRelease.id,
              projectId: store.state.selectedProject.id,
              nuggetId: newArray.length === 1 ? newArray[0].id : null
            },
            query: store.state.nuggetsViewState.query
          })
        } else {
          router.push({
            name: 'NuggetsWithoutRelease',
            params: {
              projectId: store.state.selectedProject.id,
              nuggetId: newArray.length === 1 ? newArray[0].id : null
            },
            query: store.state.nuggetsViewState.query
          })
        }
      }
      store.commit('selectNuggets', newArray)
    },

    // DRAFT NUGGET ACTIONS

    createDraftNuggetClass ({ state, commit }) {
      if (!state.DraftNugget) {
        class DraftNugget extends server.metadata.models.DraftIssue {
          prepareForSubmit (verb, url, data) {
            // FIXME: this should not be necessary
            if (
              [
                this.constructor.__verbs__.create,
                this.constructor.__verbs__.finalize
              ].includes(verb)
            ) {
              // FIXME: days is a calculated value
              data.days = 0
            }
            return data
          }
          addTag (tagId) {
            return state.Tag.__client__.requestModel(
              state.Tag,
              `${this.updateURL}/${state.Tag.__url__}/${tagId}`,
              state.Tag.__verbs__.add
            )
          }
          removeTag (tagId) {
            return state.Tag.__client__.requestModel(
              state.Tag,
              `${this.updateURL}/${state.Tag.__url__}/${tagId}`,
              state.Tag.__verbs__.remove
            )
          }
          relateNugget (targetIssueId) {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.relate
              )
              .addParameter('targetIssueId', targetIssueId)
          }
          finalize () {
            let data = this.prepareForSubmit(
              this.constructor.__verbs__.finalize,
              this.updateUrl,
              this.toJson(true)
            )
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.finalize
              )
              .addParameters(data)
          }
        }
        commit('setDraftNuggetClass', DraftNugget)
      }
    },

    // GROUP ACTIONS

    createGroupClass ({ state, commit }) {
      if (!state.Group) {
        class Group extends server.metadata.models.Group {
          prepareForSubmit (verb, url, data) {
            let allowedFields = ['title', 'description']
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            return data
          }
        }
        commit('setGroupClass', Group)
      }
    },

    async listGroups (store) {
      let response = await store.state.Group.load().send()
      store.commit('setGroups', response.models)
      return response
    },

    async getGroupTitle ({ state }, groupId) {
      let record = await localDB.read('groups', groupId)
      if (!record) {
        let resp = await state.Group.get(groupId).send()
        try {
          await localDB.add('groups', resp.json.id, resp.json.title)
        } catch (error) {
        } finally {
          record = await localDB.read('groups', groupId)
        }
      }
      return record.value
    },

    // SKILL ACTIONS

    createSkillClass ({ state, commit }) {
      if (!state.Skill) {
        class Skill extends server.metadata.models.Skill {
          prepareForSubmit (verb, url, data) {
            let allowedFields = ['title', 'description']
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            return data
          }
        }
        commit('setSkillClass', Skill)
      }
    },

    async listSkills (store) {
      let response = await store.state.Skill.load().send()
      store.commit('setSkills', response.models)
      return response
    },

    // MEMBER ACTIONS

    createMemberClass ({ state, commit }) {
      if (!state.Member) {
        class Member extends server.metadata.models.Member {
          listOrganizations () {
            return state.Organization.load(
              {},
              `${this.updateURL}/${state.Organization.__url__}`
            )
          }
          denySkill (memberId, skillId) {
            return state.Member.__client__.requestModel(
              state.Member,
              `${state.Member.__url__}/${memberId}/${
                state.Skill.__url__
              }/${skillId}`,
              state.Member.__verbs__.deny
            )
          }
          grantSkill (memberId, skillId) {
            return state.Member.__client__.requestModel(
              state.Member,
              `${state.Member.__url__}/${memberId}/${
                state.Skill.__url__
              }/${skillId}`,
              state.Member.__verbs__.grant
            )
          }
          addToGroup (groupId) {
            return state.Member.__client__
              .requestModel(
                state.Member,
                `${state.Group.__url__}/${groupId}`,
                state.Member.__verbs__.add
              )
              .addParameters({ memberId: this.id })
          }
          removeFromGroup (groupId) {
            return state.Member.__client__
              .requestModel(
                state.Member,
                `${state.Group.__url__}/${groupId}`,
                state.Member.__verbs__.remove
              )
              .addParameters({ memberId: this.id })
          }
        }
        commit('setMemberClass', Member)
      }
    },

    async getManagerTitle ({ state, commit }, managerId) {
      let record = await localDB.read('managers', managerId)
      if (!record) {
        let resp = await state.Member.get(managerId).send()
        try {
          await localDB.add('managers', resp.json.id, resp.json.title)
        } catch (error) {
        } finally {
          record = await localDB.read('managers', managerId)
        }
      }
      return record.value
    },

    // TAG ACTIONS

    createTagClass ({ state, commit }) {
      if (!state.Tag) {
        class Tag extends server.metadata.models.Tag {}
        commit('setTagClass', Tag)
      }
    },

    async listTags (store) {
      let response = await store.state.Tag.load().send()
      store.commit('setTags', response.models)
      return response
    },

    // WORKFLOW ACTIONS

    createWorkflowClass ({ state, commit }) {
      if (!state.Workflow) {
        class Workflow extends server.metadata.models.Workflow {
          prepareForSubmit (verb, url, data) {
            let allowedFields = ['title', 'description']
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            return data
          }
          listPhases () {
            return state.Phase.load(
              {},
              `${this.updateURL}/${state.Phase.__url__}`
            )
          }
        }
        commit('setWorkflowClass', Workflow)
      }
    },

    async listWorkflows ({ state, commit }) {
      let response = await state.Workflow.load().send()
      commit('setWorkflows', response.models)
      return response
    },

    async getWorkflowTitle ({ state }, workflowId) {
      let record = await localDB.read('workflows', workflowId)
      if (!record) {
        let resp = await state.Workflow.get(workflowId).send()
        try {
          await localDB.add('workflows', resp.json.id, resp.json.title)
        } catch (error) {
        } finally {
          record = await localDB.read('workflows', workflowId)
        }
      }
      return record.value
    },

    // PHASE ACTIONS

    createPhaseClass ({ state, commit }) {
      if (!state.Phase) {
        class Phase extends server.metadata.models.Phase {
          prepareForSubmit (verb, url, data) {
            let allowedFields = ['title', 'description', 'skillId', 'order']
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            return data
          }
          listResources () {
            return state.Resource.load(
              {},
              `${this.updateURL}/${state.Resource.__url__}`
            )
          }
          createPhase (workflowId) {
            let data = this.prepareForSubmit(
              undefined,
              undefined,
              this.toJson(true)
            )
            return this.constructor.__client__
              .requestModel(
                state.Phase,
                `${state.Workflow.__url__}/${workflowId}/${
                  this.constructor.__url__
                }`,
                state.Phase.__verbs__.create
              )
              .addParameters(data)
          }
          updatePhase () {
            let data = this.prepareForSubmit(
              undefined,
              undefined,
              this.toJson(true)
            )
            return this.constructor.__client__
              .requestModel(
                state.Phase,
                `${state.Workflow.__url__}/${this.workflowId}/${
                  this.updateURL
                }`,
                state.Phase.__verbs__.update
              )
              .addParameters(data)
          }
        }
        commit('setPhaseClass', Phase)
      }
    },

    async listPhases ({ state, getters, commit }) {
      let response = await getters.selectedProjectWorkflow.listPhases().send()
      commit('setPhasesOfSelectedWorkflow', response.models)
      return response
    },

    // EVENT ACTIONS

    createEventClass ({ state, commit }) {
      if (!state.Event) {
        class Event extends server.metadata.models.Event {
          prepareForSubmit (verb, url, data) {
            let allowedFields = ['title', 'startDate', 'endDate', 'eventTypeId', 'repeat']
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            return data
          }
        }
        commit('setEventClass', Event)
      }
    },

    async listEvents ({ state, commit }) {
      let response = await state.Event.load().send()
      commit('setEvents', response.models)
      return response
    },

    // EVENT TYPE ACTIONS

    createEventTypeClass ({ state, commit }) {
      if (!state.EventType) {
        class EventType extends server.metadata.models.EventType {}
        commit('setEventTypeClass', EventType)
      }
    },
    async listEventTypes ({ state, commit }) {
      let response = await state.EventType.load().send()
      commit('setEventTypes', response.models)
      return response
    },

    // CAS MEMBER ACTIONS

    createCasMemberClass ({ state, commit }) {
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
        commit('setCasMemberClass', Member)
      }
    },

    // ORGANIZATION ACTIONS

    createOrganizationClass ({ state, commit }) {
      if (!state.Organization) {
        class Organization extends server.metadata.models.Organization {
          listMembers () {
            return state.Member.load({}, `${this.updateURL}/members`)
          }
          invite (member) {
            let payload = {
              email: member.email,
              role: member.organizationRole,
              scopes: SCOPES.join(','),
              applicationId: APPLICATION_ID,
              redirectUri: window.location.origin
            }
            return state.Invitation.__client__
              .requestModel(
                state.Invitation,
                `${this.updateURL}/${state.Invitation.__url__}`,
                state.Invitation.__verbs__.create
              )
              .addParameters(payload)
          }
        }
        commit('setOrganizationClass', Organization)
      }
    },

    // RESOURCE ACTIONS

    createResourceClass ({ state, commit }) {
      if (!state.Resource) {
        class Resource extends server.metadata.models.Resource {}
        commit('setResourceClass', Resource)
      }
    },

    // FILE ACTIONS

    createFileClass ({ state, commit }) {
      if (!state.File) {
        class File extends server.metadata.models.File {}
        commit('setFileClass', File)
      }
    },

    // INVITATION ACTIONS

    createInvitationClass ({ state, commit }) {
      if (!state.Invitation) {
        class Invitation extends server.metadata.models.Invitation {}
        commit('setInvitationClass', Invitation)
      }
    },

    // JAGUAR MESSAGE ACTIONS

    createJaguarMessageClass ({ state, commit }) {
      if (!state.JaguarMessage) {
        class Message extends jaguarServer.metadata.models.Message {}
        commit('setJaguarMessageClass', Message)
      }
    },

    // JAGUAR TARGET ACTIONS

    createJaguarTargetClass ({ state, commit }) {
      if (!state.JaguarTarget) {
        class Target extends jaguarServer.metadata.models.Target {}
        commit('setJaguarTargetClass', Target)
      }
    }
  },
  mutations: {
    // RELEASE MUTATIONS

    setReleases (state, releases) {
      state.releases = releases
    },

    setReleaseClass (state, releaseClass) {
      state.Release = releaseClass
    },

    selectRelease (state, release) {
      state.selectedRelease = release
    },

    setReleaseSortCriteria (state, options) {
      state.releaseSortCriteria.field = options.field
      state.releaseSortCriteria.descending = options.descending
    },

    setReleaseFilters (state, filters) {
      state.releaseFilters = Object.assign({}, state.releaseFilters, filters)
    },

    setReleasesViewState (state, viewState) {
      let newViewState = Object.assign({}, state.releasesViewState, viewState)
      state.releasesViewState = new ViewState(newViewState)
    },

    setHaveAnyRelease (state, flag) {
      state.haveAnyRelease = flag
    },

    // PROJECT MUTATIONS

    setProjects (state, projects) {
      state.projects = projects
    },

    selectProject (state, project) {
      state.selectedProject = project
    },

    setProjectClass (state, projectClass) {
      state.Project = projectClass
    },

    setProjectSortCriteria (state, options) {
      state.projectSortCriteria.field = options.field
      state.projectSortCriteria.descending = options.descending
    },

    setProjectFilters (state, filters) {
      state.projectFilters = Object.assign({}, state.projectFilters, filters)
    },

    setProjectsViewState (state, viewState) {
      let newViewState = Object.assign({}, state.projectsViewState, viewState)
      state.projectsViewState = new ViewState(newViewState)
    },

    setHaveAnyProject (state, flag) {
      state.haveAnyProject = flag
    },

    // NUGGET MUTATIONS

    setNuggetsOfSelectedProject (state, nuggets) {
      state.nuggetsOfSelectedProject = nuggets
    },

    setUnreadNuggets (state, nuggets) {
      state.unreadNuggets = nuggets
    },

    setSubscribedNuggets (state, nuggets) {
      state.subscribedNuggets = nuggets
    },

    selectNuggets (state, nuggets) {
      state.selectedNuggets = nuggets
    },

    setNuggetSortCriteria (state, options) {
      state.nuggetSortCriteria.field = options.field
      state.nuggetSortCriteria.descending = options.descending
    },

    setUnreadNuggetSortCriteria (state, options) {
      state.unreadNuggetSortCriteria.field = options.field
      state.unreadNuggetSortCriteria.descending = options.descending
    },

    setSubscribedNuggetSortCriteria (state, options) {
      state.subscribedNuggetSortCriteria.field = options.field
      state.subscribedNuggetSortCriteria.descending = options.descending
    },

    setNuggetFilters (state, filters) {
      state.nuggetFilters = Object.assign({}, state.nuggetFilters, filters)
    },

    resetNuggetFilters (state) {
      state.nuggetFilters = initialState().nuggetFilters
    },

    setUnreadNuggetFilters (state, filters) {
      state.unreadNuggetFilters = Object.assign(
        {},
        state.unreadNuggetFilters,
        filters
      )
    },

    setSubscribedNuggetFilters (state, filters) {
      state.subscribedNuggetFilters = Object.assign(
        {},
        state.subscribedNuggetFilters,
        filters
      )
    },

    setNuggetClass (state, nuggetClass) {
      state.Nugget = nuggetClass
    },

    setNuggetsViewState (state, viewState) {
      let newViewState = Object.assign({}, state.nuggetsViewState, viewState)
      state.nuggetsViewState = new ViewState(newViewState)
    },

    setUnreadNuggetsViewState (state, viewState) {
      let newViewState = Object.assign(
        {},
        state.unreadNuggetsViewState,
        viewState
      )
      state.unreadNuggetsViewState = new ViewState(newViewState)
    },

    setSubscribedNuggetsViewState (state, viewState) {
      let newViewState = Object.assign(
        {},
        state.subscribedNuggetsViewState,
        viewState
      )
      state.subscribedNuggetsViewState = new ViewState(newViewState)
    },

    setHaveAnyNugget (state, flag) {
      state.haveAnyNugget = flag
    },

    setHaveAnyUnreadNugget (state, flag) {
      state.haveAnyUnreadNugget = flag
    },

    setHaveAnySubscribedNugget (state, flag) {
      state.haveAnySubscribedNugget = flag
    },

    setRelatedIssueId (state, id) {
      state.relatedIssueId = id
    },

    setRelatedProjectId (state, id) {
      state.relatedProjectId = id
    },

    // DRAFT NUGGET MUTATIONS

    setDraftNuggetClass (state, draftNuggetClass) {
      state.DraftNugget = draftNuggetClass
    },

    // SUBSCRIBED MUTATIONS

    setRefreshSubscriptionListToggle (state) {
      state.refreshSubscriptionListToggle = !state.refreshSubscriptionListToggle
    },

    // MEMBER MUTATIONS

    setMemberClass (state, memberClass) {
      state.Member = memberClass
    },

    // WORKFLOW MUTATIONS

    setWorkflowClass (state, workflowClass) {
      state.Workflow = workflowClass
    },

    setWorkflows (state, workflows) {
      state.workflows = workflows
    },

    // PHASE MUTATIONS

    setPhaseClass (state, phaseClass) {
      state.Phase = phaseClass
    },

    setPhasesOfSelectedWorkflow (state, phases) {
      state.phasesOfSelectedWorkflow = phases
    },

    // TAG MUTATIONS

    setTagClass (state, tagClass) {
      state.Tag = tagClass
    },

    setTags (state, tags) {
      state.tags = tags
    },

    // EVENT MUTATIONS

    setEventClass (state, eventClass) {
      state.Event = eventClass
    },

    setEvents (state, events) {
      state.events = events
    },

    // EVENT TYPE MUTATIONS

    setEventTypeClass (state, eventTypeClass) {
      state.EventType = eventTypeClass
    },

    setEventTypes (state, eventTypes) {
      state.eventTypes = eventTypes
    },

    // CAS MEMBER MUTATIONS

    setCasMemberClass (state, casMemberClass) {
      state.CasMember = casMemberClass
    },

    // ORGANIZATION MUTATIONS

    setOrganizationClass (state, organizationClass) {
      state.Organization = organizationClass
    },

    // FILE MUTATIONS

    setFileClass (state, fileClass) {
      state.File = fileClass
    },

    // INVITATION MUTATIONs

    setInvitationClass (state, invitationClass) {
      state.Invitation = invitationClass
    },

    // RESOURCE MUTATIONS

    setResourceClass (state, resourceClass) {
      state.Resource = resourceClass
    },

    // GROUP MUTATIONS

    setGroupClass (state, groupClass) {
      state.Group = groupClass
    },

    setGroups (state, groups) {
      state.groups = groups
    },

    // Skill MUTATIONS

    setSkillClass (state, skillClass) {
      state.Skill = skillClass
    },

    setSkills (state, skills) {
      state.skills = skills
    },

    // JAGUAR MESSAGE MUTATIONS

    setJaguarMessageClass (state, jaguarMessageClass) {
      state.JaguarMessage = jaguarMessageClass
    },

    // JAGUAR TARGET MUTATIONS

    setJaguarTargetClass (state, jaguarTargetClass) {
      state.JaguarTarget = jaguarTargetClass
    },

    // ROOM ID MUTATIONS

    setRoomId (state, roomId) {
      state.roomId = roomId
    },

    // WEBSOCKET MUTATIONS

    attachChatboxCallback (state) {
      state.chatboxCallbackAttached = true
    },

    attachEventLogCallback (state) {
      state.eventLogCallbackAttached = true
    },

    updateUnreadCallbackAttachment (state, value) {
      state.unreadCallbackAttached = value
    },

    attachMentionCallback (state) {
      state.mentionCallbackAttached = true
    },

    setNuggetsUnreadCount (state, count) {
      state.nuggetsUnreadCount = count
    },

    setEventLogUnreadCount (state, count) {
      state.eventLogUnreadCount = count
    },

    // SIDEBAR MUTATION

    setCurrentTab (state, tabName) {
      state.currentTab = tabName
    }
  }
})
