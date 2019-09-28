import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/index.js'
import '@/style/common.css'
import '@/style/reset.css'
import '@/style/layout.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
