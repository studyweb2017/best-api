// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
<<<<<<< HEAD
import router from './service/router.ts'
=======
import router from './router.ts'
// import iview from 'iview'
// import 'iview/dist/styles/iview.css'
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.config.productionTip = false

// Vue.use(iview)
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
