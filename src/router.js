import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'

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
    }
  ]
})
