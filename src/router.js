import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Login from './pages/Login'
import server from './server'

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

const addMeta = (to, _from, next) => {
  document.title = to.meta.title
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

router.beforeEach(addMeta)
export default router
