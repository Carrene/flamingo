import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelidate from 'vuelidate'
import store from './store'
import VueSimpleSVG from 'vue-simple-svg'
import VSelect from 'vue-select'

Vue.config.productionTip = false

require('./styles/index.sass')
require('./helpers')
Vue.use(Vuelidate)
Vue.use(VueSimpleSVG)
Vue.use(VSelect)

Vue.component('v-select', VSelect)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
