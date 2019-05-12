import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import { default as server, casServer, jaguarServer } from './server'
import store from './store'
import { DOLPHIN_BASE_URL, CAS_BACKEND_URL } from './settings'
import ViewState from './view-state'

let initialLoading = true

const dolphinEntities = {
  Project: {
    url: 'projects',
    verbs: {
      create: 'CREATE',
      update: 'UPDATE',
      load: 'LIST',
      subscribe: 'SUBSCRIBE',
      unsubscribe: 'UNSUBSCRIBE'
    }
  },
  DraftIssue: {
    url: 'draftissues',
    verbs: {
      relate: 'RELATE',
      create: 'DEFINE',
      finalize: 'FINALIZE'
    }
  },
  Issue: {
    url: 'issues',
    verbs: {
      create: 'DEFINE',
      update: 'UPDATE',
      load: 'LIST',
      subscribe: 'SUBSCRIBE',
      unsubscribe: 'UNSUBSCRIBE',
      assign: 'ASSIGN',
      unAssign: 'UNASSIGN',
      see: 'SEE',
      relate: 'RELATE',
      unrelate: 'UNRELATE',
      move: 'MOVE',
      search: 'SEARCH'
    }
  },
  Release: {
    url: 'releases',
    verbs: {
      create: 'CREATE',
      update: 'UPDATE',
      load: 'LIST',
      subscribe: 'SUBSCRIBE',
      unsubscribe: 'UNSUBSCRIBE'
    }
  },
  Member: {
    url: '/members',
    verbs: {
      load: 'LIST',
      deny: 'DENY',
      grant: 'GRANT',
      add: 'ADD',
      remove: 'REMOVE'
    }
  },
  Organization: {
    url: 'organizations',
    verbs: {
      load: 'LIST',
      create: 'CREATE'
    }
  },
  Workflow: {
    url: 'workflows',
    verbs: {
      load: 'LIST',
      create: 'CREATE',
      update: 'UPDATE'
    }
  },
  Phase: {
    url: 'phases',
    verbs: {
      load: 'LIST',
      create: 'CREATE',
      update: 'UPDATE'
    }
  },
  Tag: {
    url: 'tags',
    verbs: {
      load: 'LIST',
      add: 'ADD',
      remove: 'REMOVE',
      update: 'UPDATE',
      create: 'CREATE'
    }
  },
  Invitation: {
    url: 'invitations',
    verbs: {
      create: 'CREATE'
    }
  },
  Resource: {
    url: 'resources',
    verbs: {
      load: 'LIST'
    }
  },
  File: {
    url: 'files',
    verbs: {
      load: 'LIST',
      attach: 'ATTACH'
    }
  },
  Group: {
    url: 'groups',
    verbs: {
      load: 'LIST',
      create: 'CREATE',
      update: 'UPDATE'
    }
  },
  Skill: {
    url: 'skills',
    verbs: {
      load: 'LIST',
      create: 'CREATE',
      update: 'UPDATE'
    }
  },
  Event: {
    url: 'events',
    verbs: {
      load: 'LIST',
      create: 'ADD',
      update: 'UPDATE'
    }
  },
  EventType: {
    url: 'eventtypes',
    verbs: {
      load: 'LIST',
      create: 'CREATE',
      update: 'UPDATE'
    }
  },
  Item: {
    url: 'items',
    verbs: {
      load: 'LIST'
    }
  }
}

const casEntities = {
  Member: {
    url: 'members',
    verbs: {
      update: 'UPDATE'
    }
  }
}

const jaguarEntities = {
  Message: {
    url: 'messages',
    verbs: {
      load: 'LIST'
    }
  },
  Target: {
    url: 'targets'
  }
}

Vue.use(Router)

const settingBeforeEnter = async (to, _from, next) => {
  if (to.query.code) {
    await server.logout()
    next({
      path: 'Login',
      query: to.query
    })
  }
  if (!server.authenticator.authenticated) {
    if (to.query.code) {
      next({
        path: 'Login',
        query: to.query
      })
    } else {
      store.dispatch('redirectToCAS', window.location.href)
    }
  } else {
    next()
  }
}

const homeBeforeEnter = async (to, _from, next) => {
  if (to.query.code) {
    await server.logout()
    next({
      path: 'Login',
      query: to.query
    })
  }
  if (!server.authenticator.authenticated) {
    if (to.query.code) {
      next({
        path: 'Login',
        query: to.query
      })
    } else {
      store.dispatch('redirectToCAS', window.location.href)
    }
  } else if (initialLoading && to.name === 'Home') {
    let resp = await store.dispatch('listUnreadNuggets')
    initialLoading = false
    if (resp.models.length) {
      next({
        path: '/unread'
      })
    } else {
      next({
        path: '/projects'
      })
    }
  } else {
    next()
  }
}

