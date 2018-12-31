import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import {
  default as server,
  casServer
} from './server'
import store from './store'
import {
  DOLPHIN_BASE_URL,
  CAS_BACKEND_URL
} from './settings'

const dolphinEntities = {
  Project: {
    url: 'projects',
    verbs: {
      create: 'CREATE',
      update: 'UPDATE',
      load: 'LIST',
      subscribe: 'SUBSCRIBE',
      unsubscribe: 'UNSUBSCRIBE',
      attach: 'ATTACH'
    }
  },
  DraftIssue: {
    url: 'draftissues',
    verbs: {
      create: 'DEFINE',
      finalize: 'FINALIZE',
      add: 'ADD',
      remove: 'REMOVE'
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
      assign: 'ASSIGN'
    }
  },
  Release: {
    url: 'releases',
    verbs: {
      create: 'CREATE',
      update: 'UPDATE',
      load: 'LIST'
    }
  },
  Member: {
    url: '/members',
    verbs: {
      load: 'LIST'
    }
  },
  Organization: {
    url: 'organizations',
    verbs: {
      load: 'LIST',
      update: 'UPDATE',
      create: 'CREATE'
    }
  },
  OrganizationMember: {
    url: 'organizationmembers'
  },
  Workflow: {
    url: 'workflows',
    verbs: {
      load: 'LIST'
    }
  },
  Phase: {
    url: 'phases',
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

Vue.use(Router)

const requireAuth = async (to, _from, next) => {
  if (to.query.code) {
    let redirectUri
    if (to.query.redirectUri) {
      redirectUri = new URL(to.query.redirectUri)
    }
    await server.logout()
    await server.login(to.query.code, to.query.state)
    if (redirectUri) {
      next({
        path: redirectUri.pathname
      })
    } else {
      next()
    }
  }
  if (!server.authenticator.authenticated) {
    if (to.query.code) {
      let redirectURL = new URL(to.query.redirectUri)
      await server.login(to.query.code, to.query.state)
      next({
        path: redirectURL.pathname
      })
    } else {
      next({
        path: '/login',
        query: {
          redirectUri: window.location.href
        }
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

const projectsBeforeEnter = async (to, _from, next) => {
  await store.dispatch('listProjects', [to.params.projectId || undefined])
  next()
}

const nuggetsBeforeEnter = async (to, _from, next) => {
  if (!store.state.projects.length) {
    await store.dispatch('listProjects', [to.params.projectId])
  }
  await store.dispatch('listNuggets', [to.params.projectId, to.params.nuggetId || undefined])
  await store.dispatch('listPhases')
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
      await store.dispatch('createNuggetClass')
      await store.dispatch('createDraftNuggetClass')
      await store.dispatch('createProjectClass')
      await store.dispatch('createReleaseClass')
      await store.dispatch('createMemberClass')
      await store.dispatch('createOrganizationClass')
      await store.dispatch('createOrganizationMemberClass')
      await store.dispatch('createWorkflowClass')
      await store.dispatch('createPhaseClass')
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
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/projects',
    meta: {
      title: 'Home'
    },
    beforeEnter: requireAuth,
    children: [{
      path: '/projects/:projectId?',
      name: 'Projects',
      component: () =>
            import(/* webpackChunkName: "ProjectList" */ './components/ProjectList'),
      meta: {
        title: 'Projects'
      },
      beforeEnter: projectsBeforeEnter
    },
    {
      path: '/projects/:projectId/nuggets/:nuggetId?',
      name: 'Nuggets',
      component: () =>
            import(/* webpackChunkName: "NuggetList" */ './components/NuggetList'),
      meta: {
        title: 'Nuggets'
      },
      beforeEnter: nuggetsBeforeEnter
    }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
        import(/* webpackChunkName: "Settings" */ './pages/Settings'),
    redirect: {
      name: 'Profile'
    },
    meta: {
      title: 'Settings'
    },
    children: [{
      path: 'profile',
      name: 'Profile',
      component: () =>
            import(/* webpackChunkName: "Profile" */ './pages/Profile'),
      meta: {
        title: 'Profile'
      }
    },
    {
      path: 'organizations',
      name: 'Organizations',
      component: () =>
            import(/* webpackChunkName: "MyOrganizations" */ './pages/Organizations'),
      redirect: {
        name: 'MyOrganizations'
      },
      meta: {
        title: 'Organizations'
      },
      children: [{
        path: '',
        name: 'MyOrganizations',
        component: () =>
                import(/* webpackChunkName: "MyOrganizations" */ './pages/MyOrganizations'),
        meta: {
          title: 'My Organizations'
        }
      },
      {
        path: ':id',
        name: 'Organization',
        meta: {
          title: 'Organization'
        }
      },
      {
        path: ':id/invite',
        name: 'Invite',
        meta: {
          title: 'Invite'
        },
        component: () =>
                import(/* webpackChunkName: "Invite" */ './pages/Invite.vue')
      }
      ]
    },
    {
      path: 'account',
      name: 'Account',
      component: () =>
            import(/* webpackChunkName: "Account" */ './pages/Account'),
      meta: {
        title: 'Account'
      }
    }
    ],
    beforeEnter: requireAuth
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
    children: [{
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
            import(/* webpackChunkName: "500" */ './pages/InternalServerError.vue'),
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
