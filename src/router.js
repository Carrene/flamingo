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
      unsubscribe: 'UNSUBSCRIBE'
    }
  },
  Issue: {
    url: 'issues',
    verbs: {
      create: 'DEFINE',
      update: 'UPDATE',
      load: 'LIST',
      subscribe: 'SUBSCRIBE',
      unsubscribe: 'UNSUBSCRIBE'
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
  if (!server.authenticator.authenticated) {
    if (to.query.code) {
      let redirectURL = new URL(to.query.redirectUri)
      await server.login(to.query.code)
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

const beforeEnter = async (to, _from, next) => {
  document.title = to.meta.title
  let casRoutesRegex = /^\/((?:settings)|(?:organizations))(?:\/.*)?$/
  if (!to.path.match(/\/error.*/)) {
    if (
      !window.__restfulpy_metadata__ ||
      !window.__restfulpy_metadata__[`${DOLPHIN_BASE_URL}/apiv1`]
    ) {
      await server.loadMetadata(dolphinEntities)
      store.commit('createNuggetClass')
      store.commit('createProjectClass')
      store.commit('createReleaseClass')
      store.commit('createMemberClass')
      store.commit('createOrganizationClass')
    }
    if (to.path.match(casRoutesRegex) && !window.__restfulpy_metadata__[CAS_BACKEND_URL]) {
      await casServer.loadMetadata(casEntities)
      store.commit('createCasMemberClass')
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
      component: () => import(/* webpackChunkName: "ProjectList" */ './components/ProjectList'),
      meta: {
        title: 'Projects'
      }
    },
    {
      path: '/projects/:projectId/nuggets/:nuggetId?',
      name: 'Nuggets',
      component: () => import(/* webpackChunkName: "NuggetList" */ './components/NuggetList'),
      meta: {
        title: 'Nuggets'
      }
    }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "Settings" */ './pages/Settings'),
    redirect: {
      name: 'Profile'
    },
    meta: {
      title: 'Settings'
    },
    children: [{
      path: 'profile',
      name: 'Profile',
      component: () => import(/* webpackChunkName: "Profile" */ './components/Profile'),
      meta: {
        title: 'Profile'
      }
    },
    {
      path: 'organizations',
      name: 'MyOrganizations',
      component: () => import(/* webpackChunkName: "MyOrganizations" */ './components/MyOrganizations'),
      meta: {
        title: 'My Organizations'
      }
    },
    {
      path: 'account',
      name: 'Account',
      component: () => import(/* webpackChunkName: "Account" */ './components/Account'),
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
    component: () => import(/* webpackChunkName: "Error" */ './pages/ErrorPage'),
    meta: {
      title: 'Error'
    },
    children: [{
      path: '404',
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ './components/NotFound.vue'),
      meta: {
        title: 'Not Found'
      }
    },
    {
      path: '500',
      name: '500',
      component: () => import(/* webpackChunkName: "500" */ './components/InternalServerError.vue'),
      meta: {
        title: 'Internal Server Error'
      }
    }
    ]
  },
  {
    path: '/organizations',
    name: 'Organizations',
    component: () => import(/* webpackChunkName: "NewOrganization" */ './pages/Organizations.vue'),
    meta: {
      title: 'Organizations'
    },
    children: [{
      path: 'new',
      name: 'NewOrganization',
      component: () => import(/* webpackChunkName: "NewOrganization" */ './pages/NewOrganization.vue'),
      meta: {
        title: 'New Organization'
      }
    }],
    beforeEnter: requireAuth
  }
  ]
})

router.beforeEach(beforeEnter)
export default router