const afterAuth = (_to, from, next) => {
  if (server.authenticator.authenticated) {
    next(from.path)
  } else {
    next()
  }
}

const releasesBeforeEnter = async (to, _from, next) => {
  store.commit(
    'setReleasesViewState',
    new ViewState({ page: parseInt(to.query.page) })
  )
  await store.dispatch('listReleases', to.params.releaseId)
  if (!store.state.groups.length) {
    await store.dispatch('listGroups')
  }
  next()
}

const projectsBeforeEnter = async (to, from, next) => {
  if (!store.state.releases.length) {
    await store.dispatch('listReleases', to.params.releaseId)
  }
  store.commit(
    'setProjectsViewState',
    new ViewState({ page: parseInt(to.query.page) })
  )
  if (from.name !== to.name) {
    await store.dispatch('listProjects', to.params.projectId)
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.groups.length) {
    await store.dispatch('listGroups')
  }
  next()
}

const nuggetsBeforeEnter = async (to, _from, next) => {
  if (!store.state.releases.length) {
    await store.dispatch('listReleases', to.params.releaseId)
  }
  if (!store.state.projects.length) {
    await store.dispatch('listProjects', to.params.projectId)
  }
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  store.commit(
    'setNuggetsViewState',
    new ViewState({ page: parseInt(to.query.page) })
  )
  store.commit('resetNuggetFilters')
  await store.dispatch('listNuggets', { selectedNuggetId: to.params.nuggetId })
  await store.dispatch('listPhasesOfSelectedWorkflow')
  next()
}

const unreadBeforeEnter = async (to, _from, next) => {
  await store.dispatch(
    'listProjects',
    store.state.selectedProject ? store.state.selectedProject.id : null
  )
  store.commit(
    'setUnreadNuggetsViewState',
    new ViewState({ page: parseInt(to.query.page) })
  )
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.phases.length) {
    await store.dispatch('listPhases')
  }
  next()
}

const subscribedBeforeEnter = async (to, _from, next) => {
  await store.dispatch(
    'listProjects',
    store.state.selectedProject ? store.state.selectedProject.id : null
  )
  store.commit(
    'setSubscribedNuggetsViewState',
    new ViewState({ page: parseInt(to.query.page) })
  )
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.phases.length) {
    await store.dispatch('listPhases')
  }
  next()
}

const tagsBeforeEnter = async (to, _from, next) => {
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  next()
}

const workflowsBeforeEnter = async (to, _from, next) => {
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  next()
}

const groupsBeforeEnter = async (to, _from, next) => {
  if (!store.state.groups.length) {
    await store.dispatch('listGroups')
  }
  next()
}

const skillsBeforeEnter = async (to, _from, next) => {
  if (!store.state.skills.length) {
    await store.dispatch('listSkills')
  }
  next()
}

const usersBeforeEnter = async (to, _from, next) => {
  if (!store.state.skills.length) {
    await store.dispatch('listSkills')
  }
  if (!store.state.groups.length) {
    await store.dispatch('listGroups')
  }
  next()
}

const calendarBeforeEnter = async (to, _from, next) => {
  if (!store.state.events.length) {
    await store.dispatch('listEvents')
  }
  if (!store.state.eventTypes.length) {
    await store.dispatch('listEventTypes')
  }
  next()
}

const assignedBeforeEnter = async (to, _from, next) => {
  if (!store.state.items.length) {
    await store.dispatch('listItems')
  }
  next()
}

