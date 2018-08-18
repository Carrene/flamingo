import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Home from '@/pages/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: Login
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        title: Signup
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
