import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import { default as server, casServer, jaguarServer } from './server'
import store from './store'
import { DOLPHIN_BASE_URL, CAS_BACKEND_URL } from './settings'

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
      load: 'LIST',
      update: 'UPDATE',
      estimate: 'ESTIMATE'
    }
  },
  DailyReport: {
    url: 'dailyreports',
    verbs: {
      create: 'CREATE',
      load: 'LIST',
      update: 'UPDATE'
    }
  },
  PhasesSummary: {
    url: 'phasessummaries',
    verbs: {
      load: 'LIST'
    }
  },
  ResourcesSummary: {
    url: 'resourcessummaries',
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
    store.commit('setCurrentTab', 'Settings')
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
  await store.dispatch('listReleases', {})
  if (!store.state.groups.length) {
    await store.dispatch('listGroups')
  }
  store.commit('setCurrentTab', 'Releases')
  next()
}

const projectsBeforeEnter = async (to, from, next) => {
  if (!store.state.releases.length) {
    await store.dispatch('listReleases', {})
  }
  if (from.name !== to.name) {
    await store.dispatch('listProjects', {
      selectedProjectId: to.params.projectId
    })
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.groups.length) {
    await store.dispatch('listGroups')
  }
  store.commit('setCurrentTab', 'Projects')
  next()
}

const nuggetsBeforeEnter = async (to, _from, next) => {
  await store.dispatch('listAllProjects', {})
  if (!store.state.releases.length) {
    await store.dispatch('listReleases', {})
  }
  if (!store.state.projects.length) {
    await store.dispatch('listProjects', {
      selectedProjectId: to.params.projectId
    })
  }
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  store.commit('resetNuggetFilters')
  await store.dispatch('listNuggets', {})
  await store.dispatch('listPhasesOfSelectedWorkflow')
  store.commit('setCurrentTab', 'Nuggets')
  next()
}

const unreadBeforeEnter = async (to, _from, next) => {
  await store.dispatch(
    'listProjects',
    store.state.selectedProject
      ? { selectedProjectId: store.state.selectedProject.id }
      : {}
  )
  await store.dispatch('listAllProjects', {})
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.phases.length) {
    await store.dispatch('listPhases')
  }
  store.commit('setCurrentTab', 'Unread')
  next()
}

const subscribedBeforeEnter = async (to, _from, next) => {
  await store.dispatch(
    'listProjects',
    store.state.selectedProject
      ? { selectedProjectId: store.state.selectedProject.id }
      : {}
  )
  await store.dispatch('listAllProjects', {})
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.phases.length) {
    await store.dispatch('listPhases')
  }
  store.commit('setCurrentTab', 'Subscribed')
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
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.projects.length) {
    await store.dispatch('listProjects')
  }
  if (!store.state.phases.length) {
    await store.dispatch('listPhases')
  }
  await store.dispatch('listItems')
  store.commit('setCurrentTab', 'Assigned')
  next()
}

const inProgressItemsBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedZoneTab', 'inProgressNuggets')
  await store.dispatch('selectItem', store.state.inProgressItems[0])

  next()
}

const upcomingItemsBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedZoneTab', 'upcomingNuggets')
  await store.dispatch('selectItem', store.state.upcomingItems[0])

  next()
}

const needEstimateItemsBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedZoneTab', 'needEstimate')
  await store.dispatch('selectItem', store.state.needEstimateItems[0])

  next()
}

const newlyAssignedBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedZoneTab', 'newlyAssigned')
  await store.dispatch('selectItem', store.state.newlyAssignedItems[0])

  next()
}

const goodNewsBeforeEnter = async (to, _from, next) => {
  store.commit('setCurrentTab', 'GoodNews')

  next()
}

const badNewsBeforeEnter = async (to, _from, next) => {
  if (!store.state.tags.length) {
    await store.dispatch('listTags')
  }
  if (!store.state.workflows.length) {
    await store.dispatch('listWorkflows')
  }
  if (!store.state.projects.length) {
    await store.dispatch('listProjects')
  }
  if (!store.state.phases.length) {
    await store.dispatch('listPhases')
  }
  await store.dispatch('listBadNews')
  store.commit('setCurrentTab', 'BadNews')

  next()
}

const missingHoursBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedBadNewsTab', 'missingHours')
  await store.dispatch('selectItem', store.state.missingHoursItems[0])

  next()
}

const missingEstimateBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedBadNewsTab', 'missingEstimate')
  await store.dispatch('selectItem', store.state.missingEstimateItems[0])

  next()
}

