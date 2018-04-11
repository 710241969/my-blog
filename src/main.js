import Vue from 'vue';
import App from './App.vue';
import router from './routers';
import store from './store';
import './assets/js/global'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
