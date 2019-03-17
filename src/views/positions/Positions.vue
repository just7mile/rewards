<template>
  <div>
    <b-row>
      <b-col cols="12" xl="12">
        <transition name="slide">
          <b-card :header="'Positions'">
            <b-table :hover="true" :striped="true" :bordered="false" :small="false" :fixed="false" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" @row-clicked="rowClicked">
              <template slot="name" slot-scope="data">
                <strong>{{data.item.name}}</strong>
              </template>
              <template slot="grades" slot-scope="data">
                <span v-for="g in data.item.grades">{{g.name}}: <span v-for="k in g.kpis">{{k.name}},{{k.price}};</span> </span>
              </template>
            </b-table>
            <nav>
              <b-row>
                <b-col cols="6">
                  <b-pagination size="sm" :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-spinner v-if="loading"></b-spinner>
                  <b-button type="button" variant="default" v-if="!loading"><router-link to="/position">ADD</router-link></b-button>
                </b-col>
              </b-row>
            </nav>
          </b-card>
        </transition>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { firestore } from '@/main';
  import router from '@/router';

  @Component
  export default class Positions extends Vue {
    private items: any[] = [];
    private fields: any[] = [
      {key: 'name'},
      {key: 'grades'},
    ];
    private currentPage: number = 1;
    private perPage: number = 10;
    private loading: boolean = false;
    private positionModal: boolean = false;
    private position: any = {};

    constructor() {
      super();
      if (!this.$store.state.user || this.$store.state.user.role === 'user') router.push('/');
      else {
        this.loading = true;
        this.items = [];
        firestore.collection('positions').onSnapshot(snapshot => {
          snapshot.forEach(pos => {
            this.items.push(pos.data());
          });
          this.stopLoading();
        });
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

    newPosition() {
      this.positionModal = true;
      this.position = {};
    }

    savePosition() {
      this.positionModal = false;
    }
  }
</script>
