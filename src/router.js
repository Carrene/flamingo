import Vue from 'vue'
import Router from 'vue-router'
import Signup from '@/pages/Signup'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})
