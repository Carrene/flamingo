
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false

require('./styles/index.sass')
Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
