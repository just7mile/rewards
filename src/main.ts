import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import firebase from 'firebase';
import BootstrapVue from 'bootstrap-vue';

firebase.initializeApp({
  apiKey: 'AIzaSyAKBFfzLG_jFbudiyJrLSbrIs00x8-x8O0',
  authDomain: 'rewards-db.firebaseapp.com',
  databaseURL: 'https://rewards-db.firebaseio.com',
  projectId: 'rewards-db',
  storageBucket: 'rewards-db.appspot.com',
  messagingSenderId: '163297604392',
});

export const firestore = firebase.firestore();

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
