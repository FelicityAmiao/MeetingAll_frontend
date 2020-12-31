import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Echarts from 'echarts';
import './permission';
import './assets/css/all.css';
Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, '$echarts', { value: Echarts });

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
