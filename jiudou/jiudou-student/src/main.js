/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import MessageTree from 'message-tree'

Vue.use(MessageTree)

import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer, {
  previewSize: 10,
  zIndex: 9999,
})

import md5 from 'js-md5'

import router from './router'
import store from './store'
var bus = new Vue()
Vue.prototype.$bus = bus
Vue.prototype.$md5 = md5

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
