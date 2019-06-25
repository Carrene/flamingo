import Vuex from 'vuex'
import Vue from 'vue'
import { default as server, casServer, jaguarServer } from './server'
import { SCOPES, APPLICATION_ID, CAS_FRONTEND_BASE_URL } from './settings'
import router from './router'
import localDB from './localdb'

Vue.use(Vuex)

function initialState () {
  return {
    // MAIN ENTITIES

    releases: [],
    selectedRelease: null,
    projects: [],
    allProjects: [],
    decoratedProjects: [],
    selectedProject: null,
    nuggetsOfSelectedProject: [],
    unreadNuggets: [],
    subscribedNuggets: [],
    selectedNuggets: [],
    events: [],
    eventTypes: [],
    selectedItem: null,
    selectedZoneTab: 'inProgressNuggets',
    timecards: [],
    dailyreports: [],
    roomId: null,
    currentTab: null,
    newlyAssignedItems: [],
    newlyAssignedCounter: null,
    needEstimateItems: [],
    needEstimateCounter: null,
    upcomingItems: [],
    upcomingCounter: null,
    inProgressItems: [],
    inProgressCounter: null,
    missingHoursItems: [],
    missingHoursCounter: null,
    missingEstimateItems: [],
    missingEstimateCounter: null,
    expiredTriageNuggets: [],
    expiredTriageCounter: null,
    selectedGoodNewsTab: 'backlogNuggets',
    backlogNuggets: [],
    backlogNuggetsCounter: null,
    triageNuggets: [],
    triageNuggetsCounter: null,
    needApprovalItems: [],
    needApprovalItemsCounter: null,
    selectedBadNewsTab: 'missingHours',
    phasesSummaries: [],
    globalSearchQuery: null,
    resourcesSummaries: [],
    weeklyOffDays: ['friday'],

    // FORM ENTITIES

    workflows: [],
    phases: [],
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
    newlyAssignedSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    needEstimateSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    inProgressNuggetsSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    upcomingNuggetsSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    backlogNuggetsSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    triageNuggetsSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    needApprovalItemsSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    missingHoursSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    missingEstimateSortCriteria: {
      field: 'createdAt',
      descending: true
    },
    expiredTriageSortCriteria: {
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
      projectId: []
    },
    unreadNuggetFilters: {
      isSubscribed: [],
      boarding: [],
      status: [],
      kind: [],
      phaseId: [],
      priority: [],
      projectId: []
    },
    subscribedNuggetFilters: {
      isSubscribed: [],
      boarding: [],
      status: [],
      kind: [],
      phaseId: [],
      priority: [],
      projectId: []
    },
    newlyAssignedFilters: {
      boarding: [],
      kind: [],
      project: [],
      priority: [],
      phase: []
    },
    needEstimateFilters: {
      boarding: [],
      kind: [],
      project: [],
      priority: [],
      phase: [],
      responseTime: []
    },
    inProgressNuggetsFilters: {
      boarding: [],
      kind: [],
      perspective: [],
      startDate: [],
      endDate: [],
      hoursWorked: [],
      project: [],
      priority: [],
      phase: []
    },
    upcomingNuggetsFilters: {
      boarding: [],
      kind: [],
      startDate: [],
      endDate: [],
      hoursWorked: [],
      project: [],
      priority: [],
      phase: []
    },
    backlogNuggetsFilters: {
      boarding: [],
      kind: [],
      perspective: [],
      startDate: [],
      endDate: [],
      hoursWorked: [],
      project: [],
      priority: [],
      phase: []
    },
    triageNuggetsFilters: {
      boarding: [],
      kind: [],
      perspective: [],
      startDate: [],
      endDate: [],
      hoursWorked: [],
      project: [],
      priority: [],
      phase: []
    },
    needApprovalItemsFilters: {
      boarding: [],
      kind: [],
      perspective: [],
      startDate: [],
      endDate: [],
      hoursWorked: [],
      project: [],
      priority: [],
      phase: []
    },
    missingHoursFilters: {
      boarding: [],
      kind: [],
      project: [],
      priority: [],
      phase: []
    },
    missingEstimateFilters: {
      boarding: [],
      kind: [],
      project: [],
      priority: [],
      phase: []
    },

    haveAnyNugget: false,
    haveAnyUnreadNugget: false,
    haveAnySubscribedNugget: false,
    haveAnyProject: false,
    haveAnyRelease: false,

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
    Item: null,
    DailyReport: null,
    PhasesSummary: null,
    ResourcesSummary: null,

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
    itemBoardings: ['on-time', 'delayed', 'at-risk', 'frozen'],
    itemKinds: ['bug', 'feature'],
    itemPriorities: ['low', 'normal', 'high'],

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
    relatedProjectId: null,
    infiniteLoaderIdentifier: 1,
    pageSize: 50,
    releasePageIndex: 0,
    projectPageIndex: 0,
    nuggetPageIndex: 0,
    unreadNuggetPageIndex: 0,
    subscribedNuggetPageIndex: 0,
    globalLoading: false
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
      if (state.nuggetFilters.projectId.length) {
        result.projectId = `IN(${state.nuggetFilters.projectId.join(',')})`
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
      if (state.unreadNuggetFilters.phaseId.length) {
        result.phaseId = `IN(${state.unreadNuggetFilters.phaseId.join(',')})`
      }
      if (state.unreadNuggetFilters.projectId.length) {
        result.projectId = `IN(${state.nuggetFilters.projectId.join(',')})`
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
      if (state.subscribedNuggetFilters.phaseId.length) {
        result.phaseId = `IN(${state.subscribedNuggetFilters.phaseId.join(
          ','
        )})`
      }
      if (state.subscribedNuggetFilters.projectId.length) {
        result.projectId = `IN(${state.nuggetFilters.projectId.join(',')})`
      }
      return result
    },

    computedNewlyAssignedFilters (state) {
      let result = {
        zone: 'newlyAssigned',
        memberId: server.authenticator._member.id
      }
      if (state.newlyAssignedFilters.boarding.length) {
        result.boarding = `IN(${state.newlyAssignedFilters.boarding.join(',')})`
      }
      if (state.newlyAssignedFilters.kind.length) {
        result.kind = `IN(${state.newlyAssignedFilters.kind.join(',')})`
      }
      if (state.newlyAssignedFilters.project.length) {
        result.project = `IN(${state.newlyAssignedFilters.project.join(',')})`
      }
      if (state.newlyAssignedFilters.priority.length) {
        result.priority = `IN(${state.newlyAssignedFilters.priority.join(',')})`
      }
      if (state.newlyAssignedFilters.phase.length) {
        result.phase = `IN(${state.newlyAssignedFilters.phase.join(',')})`
      }
      return result
    },

    computedNeedEstimateFilters (state) {
      let result = {
        zone: 'needEstimate',
        memberId: server.authenticator._member.id
      }
      if (state.needEstimateFilters.boarding.length) {
        result.boarding = `IN(${state.needEstimateFilters.boarding.join(',')})`
      }
      if (state.needEstimateFilters.kind.length) {
        result.kind = `IN(${state.needEstimateFilters.kind.join(',')})`
      }
      if (state.needEstimateFilters.project.length) {
        result.project = `IN(${state.needEstimateFilters.project.join(',')})`
      }
      if (state.needEstimateFilters.priority.length) {
        result.priority = `IN(${state.needEstimateFilters.priority.join(',')})`
      }
      if (state.needEstimateFilters.phase.length) {
        result.phase = `IN(${state.needEstimateFilters.phase.join(',')})`
      }
      if (state.needEstimateFilters.responseTime.length) {
        result.responseTime = `IN(${state.needEstimateFilters.responseTime.join(
          ','
        )})`
      }
      return result
    },

    computedInProgressNuggetsFilters (state) {
      let result = {
        zone: 'inProgressNuggets',
        memberId: server.authenticator._member.id
      }
      if (state.inProgressNuggetsFilters.boarding.length) {
        result.boarding = `IN(${state.inProgressNuggetsFilters.boarding.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.kind.length) {
        result.kind = `IN(${state.inProgressNuggetsFilters.kind.join(',')})`
      }
      if (state.inProgressNuggetsFilters.perspective.length) {
        result.perspective = `IN(${state.inProgressNuggetsFilters.perspective.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.startDate.length) {
        result.startDate = `IN(${state.inProgressNuggetsFilters.startDate.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.endDate.length) {
        result.endDate = `IN(${state.inProgressNuggetsFilters.endDate.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.hoursWorked.length) {
        result.hoursWorked = `IN(${state.inProgressNuggetsFilters.hoursWorked.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.project.length) {
        result.project = `IN(${state.inProgressNuggetsFilters.project.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.priority.length) {
        result.priority = `IN(${state.inProgressNuggetsFilters.priority.join(
          ','
        )})`
      }
      if (state.inProgressNuggetsFilters.phase.length) {
        result.phase = `IN(${state.inProgressNuggetsFilters.phase.join(',')})`
      }
      return result
    },

    computedUpcomingNuggetsFilters (state) {
      let result = {
        zone: 'upcomingNuggets',
        memberId: server.authenticator._member.id
      }
      if (state.upcomingNuggetsFilters.boarding.length) {
        result.boarding = `IN(${state.upcomingNuggetsFilters.boarding.join(
          ','
        )})`
      }
      if (state.upcomingNuggetsFilters.kind.length) {
        result.kind = `IN(${state.upcomingNuggetsFilters.kind.join(',')})`
      }
      if (state.upcomingNuggetsFilters.startDate.length) {
        result.startDate = `IN(${state.upcomingNuggetsFilters.startDate.join(
          ','
        )})`
      }
      if (state.upcomingNuggetsFilters.endDate.length) {
        result.endDate = `IN(${state.upcomingNuggetsFilters.endDate.join(',')})`
      }
      if (state.upcomingNuggetsFilters.hoursWorked.length) {
        result.hoursWorked = `IN(${state.upcomingNuggetsFilters.hoursWorked.join(
          ','
        )})`
      }
      if (state.upcomingNuggetsFilters.project.length) {
        result.project = `IN(${state.upcomingNuggetsFilters.project.join(',')})`
      }
      if (state.upcomingNuggetsFilters.priority.length) {
        result.priority = `IN(${state.upcomingNuggetsFilters.priority.join(
          ','
        )})`
      }
      if (state.upcomingNuggetsFilters.phase.length) {
        result.phase = `IN(${state.upcomingNuggetsFilters.phase.join(',')})`
      }
      return result
    },

    computedMissingHoursFilters (state) {
      let result = {
        zone: 'inProgressNuggets',
        perspective: 'Overdue',
        memberId: `!${server.authenticator._member.id}`
      }
      if (state.missingHoursFilters.boarding.length) {
        result.boarding = `IN(${state.missingHoursFilters.boarding.join(',')})`
      }
      if (state.missingHoursFilters.kind.length) {
        result.kind = `IN(${state.missingHoursFilters.kind.join(',')})`
      }
      if (state.missingHoursFilters.project.length) {
        result.project = `IN(${state.missingHoursFilters.project.join(',')})`
      }
      if (state.missingHoursFilters.priority.length) {
        result.priority = `IN(${state.missingHoursFilters.priority.join(',')})`
      }
      if (state.missingHoursFilters.phase.length) {
        result.phase = `IN(${state.missingHoursFilters.phase.join(',')})`
      }
      return result
    },

    computedMissingEstimateFilters (state) {
      let result = {
        zone: 'needEstimate',
        estimatedHours: null,
        memberId: `!${server.authenticator._member.id}`
      }
      if (state.missingEstimateFilters.boarding.length) {
        result.boarding = `IN(${state.missingEstimateFilters.boarding.join(
          ','
        )})`
      }
      if (state.missingEstimateFilters.kind.length) {
        result.kind = `IN(${state.missingEstimateFilters.kind.join(',')})`
      }
      if (state.missingEstimateFilters.project.length) {
        result.project = `IN(${state.missingEstimateFilters.project.join(',')})`
      }
      if (state.missingEstimateFilters.priority.length) {
        result.priority = `IN(${state.missingEstimateFilters.priority.join(
          ','
        )})`
      }
      if (state.missingEstimateFilters.phase.length) {
        result.phase = `IN(${state.missingEstimateFilters.phase.join(',')})`
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
    },

    phasesWithWorkflows (state) {
      return state.phases.map(phase => {
        return Object.assign({}, phase, {
          title: `${
            state.workflows.find(workflow => workflow.id === phase.workflowId)
              .title
          }/${phase.title}`
        })
      })
    },

    decoratedPhases (state, getters) {
      return [
        {
          description: 'Triage',
          id: 0,
          title: 'Triage'
        }
      ].concat(getters.phasesWithWorkflows)
    },

    decoratedPhasesOfCurrentWorkflow (state) {
      return [
        {
          description: 'Triage',
          id: 0,
          title: 'Triage'
        }
      ].concat(state.phasesOfSelectedWorkflow)
    },

    totalItemCount (state) {
      return (
        state.inProgressCounter +
        state.upcomingCounter +
        state.needEstimateCounter +
        state.newlyAssignedCounter
      )
    },

    totalBadNewsCount (state) {
      return (
        state.missingHoursCounter +
        state.missingEstimateCounter +
        state.expiredTriageCounter
      )
    },

    totalGoodNewsCount (state) {
      return (
        state.backlogNuggetsCounter +
        state.triageNuggetsCounter +
        state.needApprovalItemsCounter
      )
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

    async listReleases (store, { selectedReleaseId, $state }) {
      if (!$state) {
        store.commit('setReleases', [])
        store.commit('setReleasePageIndex', 0)
        store.commit('IncrementInfiniteLoaderIdentifier')
      }
      let response = await store.state.Release.load(
        store.getters.computedReleaseFilters
      )
        .sort(
          `${store.state.releaseSortCriteria.descending ? '-' : ''}${
            store.state.releaseSortCriteria.field
          }`
        )
        .skip(store.state.releasePageIndex * store.state.pageSize)
        .take(store.state.pageSize)
        .send()
      store.commit('setReleases', store.state.releases.concat(response.models))
      store.commit('setReleasePageIndex', store.state.releasePageIndex + 1)
      if ($state) {
        if (store.state.releases.length < response.totalCount) {
          $state.loaded()
        } else {
          $state.complete()
        }
      }
      if (store.state.releases.length) {
        store.commit('setHaveAnyRelease', true)
      }
      if (store.state.releases.length && selectedReleaseId) {
        let release = store.state.releases.find(release => {
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
      store.commit('selectRelease', release)
      if (release && !release.isSubscribed) {
        await release.subscribe().send()
      }
      if (updateRoute) {
        router.push({
          name: 'Releases',
          params: {
            releaseId: release ? release.id : null
          }
        })
      }
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

    async listProjects (store, { selectedProjectId, $state } = {}) {
      if (!$state) {
        store.commit('IncrementInfiniteLoaderIdentifier')
        store.commit('setProjects', [])
        store.commit('setProjectPageIndex', 0)
      }
      let response = await store.state.Project.load(
        store.getters.computedProjectFilters
      )
        .sort(
          `${store.state.projectSortCriteria.descending ? '-' : ''}${
            store.state.projectSortCriteria.field
          }`
        )
        .skip(store.state.projectPageIndex * store.state.pageSize)
        .take(store.state.pageSize)
        .send()
      store.commit('setProjects', store.state.projects.concat(response.models))
      await store.dispatch('generateDecoratedProjects')
      store.commit('setProjectPageIndex', store.state.projectPageIndex + 1)
      if ($state) {
        if (store.state.projects.length < response.totalCount) {
          $state.loaded()
        } else {
          $state.complete()
        }
      }
      if (store.state.projects.length) {
        store.commit('setHaveAnyProject', true)
      }
      if (store.state.projects.length && selectedProjectId) {
        let project = store.state.projects.find(project => {
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

    async listAllProjects (store, { forceUpdate = false }) {
      if (forceUpdate || !store.state.allProjects.length) {
        let projects = []
        let i = 0
        let totalCount = 0
        do {
          let response = await store.state.Project.load()
            .skip(i * 100)
            .take(100)
            .send()
          projects = projects.concat(response.models)
          totalCount = response.totalCount
          i++
        } while (projects.length < totalCount)
        store.commit('setAllProjects', projects)
      }
    },

    async generateDecoratedProjects (store) {
      let decoratedProjects = []
      if (!store.state.projects.length) {
        store.commit('setDecoratedProjects', decoratedProjects)
        return
      }
      decoratedProjects = await Promise.all(
        store.state.projects.map(async item => {
          let project = new store.state.Project(item)
          let managerTitle = 'None!'
          let releaseTitle = '-'
          if (item.managerId) {
            managerTitle = await store.dispatch(
              'getMemberTitle',
              project.managerId
            )
          }
          if (project.releaseId) {
            releaseTitle = await store.dispatch(
              'getReleaseTitle',
              project.releaseId
            )
          }
          let groupTitle = await store.dispatch(
            'getGroupTitle',
            project.groupId
          )
          let workflowTitle = await store.dispatch(
            'getWorkflowTitle',
            project.workflowId
          )
          project.managerTitle = managerTitle
          project.releaseTitle = releaseTitle
          project.groupTitle = groupTitle
          project.workflowTitle = workflowTitle
          return project
        })
      )
      store.commit('setDecoratedProjects', decoratedProjects)
    },

    async activateProject (store, { project, updateRoute = true }) {
      store.commit('selectProject', project)
      if (project && !project.isSubscribed) {
        await project.subscribe().send()
      }
      if (store.state.selectedRelease && updateRoute) {
        router.push({
          name: 'Projects',
          params: {
            releaseId: store.state.selectedRelease.id
          }
        })
      } else if (updateRoute) {
        router.push({
          name: 'ProjectsWithoutRelease'
        })
      }
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
          static search (query, filters) {
            return this.__client__
              .requestModel(this, this.__url__, this.__verbs__.search)
              .addParameters({
                query: query
              })
              .filter(filters)
          }
          listPhasesSummary () {
            return state.PhasesSummary.load(
              {},
              `${this.updateURL}/${state.PhasesSummary.__url__}`
            )
          }
        }
        commit('setNuggetClass', Nugget)
      }
    },

    async listNuggets (store, { selectedNuggetId, searchQuery = null, $state }) {
      if (!$state) {
        store.commit('setNuggetsOfSelectedProject', [])
        store.commit('setNuggetPageIndex', 0)
        store.commit('IncrementInfiniteLoaderIdentifier')
      }
      let request
      if (searchQuery) {
        request = store.state.Nugget.search(
          searchQuery,
          store.getters.computedNuggetFilters
        )
      } else {
        request = store.state.Nugget.load(store.getters.computedNuggetFilters)
      }
      let response = await request
        .sort(
          `${store.state.nuggetSortCriteria.descending ? '-' : ''}${
            store.state.nuggetSortCriteria.field
          }`
        )
        .skip(store.state.nuggetPageIndex * store.state.pageSize)
        .take(store.state.pageSize)
        .send()
      if (searchQuery && searchQuery !== store.state.globalSearchQuery) {
        return
      }
      store.commit(
        'setNuggetsOfSelectedProject',
        store.state.nuggetsOfSelectedProject.concat(response.models)
      )
      store.commit('setNuggetPageIndex', store.state.nuggetPageIndex + 1)
      if (store.state.nuggetsOfSelectedProject.length) {
        store.commit('setHaveAnyNugget', true)
      } else {
        store.commit('setHaveAnyNugget', false)
      }
      if (store.state.nuggetsOfSelectedProject.length && selectedNuggetId) {
        let nugget = store.state.nuggetsOfSelectedProject.find(nugget => {
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
      if ($state) {
        if (store.state.nuggetsOfSelectedProject.length < response.totalCount) {
          $state.loaded()
        } else {
          $state.complete()
        }
      }
      return response
    },

    async listUnreadNuggets (store, { searchQuery = null, $state } = {}) {
      if (!$state) {
        store.commit('setUnreadNuggets', [])
        store.commit('setUnreadNuggetPageIndex', 0)
        store.commit('IncrementInfiniteLoaderIdentifier')
      }
      let request
      if (searchQuery) {
        request = store.state.Nugget.search(
          searchQuery,
          store.getters.computedUnreadNuggetFilters
        )
      } else {
        request = store.state.Nugget.load(
          store.getters.computedUnreadNuggetFilters
        )
      }
      let response = await request
        .sort(
          `${store.state.unreadNuggetSortCriteria.descending ? '-' : ''}${
            store.state.unreadNuggetSortCriteria.field
          }`
        )
        .skip(store.state.unreadNuggetPageIndex * store.state.pageSize)
        .take(store.state.pageSize)
        .send()
      if (searchQuery && searchQuery !== store.state.globalSearchQuery) {
        return
      }
      store.commit(
        'setUnreadNuggets',
        store.state.unreadNuggets.concat(response.models)
      )
      store.commit(
        'setUnreadNuggetPageIndex',
        store.state.unreadNuggetPageIndex + 1
      )
      if ($state) {
        if (store.state.unreadNuggets.length < response.totalCount) {
          $state.loaded()
        } else {
          $state.complete()
        }
      }
      if (store.state.unreadNuggets.length) {
        store.commit('setHaveAnyUnreadNugget', true)
      }
      return response
    },

    async getUnreadNuggetTotalCount (store) {
      let response = await store.state.Nugget.load({ unread: true }).send()
      store.commit('setNuggetsUnreadCount', response.totalCount)
    },

    async listSubscribedNuggets (
      store,
      { selectedNuggetId, searchQuery = null, $state }
    ) {
      if (!$state) {
        store.commit('setSubscribedNuggets', [])
        store.commit('setSubscribedNuggetPageIndex', 0)
        store.commit('IncrementInfiniteLoaderIdentifier')
      }
      let request
      if (searchQuery) {
        request = store.state.Nugget.search(
          searchQuery,
          store.getters.computedSubscribedNuggetFilters
        )
      } else {
        request = store.state.Nugget.load(
          store.getters.computedSubscribedNuggetFilters
        )
      }
      let response = await request
        .sort(
          `${store.state.subscribedNuggetSortCriteria.descending ? '-' : ''}${
            store.state.subscribedNuggetSortCriteria.field
          }`
        )
        .skip(store.state.subscribedNuggetPageIndex * store.state.pageSize)
        .take(store.state.pageSize)
        .send()
      if (searchQuery && searchQuery !== store.state.globalSearchQuery) {
        return
      }
      store.commit(
        'setSubscribedNuggets',
        store.state.subscribedNuggets.concat(response.models)
      )
      store.commit(
        'setSubscribedNuggetPageIndex',
        store.state.subscribedNuggetPageIndex + 1
      )
      if ($state) {
        if (store.state.subscribedNuggets.length < response.totalCount) {
          $state.loaded()
        } else {
          $state.complete()
        }
      }
      if (store.state.subscribedNuggets.length) {
        store.commit('setHaveAnySubscribedNugget', true)
      }
      if (store.state.subscribedNuggets.length && selectedNuggetId) {
        let nugget = store.state.subscribedNuggets.find(nugget => {
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
      store.commit('selectNuggets', nugget ? [nugget] : [])
      if (nugget) {
        await nugget.getUnreadEventLogCount()
        if (!nugget.seenAt) {
          await nugget.see(nugget).send()
          store.dispatch('getUnreadNuggetTotalCount')
        }
      }
      if (
        store.state.selectedRelease &&
        updateRoute &&
        store.state.currentTab !== 'Unread' &&
        store.state.currentTab !== 'Subscribed' &&
        store.state.currentTab !== 'Assigned'
      ) {
        router.push({
          name: 'Nuggets',
          params: {
            releaseId: store.state.selectedRelease.id,
            projectId: store.state.selectedProject.id,
            nuggetId: nugget ? nugget.id : null
          }
        })
      } else if (
        updateRoute &&
        store.state.selectedProject &&
        store.state.currentTab !== 'Unread' &&
        store.state.currentTab !== 'Subscribed' &&
        store.state.currentTab !== 'Assigned'
      ) {
        router.push({
          name: 'NuggetsWithoutRelease',
          params: {
            projectId: store.state.selectedProject.id,
            nuggetId: nugget ? nugget.id : null
          }
        })
      } else if (
        updateRoute &&
        store.state.currentTab !== 'Unread' &&
        store.state.currentTab !== 'Assigned'
      ) {
        router.push({
          name: 'Subscribed',
          params: {
            subscribedId: nugget ? nugget.id : null
          }
        })
      } else if (
        updateRoute &&
        store.state.currentTab !== 'Subscribed' &&
        store.state.currentTab !== 'Assigned'
      ) {
        router.push({
          name: 'Unread',
          params: {
            nuggetId: nugget ? nugget.id : null
          }
        })
      }
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
            }
          })
        } else {
          router.push({
            name: 'NuggetsWithoutRelease',
            params: {
              projectId: store.state.selectedProject.id,
              nuggetId: newArray.length === 1 ? newArray[0].id : null
            }
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

    async getMemberTitle ({ state, commit }, managerId) {
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

    async listPhases ({ state, commit }) {
      let response = await state.Phase.load().send()
      commit('setPhases', response.models)
      return response
    },

    async listPhasesOfSelectedWorkflow ({ state, getters, commit }) {
      let response = await getters.selectedProjectWorkflow.listPhases().send()
      commit('setPhasesOfSelectedWorkflow', response.models)
      return response
    },

    // EVENT ACTIONS

    createEventClass ({ state, commit }) {
      if (!state.Event) {
        class Event extends server.metadata.models.Event {
          prepareForSubmit (verb, url, data) {
            let allowedFields = [
              'title',
              'startDate',
              'endDate',
              'eventTypeId',
              'repeat'
            ]
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

    // ITEM ACTIONS

    createItemClass ({ state, commit }) {
      if (!state.Item) {
        class Item extends server.metadata.models.Item {
          estimate () {
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.estimate
              )
              .addParameters({
                startDate: this.startDate,
                endDate: this.endDate,
                estimatedHours: this.estimatedHours
              })
          }
          listPhasesSummary () {
            return state.PhasesSummary.load(
              {},
              `issues/${this.issue.id}/${state.PhasesSummary.__url__}`
            )
          }
        }
        commit('setItemClass', Item)
      }
    },

    async listItems (store) {
      const filteringAndSortingCriteria = [
        {
          filtering: 'computedNewlyAssignedFilters',
          sorting: 'newlyAssignedSortCriteria'
        },
        {
          filtering: 'computedNeedEstimateFilters',
          sorting: 'needEstimateSortCriteria'
        },
        {
          filtering: 'computedInProgressNuggetsFilters',
          sorting: 'inProgressNuggetsSortCriteria'
        },
        {
          filtering: 'computedUpcomingNuggetsFilters',
          sorting: 'upcomingNuggetsSortCriteria'
        }
      ]
      let requests = []
      for (let item of filteringAndSortingCriteria) {
        requests.push(
          store.state.Item.load(store.getters[item.filtering])
            .sort(
              `${store.state[item.sorting].descending ? '-' : ''}${
                store.state[item.sorting].field
              }`
            )
            .send()
        )
      }
      let resps = await Promise.all(requests)

      store.commit('setNewlyAssignedItems', resps[0].models)
      store.commit('setNewlyAssignedCounter', resps[0].totalCount)

      store.commit('setNeedEstimateItems', resps[1].models)
      store.commit('setNeedEstimateCounter', resps[1].totalCount)

      store.commit('setInProgressItems', resps[2].models)
      store.commit('setInProgressCounter', resps[2].totalCount)

      store.commit('setUpcomingItems', resps[3].models)
      store.commit('setUpcomingItemsCounter', resps[3].totalCount)

      store.commit('IncrementInfiniteLoaderIdentifier')
    },

    async updateListItem (store, $state) {
      let selectedTabTotalCount
      let selectedTabCurrentItems
      let currentMutationName
      let currentFiltering
      switch (store.state.selectedZoneTab) {
        case 'newlyAssigned':
          selectedTabTotalCount = store.state.newlyAssignedCounter
          selectedTabCurrentItems = store.state.newlyAssignedItems
          currentMutationName = 'setNewlyAssignedItems'
          currentFiltering = 'computedNewlyAssignedFilters'
          break
        case 'needEstimate':
          selectedTabTotalCount = store.state.needEstimateCounter
          selectedTabCurrentItems = store.state.needEstimateItems
          currentMutationName = 'setNeedEstimateItems'
          currentFiltering = 'computedNeedEstimateFilters'
          break
        case 'inProgressNuggets':
          selectedTabTotalCount = store.state.inProgressCounter
          selectedTabCurrentItems = store.state.inProgressItems
          currentMutationName = 'setInProgressItems'
          currentFiltering = 'computedInProgressNuggetsFilters'
          break
        case 'upcomingNuggets':
          selectedTabTotalCount = store.state.upcomingItemsCounter
          selectedTabCurrentItems = store.state.upcomingItems
          currentMutationName = 'setUpcomingItems'
          currentFiltering = 'computedUpcomingNuggetsFilters'
          break
        default:
          throw new Error('Bad Zone Tab!')
      }
      if (selectedTabCurrentItems.length < selectedTabTotalCount) {
        let resp = await store.state.Item.load(currentFiltering)
          .sort(
            `${
              store.state[`${store.state.selectedZoneTab}SortCriteria`]
                .descending
                ? '-'
                : ''
            }${store.state[`${store.state.selectedZoneTab}SortCriteria`].field}`
          )
          .skip(selectedTabCurrentItems.length)
          .send()
        store.commit(
          currentMutationName,
          selectedTabCurrentItems.concat(resp.models)
        )
        $state.loaded()
      } else {
        $state.complete()
      }
    },

    async selectItem (store, item) {
      if (item) {
        let nuggetResponse = await store.state.Nugget.get(item.issue.id).send()
        let workflow = new store.state.Workflow({
          id: item.issue.project.workflowId
        })
        let phaseResponse = await workflow.listPhases().send()
        store.commit('setPhasesOfSelectedWorkflow', phaseResponse.models)
        store.commit('selectNuggets', nuggetResponse.models)
      } else {
        store.commit('selectNuggets', [])
        store.commit('setPhasesOfSelectedWorkflow', [])
      }
      store.commit('setSelectedItem', item)
    },

    // BAD NEWS ACTIONS

    async listBadNews (store) {
      let requests = []
      requests.push(store.dispatch('listMissingHoursItems'))
      requests.push(store.dispatch('listMissingEstimateItems'))
      requests.push(store.dispatch('listExpiredTriageNuggets'))
      let resps = await Promise.all(requests)

      store.commit('setMissingHoursItems', resps[0].models)
      store.commit('setMissingHoursCounter', resps[0].totalCount)

      store.commit('setMissingEstimateItems', resps[1].models)
      store.commit('setMissingEstimateCounter', resps[1].totalCount)

      store.commit('setExpiredTriageNuggets', resps[2].models)
      store.commit('setExpiredTriageCounter', resps[2].totalCount)

      store.commit('IncrementInfiniteLoaderIdentifier')
    },

    async updateBadNewsList (store, $state) {
      let selectedTabTotalCount
      let selectedTabCurrentItems
      let currentMutationName
      let currentFiltering
      let baseClass
      switch (store.state.selectedBadNewsTab) {
        case 'missingHours':
          selectedTabTotalCount = store.state.missingHoursCounter
          selectedTabCurrentItems = store.state.missingHoursItems
          currentMutationName = 'setMissingHoursItems'
          currentFiltering = 'computedMissingHoursFilters'
          baseClass = 'Item'
          break
        case 'missingEstimate':
          selectedTabTotalCount = store.state.missingEstimateCounter
          selectedTabCurrentItems = store.state.missingEstimateItems
          currentMutationName = 'setMissingEstimateItems'
          currentFiltering = 'computedMissingEstimateFilters'
          baseClass = 'Item'
          break
        // TODO: ADD THIS LATER!
        // case 'expiredTriage':
        //   selectedTabTotalCount = store.state.inProgressCounter
        //   selectedTabCurrentItems = store.state.inProgressItems
        //   currentMutationName = 'setInProgressItems'
        //   currentFiltering = 'computedInProgressNuggetsFilters'
        //   baseClass = 'Nugget'
        //   break
        default:
          throw new Error('Wrong BadNews Tab!')
      }
      if (selectedTabCurrentItems.length < selectedTabTotalCount) {
        let resp = await store.state[baseClass]
          .load(currentFiltering)
          .sort(
            `${
              store.state[`${store.state.selectedBadNewsTab}SortCriteria`]
                .descending
                ? '-'
                : ''
            }${
              store.state[`${store.state.selectedBadNewsTab}SortCriteria`].field
            }`
          )
          .skip(selectedTabCurrentItems.length)
          .send()
        store.commit(
          currentMutationName,
          selectedTabCurrentItems.concat(resp.models)
        )
        $state.loaded()
      } else {
        $state.complete()
      }
    },

    listMissingHoursItems (store) {
      return store.state.Item.load(store.getters.computedMissingHoursFilters)
        .sort(
          `${store.state.missingHoursSortCriteria.descending ? '-' : ''}${
            store.state.missingHoursSortCriteria.field
          }`
        )
        .send()
    },

    listMissingEstimateItems (store) {
      return store.state.Item.load(store.getters.computedMissingEstimateFilters)
        .sort(
          `${store.state.missingEstimateSortCriteria.descending ? '-' : ''}${
            store.state.missingEstimateSortCriteria.field
          }`
        )
        .send()
    },

    listExpiredTriageNuggets (store) {
      // TODO: Implement after API completion
      return Promise.resolve({
        models: [],
        totalCount: 0
      })
    },

    // GOOD NEWS ACTIONS

    async listGoodNews (store) {
      let requests = []
      requests.push(store.state.Nugget.load({ stage: 'backlog' }).send())
      requests.push(store.state.Nugget.load({ stage: 'triage' }).send())
      requests.push(store.state.Item.load({ status: 'complete' }).send())

      let resps = await Promise.all(requests)

      let backlogNuggets = await Promise.all(
        resps[0].models.map(async nugget => {
          let creator = await store.dispatch('getMemberTitle', nugget.createdBy)
          nugget.creator = creator
          return nugget
        })
      )

      let triageNuggets = await Promise.all(
        resps[1].models.map(async nugget => {
          let creator = await store.dispatch('getMemberTitle', nugget.createdBy)
          nugget.creator = creator
          return nugget
        })
      )

      store.commit('setBacklogNuggets', backlogNuggets)
      store.commit('setBacklogNuggetsCounter', resps[0].totalCount)

      store.commit('setTriageNuggets', triageNuggets)
      store.commit('setTriageNuggetsCounter', resps[1].totalCount)

      store.commit('setNeedApprovalItems', resps[2].models)
      store.commit('setNeedApprovalItemsCounter', resps[2].totalCount)

      store.commit('IncrementInfiniteLoaderIdentifier')
    },

    async updateListGoodNews (store, $state) {
      let selectedTabTotalCount
      let selectedTabCurrentItems
      let currentMutationName
      let baseClass
      let currentFiltering

      switch (store.state.selectedGoodNewsTab) {
        case 'backlogNuggets':
          selectedTabTotalCount = store.state.backlogNuggetsCounter
          selectedTabCurrentItems = store.state.backlogNuggets
          currentMutationName = 'setBacklogNuggets'
          currentFiltering = { stage: 'backlog' }
          baseClass = 'Nugget'
          break
        case 'triageNuggets':
          selectedTabTotalCount = store.state.triageNuggetsCounter
          selectedTabCurrentItems = store.state.triageNuggets
          currentMutationName = 'setTriageNuggets'
          currentFiltering = { stage: 'triage' }
          baseClass = 'Nugget'
          break
        case 'needApprovalItems':
          selectedTabTotalCount = store.state.needApprovalItemsCounter
          selectedTabCurrentItems = store.state.needApprovalItems
          currentMutationName = 'setNeedApprovalItems'
          currentFiltering = { status: 'complete' }
          baseClass = 'Item'
          break
        default:
          throw new Error('Bad good news Tab!')
      }
      if (selectedTabCurrentItems.length < selectedTabTotalCount) {
        let resp = await store.state[baseClass]
          .load(currentFiltering)
          .skip(selectedTabCurrentItems.length)
          .send()
        if (baseClass === 'Nugget') {
          resp.models = await Promise.all(
            resp.models.map(async nugget => {
              let creator = await store.dispatch(
                'getMemberTitle',
                nugget.createdBy
              )
              nugget.creator = creator
              return nugget
            })
          )
        }
        store.commit(
          currentMutationName,
          selectedTabCurrentItems.concat(resp.models)
        )
        $state.loaded()
      } else {
        $state.complete()
      }
    },

    // DAILY REPORT ACTIONS

    createDailyReportClass ({ state, commit }) {
      if (!state.DailyReport) {
        class DailyReport extends server.metadata.models.DailyReport {
          prepareForSubmit (verb, url, data) {
            let allowedFields
            if (verb === 'CREATE') {
              allowedFields = ['hours', 'note', 'date']
            } else {
              allowedFields = ['hours', 'note']
            }
            for (let field in data) {
              if (!allowedFields.includes(field)) {
                delete data[field]
              }
            }
            return data
          }
          get updateURL () {
            return `${state.Item.__url__}/${this.itemId}/${
              this.constructor.__url__
            }/${this.id}`
          }

          get createURL () {
            return `${state.Item.__url__}/${this.itemId}/${
              this.constructor.__url__
            }`
          }
        }
        commit('setDailyReportClass', DailyReport)
      }
    },

    // PHASES SUMMARY ACTION

    createPhasesSummaryClass ({ state, commit }) {
      if (!state.PhasesSummary) {
        class PhasesSummary extends server.metadata.models.PhasesSummary {}
        commit('setPhasesSummaryClass', PhasesSummary)
      }
    },

    // RESOURCE SUMMARY ACTION

    createResourcesSummaryClass ({ state, commit }) {
      if (!state.ResourcesSummary) {
        class ResourcesSummary extends server.metadata.models.ResourcesSummary {
          static listResourcesSummary (phaseId, issueId) {
            return this.load(
              {},
              `${state.Nugget.__url__}/${issueId}/${
                state.Phase.__url__
              }/${phaseId}/${this.__url__}`
            )
          }
        }
        commit('setResourcesSummaryClass', ResourcesSummary)
      }
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

    redirectToCAS (store, redirectUrl) {
      server.authenticator.deleteToken()
      let url = new URL(`${CAS_FRONTEND_BASE_URL}/permissions`)
      url.searchParams.set('applicationId', APPLICATION_ID)
      url.searchParams.set('scopes', SCOPES.join(','))
      url.searchParams.set(
        'redirectUri',
        encodeURI(redirectUrl || window.location.origin)
      )
      window.location.assign(url.href)
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

    setHaveAnyRelease (state, flag) {
      state.haveAnyRelease = flag
    },

    setReleasePageIndex (state, pageIndex) {
      state.releasePageIndex = pageIndex
    },

    // PROJECT MUTATIONS

    setProjects (state, projects) {
      state.projects = projects
    },

    setAllProjects (state, projects) {
      state.allProjects = projects
    },

    setDecoratedProjects (state, projects) {
      state.decoratedProjects = projects
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

    setHaveAnyProject (state, flag) {
      state.haveAnyProject = flag
    },

    setProjectPageIndex (state, pageIndex) {
      state.projectPageIndex = pageIndex
    },

    // NUGGET MUTATIONS

    setNuggetsOfSelectedProject (state, nuggets) {
      state.nuggetsOfSelectedProject = nuggets
    },

    setUnreadNuggets (state, nuggets) {
      state.unreadNuggets = nuggets
    },

    setUnreadNuggetPageIndex (state, pageIndex) {
      state.unreadNuggetPageIndex = pageIndex
    },

    setSubscribedNuggets (state, nuggets) {
      state.subscribedNuggets = nuggets
    },

    setSubscribedNuggetPageIndex (state, pageIndex) {
      state.subscribedNuggetPageIndex = pageIndex
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

    setNuggetPageIndex (state, pageIndex) {
      state.nuggetPageIndex = pageIndex
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

    setPhases (state, phases) {
      state.phases = phases
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

    // CALENDAR MUTATIONS

    setWeeklyOffDays (state, offDays) {
      state.weeklyOffDays = offDays
    },

    // ITEM MUTATION

    setItemClass (state, itemClass) {
      state.Item = itemClass
    },

    setNewlyAssignedItems (state, items) {
      state.newlyAssignedItems = items
    },

    setNewlyAssignedCounter (state, itemsCount) {
      state.newlyAssignedCounter = itemsCount
    },

    setNeedEstimateItems (state, items) {
      state.needEstimateItems = items
    },

    setNeedEstimateCounter (state, itemsCount) {
      state.needEstimateCounter = itemsCount
    },

    setInProgressItems (state, items) {
      state.inProgressItems = items
    },

    setInProgressCounter (state, itemsCount) {
      state.inProgressCounter = itemsCount
    },

    setUpcomingItems (state, items) {
      state.upcomingItems = items
    },

    setUpcomingItemsCounter (state, itemsCount) {
      state.upcomingCounter = itemsCount
    },

    setSelectedItem (state, item) {
      state.selectedItem = item
    },

    setNewlyAssignedSortCriteria (state, options) {
      state.newlyAssignedSortCriteria.field = options.field
      state.newlyAssignedSortCriteria.descending = options.descending
    },
    setNeedEstimateSortCriteria (state, options) {
      state.needEstimateSortCriteria.field = options.field
      state.needEstimateSortCriteria.descending = options.descending
    },
    setInProgressNuggetsSortCriteria (state, options) {
      state.inProgressNuggetsSortCriteria.field = options.field
      state.inProgressNuggetsSortCriteria.descending = options.descending
    },
    setUpcomingNuggetsSortCriteria (state, options) {
      state.upcomingNuggetsSortCriteria.field = options.field
      state.upcomingNuggetsSortCriteria.descending = options.descending
    },
    setBacklogNuggetsSortCriteria (state, options) {
      state.backlogNuggetsSortCriteria.field = options.field
      state.backlogNuggetsSortCriteria.descending = options.descending
    },
    setTriageNuggetsSortCriteria (state, options) {
      state.triageNuggetsSortCriteria.field = options.field
      state.triageNuggetsSortCriteria.descending = options.descending
    },
    setNeedApprovalItemsSortCriteria (state, options) {
      state.needApprovalItemsSortCriteria.field = options.field
      state.needApprovalItemsSortCriteria.descending = options.descending
    },
    setMissingHoursSortCriteria (state, options) {
      state.missingHoursSortCriteria.field = options.field
      state.missingHoursSortCriteria.descending = options.descending
    },
    setMissingEstimateSortCriteria (state, options) {
      state.missingEstimateSortCriteria.field = options.field
      state.missingEstimateSortCriteria.descending = options.descending
    },
    setExpiredTriageSortCriteria (state, options) {
      state.expiredTriageSortCriteria.field = options.field
      state.expiredTriageSortCriteria.descending = options.descending
    },

    IncrementInfiniteLoaderIdentifier (state) {
      state.infiniteLoaderIdentifier += 1
    },
    setNewlyAssignedFilters (state, filters) {
      state.newlyAssignedFilters = Object.assign(
        {},
        state.newlyAssignedFilters,
        filters
      )
    },

    setNeedEstimateFilters (state, filters) {
      state.needEstimateFilters = Object.assign(
        {},
        state.needEstimateFilters,
        filters
      )
    },

    setInProgressNuggetsFilters (state, filters) {
      state.inProgressNuggetsFilters = Object.assign(
        {},
        state.inProgressNuggetsFilters,
        filters
      )
    },

    setUpcomingNuggetsFilters (state, filters) {
      state.upcomingNuggetsFilters = Object.assign(
        {},
        state.upcomingNuggetsFilters,
        filters
      )
    },

    setMissingHoursFilters (state, filters) {
      state.missingHoursFilters = Object.assign(
        {},
        state.missingHoursFilters,
        filters
      )
    },

    setMissingEstimateFilters (state, filters) {
      state.missingEstimateFilters = Object.assign(
        {},
        state.missingEstimateFilters,
        filters
      )
    },

    setBacklogNuggetsFilters (state, filters) {
      state.backlogNuggetsFilters = Object.assign(
        {},
        state.backlogNuggetsFilters,
        filters
      )
    },

    setTriageNuggetsFilters (state, filters) {
      state.triageNuggetsFilters = Object.assign(
        {},
        state.triageNuggetsFilters,
        filters
      )
    },

    setNeedApprovalItemsFilters (state, filters) {
      state.needApprovalItemsFilters = Object.assign(
        {},
        state.needApprovalItemsFilters,
        filters
      )
    },

    // GOOD NEWS MUTATION

    setBacklogNuggets (state, nuggets) {
      state.backlogNuggets = nuggets
    },

    setBacklogNuggetsCounter (state, nuggetsCount) {
      state.backlogNuggetsCounter = nuggetsCount
    },

    setTriageNuggets (state, nuggets) {
      state.triageNuggets = nuggets
    },

    setTriageNuggetsCounter (state, nuggetsCount) {
      state.triageNuggetsCounter = nuggetsCount
    },

    setNeedApprovalItems (state, items) {
      state.needApprovalItems = items
    },

    setNeedApprovalItemsCounter (state, itemsCount) {
      state.needApprovalItemsCounter = itemsCount
    },

    // BAD NEWS MUTATIONS

    setMissingHoursItems (state, items) {
      state.missingHoursItems = items
    },

    setMissingHoursCounter (state, items) {
      state.missingHoursCounter = items
    },

    setMissingEstimateItems (state, items) {
      state.missingEstimateItems = items
    },

    setMissingEstimateCounter (state, items) {
      state.missingEstimateCounter = items
    },

    setExpiredTriageNuggets (state, items) {
      state.expiredTriageNuggets = items
    },

    setExpiredTriageCounter (state, items) {
      state.expiredTriageCounter = items
    },

    // DAILY REPORT MUTATIONS

    setDailyReportClass (state, dailyReportClass) {
      state.DailyReport = dailyReportClass
    },

    setDailyReports (state, dailyReports) {
      state.dailyReports = dailyReports
    },

    setSelectedZoneTab (state, zone) {
      state.selectedZoneTab = zone
    },

    // PHASES SUMMARY MUTATIONS

    setPhasesSummaryClass (state, phasesSummaryClass) {
      state.PhasesSummary = phasesSummaryClass
    },

    setPhasesSummaries (state, phasesSummaries) {
      state.phasesSummaries = phasesSummaries
    },

    // RESOURCE SUMMARY MUTATIONS

    setResourcesSummaryClass (state, resourcesSummaryClass) {
      state.ResourcesSummary = resourcesSummaryClass
    },

    setResourcesSummaries (state, resourcesSummaries) {
      state.resourcesSummaries = resourcesSummaries
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

    // GOOD NEWS MUTATION

    setSelectedGoodNewsTab (state, tabName) {
      state.selectedGoodNewsTab = tabName
    },

    // BAD NEWS MUTATION

    setSelectedBadNewsTab (state, tabName) {
      state.selectedBadNewsTab = tabName
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
    },

    // LOADING MUTATION

    setGlobalLoading (state, loading) {
      state.globalLoading = loading
    },

    // SEARCH MUTATIONS

    setGlobalSearchQuery (state, query) {
      state.globalSearchQuery = query
    }
  }
})
