<template>
  <div>
    <b-row>
      <b-col cols="12" xl="12">
        <transition name="slide">
          <b-card :header="'Users'">
            <b-table :hover="true" :striped="true" :bordered="false" :small="false" :fixed="false" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" @row-clicked="rowClicked">
              <template slot="firstName" slot-scope="data">
                <strong>{{data.item.firstName}}</strong>
              </template>
              <template slot="lastName" slot-scope="data">
                <strong>{{data.item.lastName}}</strong>
              </template>
            </b-table>
            <nav>
              <b-row>
                <b-col cols="6">
                  <b-pagination size="sm" :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-spinner v-if="loading"></b-spinner>
                  <b-button type="button" variant="success" v-if="!loading" @click="newUser">ADD</b-button>
                </b-col>
              </b-row>
            </nav>
          </b-card>
        </transition>
      </b-col>
    </b-row>

    <b-modal title="New user" class="modal-info" v-model="userModal" @ok="saveUser" ok-variant="info" @cancel="onCancel">

      <b-form>
        <b-form-group
            label="First Name"
            label-for="firstName"
            description="Please enter user first name."
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="firstName" type="text" placeholder="Enter First Name.." v-model="user.firstName"></b-form-input>
        </b-form-group>
        <b-form-group
            label="Last Name"
            label-for="lastName"
            description="Please enter user last name."
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="lastName" type="text" placeholder="Enter Last Name.." v-model="user.lastName"></b-form-input>
        </b-form-group>
        <b-form-group
            label="Position"
            label-for="position"
            description="Please enter choose user position."
            :label-cols="3"
            :horizontal="true">
          <b-form-select id="position" :options="positionsOpts" v-model="user.position" @change="onPositionChange"></b-form-select>
        </b-form-group>
        <b-form-group
            label="Grade"
            label-for="grade"
            description="Please enter choose user grade."
            :label-cols="3"
            :horizontal="true">
          <b-form-select id="grade" :options="gradesOpts" v-model="user.grade" @change="onGradeChange"></b-form-select>
        </b-form-group>
        <!--<b-form-group
            label="Salary"
            label-for="salary"
            description="Please enter user salary."
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="salary" type="text" placeholder="Enter Salary.." v-model="user.salary"></b-form-input>
        </b-form-group>
        <b-form-group
            label="Overwork"
            label-for="overwork"
            description="Please enter user overwork cost per hour."
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="overwork" type="text" placeholder="Enter Salary.." v-model="user.overwork"></b-form-input>
        </b-form-group>-->
        <b-form-group
            label="Email"
            label-for="email"
            description="Please enter user email."
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="email" type="email" placeholder="Enter Email.." autocomplete="username email" v-model="user.email"></b-form-input>
        </b-form-group>
        <b-form-group
            label="Password"
            label-for="pass"
            description="Please enter user password."
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="pass" type="password" placeholder="Enter Password.." autocomplete="current-password" v-model="user.password"></b-form-input>
        </b-form-group>
      </b-form>

    </b-modal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { firestore } from '@/main';
  import firebase from 'firebase';
  import router from '@/router';

  @Component
  export default class Users extends Vue {
    private items: any[] = [];
    private fields: any[] = [
      {key: 'firstName'},
      {key: 'lastName'},
      {key: 'position'},
      {key: 'grade'},
      {key: 'salary'},
      {key: 'role'}
    ];
    private currentPage: number = 1;
    private perPage: number = 10;
    private loading: boolean = false;
    private userModal: boolean = false;
    private user: any = {};
    private positions: any[] = [];
    private curGrades: any[] = [];
    private positionsOpts: any[] = [];
    private gradesOpts: any[] = [];

    constructor() {
      super();
      if (!this.$store.state.user || this.$store.state.user.role === 'user') router.push('/');
      else if (this.$store.state.user.role === 'admin') {
        this.loading = true;
        this.items = [];
        firestore.collection('users').where('role', '==', 'manager').onSnapshot(snapshot => {
          snapshot.forEach(user => {
            this.items.push(user.data());
          });
          this.stopLoading();
        });
        firestore.collection('users').where('role', '==', 'user').onSnapshot(snapshot => {
          snapshot.forEach(user => {
            this.items.push(user.data());
          });
          this.loading = false;
          this.stopLoading();
        });
      } else {
        this.loading = true;
        this.items = [];
        firestore.collection('users').where('role', '==', 'user').onSnapshot(snapshot => {
          snapshot.forEach(user => {
            this.items.push(user.data());
          });
          this.stopLoading();
        });
      }

      firestore.collection('positions').onSnapshot(snapshot => {
        let tmp = [];
        snapshot.forEach(p => {
          tmp.push(p.data());
        });
        this.updatePositions(tmp);
      });
    }

    updatePositions(opts) {
      this.positions = [];
      this.positionsOpts = [];
      for (let p of opts) {
        this.positions.push(p);
        if (!p.name) continue;
        this.positionsOpts.push(p.name);
      }
    }

    onPositionChange() {
      this.gradesOpts = [];
      let tmp = this.positions.find(e => e.name === this.user.position);
      if (tmp) {
        this.curGrades = tmp.grades;
        for (let g of tmp.grades) {
          if (!g.name) continue;
          this.gradesOpts.push(g.name);
        }
      }
    }

    onGradeChange() {
      let tmp = this.curGrades.find(e => e.name === this.user.grade);
      if (tmp) {
        this.user.kpis = tmp.kpis;
        this.user.overwork = tmp.overwork;
        this.user.salary = tmp.salary;
      }
    }

    private stopLoading() {
      this.loading = false;
    }

    private rowClicked() {
    }

    getRowCount() {
      return this.items.length;
    }

    newUser() {
      this.userModal = true;
      this.user = {};
    }

    saveUser() {
      this.user.role = 'user';
      this.userModal = false;
      console.log("===> ", this.user);
      firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then(user => {
        if (user && user.user && user.user.uid) {
          console.log("-----> ", user.user.uid);
          firestore.collection('users').doc(user.user.uid).set(this.user).then(() => {
            this.$router.push('/users');
          }).catch(() => {
            alert("Something went wrong...");
          });
        }
      }).catch(() => {
        alert("Something went wrong...");
      });
    }

    onCancel() {
      this.user = {};
    }
  }
</script>
