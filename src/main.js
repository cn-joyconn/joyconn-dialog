import Vue from 'vue'
import App from './App.vue'
import router from './router';

import VueHighlightJS from 'vue-highlightjs'// 告诉Vue 要使用插件 vue-highlightjs
Vue.use(VueHighlightJS)//在 template 模板中加入代码高亮:
Vue.config.productionTip = false



import {JoyDialog} from './js/dialog.js';
window.JoyDialog=JoyDialog
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
