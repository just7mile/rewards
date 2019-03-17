<template>
  <div class="home">
    <b-row class="justify-content-center">
      <b-col md="8">
        <b-card-group>
          <b-card no-body class="p-4">
            <b-card-body>
              <b-form>
                <b-form-group
                label="Salary"
                label-cols="3">
                  {{user.salary}}₸
                </b-form-group>
                <b-form-group
                label="Taxes"
                label-cols="3">
                  10%
                </b-form-group>
                <b-form-group
                label="Pension"
                label-cols="3">
                  10%
                </b-form-group>
                <b-form-group v-for="k in kpis"
                    :label="k.name"
                    :label-for="k.name"
                    :description="k.type === 'percent'?'The KPI is ' + k.percentage + '% for ' + k.price + '₸': k.price + '₸ for every ' + k.freq"
                    :label-cols="3"
                    :horizontal="true">
                  <b-form-input :id="k.name" type="number" placeholder="Enter KPI.." v-model="k.value"></b-form-input>
                </b-form-group>
                <b-form-group
                    label="Overwork"
                    label-for="overwork"
                    :description="'The amount of hours spent out of working schedule (' + user.overwork + '₸ for each hour)'"
                    :label-cols="3"
                    :horizontal="true">
                  <b-form-input id="overwork" type="number" placeholder="Enter amount of hours" v-model="overwork"></b-form-input>
                </b-form-group>
              </b-form>
            </b-card-body>
            <b-card-footer>
              <b-button type="button" variant="success" block @click="calc">CALCULATE</b-button>
            </b-card-footer>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center" style="margin-top: 30px;">
      <b-col md="4">
        <b-card-group>
          <b-card no-body class="p-4">
            <b-card-body>
              <h1 class="text-center"><span style="font-weight: normal;">Reward: </span> <b>{{total}}₸</b></h1>
            </b-card-body>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center" style="margin-top: 30px;" v-if="total !== null">
      <b-col md="10">
        <b-card-group>
          <b-card no-body class="p-4">
            <b-card-body>
              <BarChart :cdata="chartData" v-if="showData"></BarChart>
            </b-card-body>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import BarChart from '@/components/BarChart';
  import firebase from 'firebase';
  import {firestore} from "../../main";

  @Component({
    components: {
      BarChart,
    },
  })
  export default class Main extends Vue {

    private kpis: any[];
    private total: number = null;
    private overwork: number = 0;
    private showData = false;

    private chartData: any = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Standard KPI',
            backgroundColor: 'red',
            data: []
          },
          {
            label: 'Your KPI',
            backgroundColor: 'blue',
            data: []
          },
          {}
        ]
    };

    private get user() {
      return this.$store.state.user;
    }

    constructor() {
      super();
      this.kpis = [];
      this.chartData = {
        labels: [],
        datasets: [{
          label: 'Standard KPI',
          backgroundColor: 'red',
          data: []
        }],
      };
      if (this.$store.state.user && this.$store.state.user.kpis) {
        for (let k of this.$store.state.user.kpis) {
          let tmp = {
            name: k.name,
            type: k.type,
            percentage: k.percentage,
            freq: k.freq,
            price: k.price,
            value: null
          };
          this.kpis.push(tmp);
          this.chartData.labels.push(k.name);
          if (k.type === 'percent') this.chartData.datasets[0].data.push(k.percentage);
          else this.chartData.datasets[0].data.push(k.freq);
        }
      }

      firestore.collection('users').doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
        if (snapshot) this.$store.dispatch('login', snapshot.data());
      });
    }

    private calc() {
      this.showData = false;
      this.total = (this.overwork?this.overwork:0) * this.user.overwork;
      this.chartData.datasets[1] = {
        label: 'Your KPI',
        backgroundColor: 'blue',
        data: []
      };
      for (let k of this.kpis) {
        if (!k.value) k.value = 0;
        k.value = parseFloat(k.value);
        if (k.type === 'percent') this.total += (k.price * k.value) / k.percentage;
        else this.total += Math.floor(k.value / k.freq) * k.price;
        this.chartData.datasets[1].data.push(k.value);
      }
      this.total -= this.total * 0.2;
      console.log("===> ", this.chartData.datasets[1].data);
      this.showData = true;
    }
  }
</script>
