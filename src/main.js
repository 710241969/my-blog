import Vue from 'vue';
import App from './App.vue';
import router from './routers';
import store from './store';
import ShowDown from './assets/js/show-down'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
