import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUrl: ""
  },
  getters: {
    getCurrentUrl() {
      return state.currentUrl
    },
  },
  mutations: {
    setCurrentUrl(state, url) {
      state.currentUrl = url
    },
  },
  actions: {
    setCurrentUrl(context, url) {
      context.commit('setCurrentUrl', url)
    },
  },
});
