import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Home from '@/pages/Home'
import { server } from './server'

Vue.use(Router)

// FIXME: deciding about this guard
// const requireAuth = (to, _from, next) => {
//   if (!server.authenticator.authenticated) {
//     next({
//       path: '/login',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   } else {
//     next()
//   }
// }

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
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login'
      },
      beforeEnter: afterAuth
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        title: 'Signup'
      },
      beforeEnter: afterAuth
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})

router.beforeEach(addMeta)
export default router
