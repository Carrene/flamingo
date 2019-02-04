import Vuex from 'vuex'
import Vue from 'vue'
import { default as server, casServer, jaguarServer } from './server'
import { SCOPES, APPLICATION_ID } from './settings'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // MAIN ENTITIES

    releases: [],
    selectedRelease: null,
    projects: [],
    selectedProject: null,
    nuggetsOfSelectedProject: [],
    selectedNugget: null,
    roomId: null,

    // FORM ENTITIES

    workflows: [],
    phasesOfSelectedWorkflow: [],
    tags: [],
    groups: [],
    // TODO: Add this after implementing card view
    // viewMode: 'table',
    theme: 'light',

    // FILTERING AND SORTING

    releaseSortCriteria: {
      field: 'createdAt',
      descending: false
    },

    releaseFilters: {},

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
      kinds: [],
      phases: [],
      priorities: [],
      tags: []
    },

    // MODELS

    Release: null,
    Project: null,
    Nugget: null,
    DraftNugget: null,
    Member: null,
    Organization: null,
    OrganizationMember: null,
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

    // LOCAL FORM DATA

    projectBoardings: ['on-time', 'delayed', 'at-risk', 'frozen'],
    projectStatuses: ['queued', 'active', 'on-hold', 'done'],
    nuggetBoardings: ['on-time', 'delayed', 'at-risk', 'paused'],
    nuggetStatuses: ['to-do', 'in-progress', 'on-hold', 'done', 'complete'],
    nuggetKinds: ['bug', 'feature'],
    nuggetPriorities: ['low', 'normal', 'high'],

    // WEBSOCKET ENTITIES

    chatboxCallbackAttached: false,
    eventLogCallbackAttached: false,
    unreadCallbackAttached: false,
    mentionCallbackAttached: false,

    // OTHER

    nuggetsUnreadCount: null,
    eventLogUnreadCount: null,
    debug: true
  },
  getters: {
    computedReleaseFilters (state) {
      let result = {}
      return result
    },

    computedProjectFilters (state) {
      let result = {}
      if (state.selectedRelease) {
        result['releaseId'] = state.selectedRelease.id
      }
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
      if (state.nuggetFilters.priorities.length) {
        result['priority'] = `IN(${state.nuggetFilters.priorities.join(',')})`
      }
      if (state.nuggetFilters.phases.length) {
        result['phaseId'] = `IN(${state.nuggetFilters.phases.join(',')})`
      }
      if (state.nuggetFilters.tags.length) {
        result['tagId'] = `IN(${state.nuggetFilters.tags.join(',')})`
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
              let allowedFields = ['title', 'status', 'description', 'cutoff']
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            if (verb === this.constructor.__verbs__.create) {
              let allowedFields = ['title', 'status', 'description', 'cutoff']
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            return data
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
        .send()
      store.commit('setReleases', response.models)
      if (response.models.length) {
        if (selectedReleaseId) {
          store.dispatch('activateRelease', {
            release:
              response.models.find(release => {
                return release.id === parseInt(selectedReleaseId)
              }) || response.models[0],
            updateRoute: false
          })
        }
      } else {
        store.dispatch('activateRelease', { release: null, updateRoute: false })
      }
      return response
    },

    async getRelease (store, releaseId) {
      let response = await store.state.Release.get(releaseId).send()
      store.dispatch('activateRelease', {
        release: response.models[0],
        updateRoute: false
      })
      return response
    },

    async activateRelease (store, { release, updateRoute = true }) {
      if (updateRoute) {
        router.push({
          name: 'Releases',
          params: {
            releaseId: release ? release.id : null
          }
        })
      }
      store.commit('selectRelease', release)
    },

    // PROJECT ACTIONS

    createProjectClass ({ state, commit }) {
      if (!state.Project) {
        class Project extends server.metadata.models.Project {
          prepareForSubmit (verb, url, data) {
            if (verb === this.constructor.__verbs__.update) {
              let allowedFields = [
                'groupId',
                'title',
                'description',
                'status',
                'releaseId'
              ]
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
                'status',
                'groupId',
                'memberId'
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
        .send()
      store.commit('setProjects', response.models)
      if (response.models.length) {
        if (selectedProjectId) {
          store.dispatch('activateProject', {
            project:
              response.models.find(project => {
                return project.id === parseInt(selectedProjectId)
              }) || response.models[0],
            updateRoute: false
          })
        }
      } else {
        store.dispatch('activateProject', { project: null, updateRoute: false })
      }
      return response
    },

    async getProject (store, projectId) {
      let response = await store.state.Project.get(projectId).send()
      store.dispatch('activateProject', {
        project: response.models[0],
        updateRoute: false
      })
      return response
    },

    async activateProject (store, { project, updateRoute = true }) {
      if (project && !project.isSubscribed) {
        project.subscribe().send()
      }
      if (store.state.selectedRelease && updateRoute) {
        router.push({
          name: 'Projects',
          params: {
            releaseId: store.state.selectedRelease.id,
            projectId: project ? project.id : null
          }
        })
      } else if (updateRoute) {
        router.push({
          name: 'ProjectsWithoutRelease',
          params: {
            projectId: project ? project.id : null
          }
        })
      }
      store.commit('selectProject', project)
      return project
    },

    // NUGGET ACTIONS

    createNuggetClass ({ state, commit, dispatch }) {
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
                'status',
                'priority'
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
                'status',
                'priority',
                'projectId'
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
          listUnreadEvents () {
            return state.JaguarMessage.load(
              {
                mimetype: 'application/x-auditlog',
                seenAt: null
              },
              `${state.JaguarTarget.__url__}/${this.roomId}/${
                state.JaguarMessage.__url__
              }`
            )
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
        .send()
      store.commit('setNuggetsOfSelectedProject', response.models)
      if (response.models.length && selectedNuggetId) {
        store.dispatch('activateNugget', {
          nugget:
            response.models.find(nugget => {
              return nugget.id === parseInt(selectedNuggetId)
            }) || response.models[0],
          updateRoute: false
        })
      } else {
        store.dispatch('activateNugget', { nugget: null, updateRoute: false })
      }
      return response
    },

    async activateNugget (store, { nugget, updateRoute = true }) {
      if (nugget) {
        let response = await nugget.listUnreadEvents().send()
        store.commit('setEventLogUnreadCount', response.totalCount)
      }
      if (store.state.selectedRelease && updateRoute) {
        router.push({
          name: 'Nuggets',
          params: {
            releaseId: store.state.selectedRelease.id,
            projectId: store.state.selectedProject.id,
            nuggetId: nugget ? nugget.id : null
          }
        })
      } else if (updateRoute) {
        router.push({
          name: 'NuggetsWithoutRelease',
          params: {
            projectId: store.state.selectedProject.id,
            nuggetId: nugget ? nugget.id : null
          }
        })
      }
      store.commit('selectNugget', nugget)
    },

    // DRAFT NUGGET ACTIONS

    createDraftNuggetClass ({ state, commit }) {
      if (!state.DraftNugget) {
        class DraftNugget extends server.metadata.models.DraftIssue {
          prepareForSubmit (verb, url, data) {
            if (verb === this.constructor.__verbs__.create) {
              let allowedFields = []
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
            }
            if (verb === this.constructor.__verbs__.finalize) {
              let allowedFields = [
                'title',
                'description',
                'dueDate',
                'kind',
                'status',
                'priority',
                'projectId',
                // FIXME: Delete this days is a computed value
                'days'
              ]
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
              // FIXME: Delete this days is a computed value
              data.days = 0
            }
            if (verb === this.constructor.__verbs__.add) {
              let allowedFields = []
              for (let field in data) {
                if (!allowedFields.includes(field)) {
                  delete data[field]
                }
              }
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
          finalize () {
            let data = this.prepareForSubmit(
              this.constructor.__verbs__.finalize,
              this.updateUrl,
              this.toJson()
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
        class Group extends server.metadata.models.Group {}
        commit('setGroupClass', Group)
      }
    },

    async listGroups (store) {
      let response = await store.state.Group.load().send()
      store.commit('setGroups', response.models)
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
        }
        commit('setMemberClass', Member)
      }
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

    // ORGANIZATION MEMBER ACTIONS

    createOrganizationMemberClass ({ state, commit }) {
      if (!state.OrganizationMember) {
        class OrganizationMember extends server.metadata.models
          .OrganizationMember {}
        commit('setOrganizationMemberClass', OrganizationMember)
      }
    },

    // WORKFLOW ACTIONS

    createWorkflowClass ({ state, commit }) {
      if (!state.Workflow) {
        class Workflow extends server.metadata.models.Workflow {
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

    // PHASE ACTIONS

    createPhaseClass ({ state, commit }) {
      if (!state.Phase) {
        class Phase extends server.metadata.models.Phase {
          listResources () {
            return state.Resource.load(
              {},
              `${this.updateURL}/${state.Resource.__url__}`
            )
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
            return state.OrganizationMember.load(
              {},
              `${this.updateURL}/${state.OrganizationMember.__url__}`
            )
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
      state.projectFilters = filters
    },

    // NUGGET MUTATIONS

    setNuggetsOfSelectedProject (state, value) {
      state.nuggetsOfSelectedProject = value
    },

    selectNugget (state, nugget) {
      state.selectedNugget = nugget
    },

    setNuggetSortCriteria (state, options) {
      state.nuggetSortCriteria.field = options.field
      state.nuggetSortCriteria.descending = options.descending
    },

    setNuggetFilters (state, filters) {
      state.nuggetFilters = filters
    },

    setNuggetClass (state, nuggetClass) {
      state.Nugget = nuggetClass
    },

    // DRAFT NUGGET MUTATIONS

    setDraftNuggetClass (state, draftNuggetClass) {
      state.DraftNugget = draftNuggetClass
    },

    // MEMBER MUTATIONS

    setMemberClass (state, memberClass) {
      state.Member = memberClass
    },

    // ORGANIZATION MUTATIONS

    setOrganizationMemberClass (state, organizationMemberClass) {
      state.OrganizationMember = organizationMemberClass
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

    // TODO: Add this after implementing card view
    // changeViewMode (state) {
    //   state.viewMode = state.viewMode === 'card' ? 'table' : 'card'
    // },

    changeTheme (state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },

    setNuggetsUnreadCount (state, count) {
      state.nuggetsUnreadCount = count
    },

    setEventLogUnreadCount (state, count) {
      state.eventLogUnreadCount = count
    }
  }
})