const beforeEnter = async (to, _from, next) => {
  document.title = to.meta.title
  let casRoutesRegex = /^\/((?:settings)|(?:organizations))(?:\/.*)?$/
  if (!to.path.match(/\/error.*/)) {
    if (
      !window.__restfulpy_metadata__ ||
      !window.__restfulpy_metadata__[`${DOLPHIN_BASE_URL}/apiv1`]
    ) {
      await server.loadMetadata(dolphinEntities)
      await jaguarServer.loadMetadata(jaguarEntities)
      store.dispatch('createReleaseClass')
      store.dispatch('createProjectClass')
      store.dispatch('createDraftNuggetClass')
      store.dispatch('createNuggetClass')
      store.dispatch('createMemberClass')
      store.dispatch('createOrganizationClass')
      store.dispatch('createWorkflowClass')
      store.dispatch('createPhaseClass')
      store.dispatch('createTagClass')
      store.dispatch('createFileClass')
      store.dispatch('createResourceClass')
      store.dispatch('createInvitationClass')
      store.dispatch('createGroupClass')
      store.dispatch('createJaguarMessageClass')
      store.dispatch('createJaguarTargetClass')
      store.dispatch('createSkillClass')
      store.dispatch('createEventClass')
      store.dispatch('createEventTypeClass')
      store.dispatch('createItemClass')
    }
    if (
      to.path.match(casRoutesRegex) &&
      !window.__restfulpy_metadata__[CAS_BACKEND_URL]
    ) {
      await casServer.loadMetadata(casEntities)
      store.dispatch('createCasMemberClass')
    }
  }
  next()
}

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      },
      beforeEnter: homeBeforeEnter,
      children: [
        // RELEASES

        {
          path: '/releases/:releaseId?',
          name: 'Releases',
          component: () =>
            import(
              /* webpackChunkName: "ReleaseList" */ './components/ReleaseList'
            ),
          meta: {
            title: 'Releases'
          },
          beforeEnter: releasesBeforeEnter
        },

        // PROJECTS

        {
          path: '/releases/:releaseId/projects/:projectId?',
          name: 'Projects',
          component: () =>
            import(
              /* webpackChunkName: "ProjectList" */ './components/ProjectList'
            ),
          meta: {
            title: 'Projects'
          },
          beforeEnter: projectsBeforeEnter
        },
        {
          path: '/projects/:projectId?',
          name: 'ProjectsWithoutRelease',
          component: () =>
            import(
              /* webpackChunkName: "ProjectList" */ './components/ProjectList'
            ),
          meta: {
            title: 'Projects'
          },
          beforeEnter: projectsBeforeEnter
        },

        // NUGGETS

        {
          path: '/releases/:releaseId/projects/:projectId/nuggets/:nuggetId?',
          name: 'Nuggets',
          component: () =>
            import(
              /* webpackChunkName: "NuggetList" */ './components/NuggetList'
            ),
          meta: {
            title: 'Nuggets'
          },
          beforeEnter: nuggetsBeforeEnter
        },
        {
          path: '/projects/:projectId/nuggets/:nuggetId?',
          name: 'NuggetsWithoutRelease',
          component: () =>
            import(
              /* webpackChunkName: "NuggetList" */ './components/NuggetList'
            ),
          meta: {
            title: 'Nuggets'
          },
          beforeEnter: nuggetsBeforeEnter
        },

        // UNREAD

        {
          path: '/unread',
          name: 'Unread',
          component: () =>
            import(/* webpackChunkName: "Unread" */ './components/Unread'),
          meta: {
            title: 'Unread'
          },
          beforeEnter: unreadBeforeEnter
        },

        // SUBSCRIBED

        {
          path: '/subscribed/:subscribedId?',
          name: 'Subscribed',
          component: () =>
            import(
              /* webpackChunkName: "Subscribed" */ './components/Subscribed'
            ),
          meta: {
            title: 'Subscribed'
          },
          beforeEnter: subscribedBeforeEnter
        },
        // ASSIGNED

        {
          path: '/assigned',
          name: 'Assigned',
          component: () =>
            import(/* webpackChunkName: "ASSIGNED" */ './pages/Assigned'),
          meta: {
            title: 'Assigned'
          },
          redirect: {
            name: 'InprogressItems'
          },
          children: [
            // INPROGRESSITEMS

            {
              path: 'inprogress-items',
              name: 'InprogressItems',
              component: () =>
                import(
                  /* webpackChunkName: "InprogressItems" */ './components/InprogressItems'
                ),
              meta: {
                title: 'Subscribed'
              },
              beforeEnter: subscribedBeforeEnter
            }
          ],
          beforeEnter: assignedBeforeEnter
        }
      ]
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () =>
        import(/* webpackChunkName: "Settings" */ './pages/Settings'),
      redirect: {
        name: 'PersonalSettings'
      },
      meta: {
        title: 'Settings'
      },
      children: [
        // MAESTRO SETTINGS

        {
          path: 'maestro_settings',
          name: 'MaestroSettings',
          component: () =>
            import(
              /* webpackChunkName: "MaestroSettings" */ './pages/MaestroSettings'
            ),
          meta: {
            title: 'Maestro Settings'
          },
          children: [
            {
              path: 'users',
              name: 'Users',
              component: () =>
                import(/* webpackChunkName: "Users" */ './pages/Users'),
              meta: {
                title: 'Users'
              },
              beforeEnter: usersBeforeEnter
            },
            {
              path: 'groups',
              name: 'Groups',
              component: () =>
                import(/* webpackChunkName: "Groups" */ './pages/Groups'),
              meta: {
                title: 'Groups'
              },
              beforeEnter: groupsBeforeEnter
            },
            {
              path: 'skills',
              name: 'Skills',
              component: () =>
                import(/* webpackChunkName: "Skills" */ './pages/Skills'),
              meta: {
                title: 'Skills'
              },
              beforeEnter: skillsBeforeEnter
            },
            {
              path: 'phases',
              name: 'Phases',
              component: () =>
                import(/* webpackChunkName: "Phases" */ './pages/Phases'),
              meta: {
                title: 'phases'
              }
            },
            {
              path: 'tags',
              name: 'Tags',
              component: () =>
                import(/* webpackChunkName: "Tags" */ './pages/Tags'),
              meta: {
                title: 'Tags'
              },
              beforeEnter: tagsBeforeEnter
            },
            {
              path: 'workflows',
              name: 'Workflows',
              component: () =>
                import(/* webpackChunkName: "Workflows" */ './pages/Workflows'),
              meta: {
                title: 'Workflows'
              },
              beforeEnter: workflowsBeforeEnter
            },
            {
              path: 'calendar',
              name: 'Calendar',
              component: () =>
                import(/* webpackChunkName: "Calendar" */ './pages/Calendar'),
              meta: {
                title: 'Calendar'
              },
              beforeEnter: calendarBeforeEnter
            }
          ]
        },

        // PERSONAL SETTINGS

        {
          path: 'personal_settings',
          name: 'PersonalSettings',
          component: () =>
            import(
              /* webpackChunkName: "PersonalSettings" */ './pages/PersonalSettings'
            ),
          redirect: {
            name: 'Profile'
          },
          meta: {
            title: 'Personal settings'
          },
          children: [
            {
              path: 'profile',
              name: 'Profile',
              component: () =>
                import(/* webpackChunkName: "Profile" */ './pages/Profile'),
              meta: {
                title: 'Profile'
              }
            },
            {
              path: 'accounts',
              name: 'Accounts',
              component: () =>
                import(/* webpackChunkName: "Accounts" */ './pages/Accounts'),
              redirect: {
                name: 'MyOrganizations'
              },
              meta: {
                title: 'Accounts'
              },
              children: [
                {
                  path: '',
                  name: 'MyOrganizations',
                  component: () =>
                    import(
                      /* webpackChunkName: "MyOrganizations" */ './pages/MyOrganizations'
                    ),
                  meta: {
                    title: 'My Organizations'
                  }
                },
                {
                  path: ':id/invite',
                  name: 'Invite',
                  meta: {
                    title: 'Invite'
                  },
                  component: () =>
                    import(
                      /* webpackChunkName: "Invite" */ './pages/Invite.vue'
                    )
                },
                {
                  path: 'new_account',
                  name: 'NewAccount',
                  meta: {
                    title: 'NewAccount'
                  },
                  component: () =>
                    import(
                      /* webpackChunkName: "NewAccount" */ './pages/NewAccount.vue'
                    )
                }
              ]
            },
            {
              path: 'security',
              name: 'Security',
              component: () =>
                import(/* webpackChunkName: "Security" */ './pages/Security'),
              meta: {
                title: 'Security'
              }
            }
          ]
        }
      ],
      beforeEnter: settingBeforeEnter
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ './pages/Login'),
      meta: {
        title: 'Login'
      },
      beforeEnter: afterAuth
    },
    {
      path: '/error',
      name: 'Error',
      component: () =>
        import(/* webpackChunkName: "Error" */ './pages/ErrorPage'),
      meta: {
        title: 'Error'
      },
      children: [
        {
          path: '404',
          name: '404',
          component: () =>
            import(/* webpackChunkName: "404" */ './pages/NotFound.vue'),
          meta: {
            title: 'Not Found'
          }
        },
        {
          path: '500',
          name: '500',
          component: () =>
            import(
              /* webpackChunkName: "500" */ './pages/InternalServerError.vue'
            ),
          props: true,
          meta: {
            title: 'Internal Server Error'
          }
        }
      ]
    }
  ]
})

router.beforeEach(beforeEnter)
export default router
