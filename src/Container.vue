<template>
  <div class="app">
    <Header fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile v-if="userRole === 'admin'" />
      <b-link class="navbar-brand" to="#">
        <h2><i><b><router-link to="/">Rewards</router-link></b></i></h2>
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" v-if="userRole === 'admin'" />
      <b-navbar-nav class="ml-auto">
        <HeaderDropdown right no-caret>
          <template slot="header">
            <img src="img/avatars/1.jpg" class="img-avatar" alt="admin@bootstrapmaster.com" />
          </template>\
          <template slot="dropdown">
            <b-dropdown-header tag="div" class="text-center"><strong>{{getUserFIO}}</strong></b-dropdown-header>
            <b-dropdown-item><i class="fa fa-user" /> <router-link to="/profile">Profile</router-link></b-dropdown-item>
            <b-dropdown-item @click="logout"><i class="fa fa-lock" /> Logout</b-dropdown-item>
          </template>
        </HeaderDropdown>
      </b-navbar-nav>
    </Header>
    <div class="app-body">
      <Sidebar fixed v-if="userRole === 'admin'">
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="navigations"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </Sidebar>
      <main class="main">
        <Breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import firebase from 'firebase';
  import router from '@/router';

  import {
    Header,
    SidebarToggler,
    Sidebar,
    SidebarFooter,
    SidebarForm,
    SidebarHeader,
    SidebarMinimizer,
    SidebarNav,
    Breadcrumb,
    HeaderDropdown,
  } from '@coreui/vue';

  @Component({
    components: {
      Header,
      Sidebar,
      Breadcrumb,
      SidebarForm,
      SidebarFooter,
      SidebarToggler,
      SidebarHeader,
      SidebarNav,
      SidebarMinimizer,
      HeaderDropdown,
    },
  })
  export default class Container extends Vue {
    private state: any;
    private navigations: any[] = [
      {
        name: 'Users',
        url: '/users',
        icon: 'icon-people',
      },
      {
        name: 'Positions',
        url: '/positions',
        icon: 'icon-briefcase',
      },
    ];

    constructor() {
      super();
      this.state = this.$store.state;
    }

    get list() {
      return this.$route.matched.filter((route) => route.name || route.meta.label );
    }

    get getUserFIO() {
      if (this.$store.state.user)
        return this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName;
      else
        return '';
    }

    get userRole() {
      if (this.$store.state.user)
        return this.$store.state.user.role;
      else
        return '';
    }

    logout() {
      firebase.auth().signOut().finally(() => {
        this.$store.dispatch('logout').finally(() => {
          router.push('/');
        });
      });
    }
  }
</script>
