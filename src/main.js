
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelidate from 'vuelidate'
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false

require('./styles/index.sass')
Vue.use(Vuelidate)

Vue.use(VTooltip)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
