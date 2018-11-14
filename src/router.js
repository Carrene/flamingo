import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Settings from './pages/Settings'
import { default as server, casServer } from './server'
import store from './store'
import ProjectList from './components/ProjectList.vue'
import NuggetList from './components/NuggetList.vue'
import NotFound from './pages/NotFound.vue'
import { DOLPHIN_BASE_URL, CAS_BACKEND_URL } from './settings'

const dolphinEntities = {
  Container: {
    url: 'containers',
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
  if (to.name !== 'NotFound') {
    if (!window.__restfulpy_metadata__ || !window.__restfulpy_metadata__[`${DOLPHIN_BASE_URL}/apiv1`]) {
      await server.loadMetadata(dolphinEntities)
      store.commit('createNuggetClass')
      store.commit('createProjectClass')
      store.commit('createReleaseClass')
      store.commit('createMemberClass')
    }
    if (to.path === '/settings' && (!window.__restfulpy_metadata__ || !window.__restfulpy_metadata__[CAS_BACKEND_URL])) {
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
    children: [{
      path: '/projects/:projectId?',
      name: 'Projects',
      component: ProjectList,
      meta: {
        title: 'Projects'
      }
    },
    {
      path: '/projects/:projectId/nuggets/:nuggetId?',
      name: 'Nuggets',
      component: NuggetList,
      meta: {
        title: 'Nuggets'
      }
    }
    ],
    beforeEnter: requireAuth
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Settings'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    },
    beforeEnter: afterAuth
  },
  {
    path: '/not_found',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'NotFound'
    }
  }
  ]
})

router.beforeEach(beforeEnter)
export default router
