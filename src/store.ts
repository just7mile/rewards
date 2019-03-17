import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
  },
  mutations: {
    login(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout(state) {
      state.user = null;
    },
  },
  actions: {
    login({commit}, user) {
      commit('login', user);
    },

    logout({commit}) {
      commit('logout');
    },
  },
});
