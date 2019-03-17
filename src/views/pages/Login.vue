<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Login</h1>
                  <p class="text-muted" v-if="!isInvalid">Sign In to your account</p>
                  <p class="text-danger" v-if="isInvalid">Invalid email or password</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="email" class="form-control" placeholder="email" autocomplete="username email" v-model="email" />
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="password" class="form-control" placeholder="Password" autocomplete="current-password" v-model="password" />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="login">Login</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-spinner v-if="loading"></b-spinner>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import firebase from 'firebase';
  import { firestore } from '@/main';
  import router from '@/router';

  @Component
  export default class Login extends Vue {
    private email: string = '';
    private password: string = '';
    private isInvalid: boolean = false;
    private loading: boolean = false;

    constructor() {
      super();
      if (firebase.auth().currentUser) router.push('/');
    }

    private login() {
      this.isInvalid = false;
      this.loading = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(auth => {
        if (auth && auth.user && auth.user.uid) {
          firestore.collection('users').doc(auth.user.uid).get().then(user => {
            if (user.exists) {
              this.$store.dispatch('login', user.data()).then(() => {
                router.push('/');
                this.loading = false;
              }).catch(() => {
                this.isInvalid = true;
                this.loading = false;
              });
            } else {
              this.isInvalid = true;
              this.loading = false;
            }
          }).catch(() => {
            this.isInvalid = true;
            this.loading = false;
          });
        }
      }).catch(() => {
        this.isInvalid = true;
        this.loading = false;
      });
    }
  }
</script>
