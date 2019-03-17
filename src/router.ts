import Vue from 'vue';
import Router from 'vue-router';
import Container from '@/Container.vue';
import Main from '@/views/main/Main.vue';
import Users from '@/views/users/Users.vue';
import Positions from '@/views/positions/Positions.vue';
import Position from '@/views/positions/Position.vue';
import Login from '@/views/pages/Login.vue';
import Profile from '@/views/profile/Profile.vue';
import Page404 from '@/views/pages/Page404.vue';
import Page500 from '@/views/pages/Page500.vue';
import firebase from 'firebase';
import { firestore } from '@/main';
import { store } from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: 'main',
      name: 'home',
      component: Container,
      children: [
        {
          path: 'main',
          name: 'Main',
          component: Main,
        },
        {
          path: 'users',
          name: 'Users',
          component: Users,
        },
        {
          path: 'positions',
          name: 'Positions',
          component: Positions,
        },
        {
          path: 'position',
          name: 'Position',
          component: Position,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
        },
      ],
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) {
          return c('router-view');
        },
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404,
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500,
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
        },
      ],
    },
    {
      path: '*',
      redirect: '/pages/404',
    },
  ],
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(auth => {
    if (to.path === '/pages/login') next();
    else if (auth) {
      firestore.collection('users').doc(auth.uid).get().then(user => {
        if (!user.exists) next('/pages/login');
        else {
          store.dispatch('login', user.data());
          next();
        }
      }).catch(() => {
        next('/pages/login');
      });
    } else next('/pages/login');
  });
});

export default router;
