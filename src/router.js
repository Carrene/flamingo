import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Login from './pages/Login'
import { server } from './server'

Vue.use(Router)

const requireAuth = (to, _from, next) => {
  if (!server.authenticator.authenticated) {
    next({
      path: '/login'
    })
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
      }
    }
  ]
})

router.beforeEach(addMeta)
export default router
