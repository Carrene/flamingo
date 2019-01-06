import Vuex from 'vuex'
import Vue from 'vue'
import router from './router'
import { default as server, casServer } from './server'
import { SCOPES, APPLICATION_ID } from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProject: null,
    projects: [],
    nuggetsOfSelectedProject: [],
    phasesOfSelectedWorkflow: [],
    releases: [],
    workflows: [],
    // TODO: Add this after implementing card view
    // viewMode: 'table',
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
      kinds: [],
      phases: [],
      priorities: []
    },
    selectedNugget: null,
    draftNugget: null,
    tags: null,
    Nugget: null,
    DraftNugget: null,
    Project: null,
    Release: null,
    Member: null,
    Organization: null,
    OrganizationMember: null,
    Tag: null,
    Workflow: null,
    Phase: null,
    Invitation: null,
    File: null,
    Resource: null,
    CasMember: null,
    projectBoardings: ['on-time', 'delayed', 'at-risk', 'frozen'],
    projectStatuses: ['queued', 'active', 'on-hold', 'done'],
    nuggetBoardings: ['on-time', 'delayed', 'at-risk', 'paused'],
    nuggetStatuses: ['to-do', 'in-progress', 'on-hold', 'done', 'complete'],
    nuggetKinds: ['bug', 'feature'],
    nuggetPriorities: ['low', 'normal', 'high']
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
      if (state.nuggetFilters.priorities.length) {
        result['priority'] = `IN(${state.nuggetFilters.priorities.join(',')})`
      }
      if (state.nuggetFilters.phases.length) {
        result['phaseId'] = `IN(${state.nuggetFilters.phases.join(',')})`
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
    createReleaseClass ({ state, commit }) {
      if (!state.Release) {
        class Release extends server.metadata.models.Release {}
        commit('setReleaseClass', Release)
      }
    },

    createProjectClass ({ state, commit }) {
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

    createNuggetClass ({ state, commit }) {
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
            return this.constructor.__client__
              .requestModel(
                this.constructor,
                this.updateURL,
                this.constructor.__verbs__.assign
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
        }
        commit('setNuggetClass', Nugget)
      }
    },

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

    createTagClass ({ state, commit }) {
      if (!state.Tag) {
        class Tag extends server.metadata.models.Tag {}
        commit('setTagClass', Tag)
      }
    },

    createOrganizationMemberClass ({ state, commit }) {
      if (!state.OrganizationMember) {
        class OrganizationMember extends server.metadata.models
          .OrganizationMember {}
        commit('setOrganizationMemberClass', OrganizationMember)
      }
    },

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

    createResourceClass ({ state, commit }) {
      if (!state.Resource) {
        class Resource extends server.metadata.models.Resource {}
        commit('setResourceClass', Resource)
      }
    },

    createFileClass ({ state, commit }) {
      if (!state.File) {
        class File extends server.metadata.models.File {}
        commit('setFileClass', File)
      }
    },

    createInvitationClass ({ state, commit }) {
      if (!state.Invitation) {
        class Invitation extends server.metadata.models.Invitation {}
        commit('setInvitationClass', Invitation)
      }
    },

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

    listTags (store) {
      store.state.Tag.load()
        .send()
        .then(resp => {
          store.commit('setTags', resp.models)
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

    listPhases ({ state, getters, commit }) {
      getters.selectedProjectWorkflow
        .listPhases()
        .send()
        .then(resp => {
          commit('setPhasesOfSelectedWorkflow', resp.models)
        })
    },

    listReleases ({ state, commit }) {
      return state.Release.load()
        .send()
        .then(resp => {
          commit('setReleases', resp.models)
        })
    },

    listWorkflows ({ state, commit }) {
      return state.Workflow.load()
        .send()
        .then(resp => {
          commit('setWorkflows', resp.models)
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

    // TODO: Add this after implementing card view
    // changeViewMode (state) {
    //   state.viewMode = state.viewMode === 'card' ? 'table' : 'card'
    // },

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

    setDraftNugget (state, draftNugget) {
      state.draftNugget = draftNugget
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

    setNuggetClass (state, nuggetClass) {
      state.Nugget = nuggetClass
    },

    // DRAFT NUGGETS MUTATIONS

    setDraftNuggetClass (state, draftNuggetClass) {
      state.DraftNugget = draftNuggetClass
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

    setProjectClass (state, projectClass) {
      state.Project = projectClass
    },

    // RELEASE MUTATIONS

    setReleases (state, releases) {
      state.releases = releases
    },

    setReleaseClass (state, releaseClass) {
      state.Release = releaseClass
    },

    // MEMBERS MUTATIONS

    setMemberClass (state, memberClass) {
      state.Member = memberClass
    },

    // ORGANIZATIONS MUTATIONS

    setOrganizationMemberClass (state, organizationMemberClass) {
      state.OrganizationMember = organizationMemberClass
    },

    // WORKFLOWS MUTATIONS

    setWorkflowClass (state, workflowClass) {
      state.Workflow = workflowClass
    },

    setWorkflows (state, workflows) {
      state.workflows = workflows
    },

    // PHASES MUTATIONS

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

    // CAS MEMBERS MUTATIONS

    setCasMemberClass (state, casMemberClass) {
      state.CasMember = casMemberClass
    },

    // ORGANIZATIONS MUTATIONS

    setOrganizationClass (state, organizationClass) {
      state.Organization = organizationClass
    },

    // FILE MUTATAIONS

    setFileClass (state, fileClass) {
      state.File = fileClass
    },

    // INVITATION MUTATION

    setInvitationClass (state, invitationClass) {
      state.Invitation = invitationClass
    },

    // RESOURCE MUTATIONS

    setResourceClass (state, resourceClass) {
      state.Resource = resourceClass
    }
  }
})
