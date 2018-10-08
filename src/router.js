import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'

Vue.use(Router)

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
      component: Home
    }
  ]
})

router.beforeEach(addMeta)
export default router
