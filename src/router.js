import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Settings from './pages/Settings'
import server from './server'
import store from './store'

const entities = {
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
  if (!window.__restfulpy_metadata__) {
    await server.loadMetadata(entities)
    store.commit('createNuggetClass')
    store.commit('createContainerClass')
    store.commit('createReleaseClass')
    store.commit('createMemberClass')
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
    }
  ]
})

router.beforeEach(beforeEnter)
export default router