const expiredTriageBeforeEnter = async (to, _from, next) => {
  store.commit('setSelectedBadNewsTab', 'expiredTriage')
  await store.dispatch('selectItem', store.state.expiredTriageNuggets[0])

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
      store.dispatch('createDailyReportClass')
      store.dispatch('createPhasesSummaryClass')
      store.dispatch('createResourcesSummaryClass')
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
          path: '/releases',
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
          path: '/releases/:releaseId/projects',
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
          path: '/projects',
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
          path: '/releases/:releaseId/projects/:projectId/nuggets',
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
          path: '/projects/:projectId/nuggets',
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
        // GOOD NEWS

        {
          path: '/good-news',
          name: 'GoodNews',
          component: () =>
            import(/* webpackChunkName: "GoodNews" */ './pages/GoodNews'),
          meta: {
            title: 'Good News'
          },
          redirect: {
            name: 'BacklogNuggets'
          },
          beforeEnter: goodNewsBeforeEnter,
          children: [
            {
              path: 'backlog-nuggets',
              name: 'BacklogNuggets',
              component: () =>
                import(
                  /* webpackChunkName: "BacklogNuggets" */ './components/BacklogNuggets'
                ),
              meta: {
                title: 'Backlog'
              }
            },
            {
              path: 'triage-nuggets',
              name: 'TriageNuggets',
              component: () =>
                import(
                  /* webpackChunkName: "TriageNuggets" */ './components/TriageNuggets'
                ),
              meta: {
                title: 'Triage'
              }
            },
            {
              path: 'need-approval-nuggets',
              name: 'NeedApprovalNuggets',
              component: () =>
                import(
                  /* webpackChunkName: "NeedApprovalNuggets" */ './components/NeedApprovalNuggets'
                ),
              meta: {
                title: 'Need Approval'
              }
            }
          ]
        },

        // BAD NEWS

        {
          path: '/bad-news',
          name: 'BadNews',
          component: () =>
            import(/* webpackChunkName: "BadNews" */ './pages/BadNews'),
          meta: {
            title: 'Bad News'
          },
          redirect: {
            name: 'MissingHours'
          },
          beforeEnter: badNewsBeforeEnter,
          children: [
            {
              path: 'missing-hours',
              name: 'MissingHours',
              component: () =>
                import(
                  /* webpackChunkName: "MissingHoursItems" */ './components/MissingHoursItems'
                ),
              meta: {
                title: 'Missing Hours'
              },
              beforeEnter: missingHoursBeforeEnter
            },
            {
              path: 'missing-estimate',
              name: 'MissingEstimate',
              component: () =>
                import(
                  /* webpackChunkName: "MissingEstimateItems" */ './components/MissingEstimateItems'
                ),
              meta: {
                title: 'Missing Estimate'
              },
              beforeEnter: missingEstimateBeforeEnter
            },
            {
              path: 'expired-triage',
              name: 'ExpiredTriage',
              component: () =>
                import(
                  /* webpackChunkName: "ExpiredTriageNuggets" */ './components/ExpiredTriageNuggets'
                ),
              meta: {
                title: 'Expired Triage'
              },
              beforeEnter: expiredTriageBeforeEnter
            }
          ]
        },

        // SUBSCRIBED

        {
          path: '/subscribed',
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
            name: 'InProgressItems'
          },
          children: [
            // INPROGRESS ITEMS

            {
              path: 'inprogress-items',
              name: 'InProgressItems',
              component: () =>
                import(
                  /* webpackChunkName: "InProgressItems" */ './components/InProgressItems'
                ),
              meta: {
                title: 'In Progress Nuggets'
              },
              beforeEnter: inProgressItemsBeforeEnter
            },
            {
              path: 'upcoming-items',
              name: 'UpcomingItems',
              component: () =>
                import(
                  /* webpackChunkName: "UpcomingItems" */ './components/UpcomingItems'
                ),
              meta: {
                title: 'Upcoming Nuggets'
              },
              beforeEnter: upcomingItemsBeforeEnter
            },
            {
              path: 'need-estimate-items',
              name: 'NeedEstimateItems',
              component: () =>
                import(
                  /* webpackChunkName: "NeedEstimateItems" */ './components/NeedEstimateItems'
                ),
              meta: {
                title: 'Need Estimate'
              },
              beforeEnter: needEstimateItemsBeforeEnter
            },
            // NEWLYASSIGNED

            {
              path: 'newly-assigned',
              name: 'NewlyAssigned',
              component: () =>
                import(
                  /* webpackChunkName: "NewlyAssigned" */ './components/NewlyAssigned'
                ),
              meta: {
                title: 'Newly Assigned'
              },
              beforeEnter: newlyAssignedBeforeEnter
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
            },
            {
              path: 'release-note',
              name: 'ReleaseNote',
              component: () =>
                import(
                  /* webpackChunkName: "ReleaseNote" */ './pages/ReleaseNote'
                ),
              meta: {
                title: 'Release Note'
              }
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
                    title: 'New Account'
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
