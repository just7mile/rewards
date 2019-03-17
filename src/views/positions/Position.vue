<template>
  <div>
    <b-card>
      <div slot="header">
        New Position
      </div>
      <b-form>
        <b-form-group
            label="Name"
            label-for="name"
            description="Please enter position name"
            :label-cols="3"
            :horizontal="true">
          <b-form-input id="name" type="text" placeholder="Enter Name.." v-model="position.name"></b-form-input>
        </b-form-group>
        <h2></h2>


        <b-card>
          <b-card-header>
            <b-card-title>
              Grades <b-button type="button" variant="success" @click="addGrade">ADD</b-button>
            </b-card-title>
          </b-card-header>
          <b-card-body>
            <b-table :hover="true" :striped="true" :bordered="false" :small="false" :fixed="false" responsive="sm" :items="position.grades" :fields="gradeFields">
              <template slot="name" slot-scope="data">
                <b-form-input type="text" placeholder="Enter Name.." v-model="data.item.name"></b-form-input>
              </template>
              <template slot="salary" slot-scope="data">
                <b-form-input type="text" placeholder="Enter Salary.." v-model="data.item.salary"></b-form-input>
              </template>
              <template slot="overwork" slot-scope="data">
                <b-form-input type="text" placeholder="Enter Overwork.." v-model="data.item.overwork"></b-form-input>
              </template>
              <template slot="kpis" slot-scope="data">
                <b-button type="button" @click="openKPIs(data.index)">KPIs</b-button>
              </template>
              <template slot="deleteit" slot-scope="data">
                <b-button type="button" variant="danger" @click="deleteGrade(data.index)">Delete</b-button>
              </template>
            </b-table>
          </b-card-body>
        </b-card>

        <div slot="footer" class="text-right">
          <b-button type="button" size="sm" variant="danger" style="margin-right: 10px;" @click="cancelIt" v-if="!loading"><i class="fa fa-ban"></i> Cancel</b-button>
          <b-button type="button" size="sm" variant="primary" right @click="submitIt" v-if="!loading"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
          <b-spinner v-if="loading" right></b-spinner>
        </div>
      </b-form>
    </b-card>

    <b-modal title="KPIs" class="modal-info" v-model="modal" @cancel="handleCancel" cancel-title="ADD" cancel-variant="success" ok-variant="info" ok-title="SAVE">
      <b-table v-if="gradeInd >= 0" :hover="true" :striped="true" :bordered="false" :small="false" :fixed="false" responsive="sm" :items="position.grades[gradeInd].kpis" :fields="kpiFields">
        <template slot="name" slot-scope="data">
          <b-form-input type="text" placeholder="Enter Name.." v-model="data.item.name"></b-form-input>
        </template>
        <template slot="type" slot-scope="data">
          <b-form-select :options="['percent', 'piece']" placeholder="Enter Type.." v-model="data.item.type"></b-form-select>
        </template>
        <template slot="fp" slot-scope="data">
          <b-form-input type="text" placeholder="Enter Frequency / Percentage.." v-model="data.item.fp"></b-form-input>
        </template>
        <template slot="price" slot-scope="data">
          <b-form-input type="text" placeholder="Enter Price.." v-model="data.item.price"></b-form-input>
        </template>
        <template slot="deleteit" slot-scope="data">
          <b-button type="button" variant="danger" @click="deleteKPI(data.index)">Delete</b-button>
        </template>
      </b-table>
    </b-modal>

  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { firestore } from '@/main';

  @Component
  export default class Position extends Vue {
    private position = {
      name: null,
      grades: [],
    };
    private gradeFields: any[] = [
      {key: 'name'},
      {key: 'salary'},
      {key: 'overwork'},
      {key: 'kpis'},
      {key: 'deleteit'}
    ];
    private kpiFields: any[] = [
      {key: 'name'},
      {key: 'type'},
      {key: 'fp', label: 'frequency / percentage'},
      {key: 'price'},
      {key: 'deleteit'}
    ];
    private loading: boolean = false;

    private modal: boolean = false;
    private gradeInd: number = -1;

    private stopLoading() {
      this.loading = false;
    }

    private addGrade() {
      this.position.grades.push({
        name: null,
        salary: null,
        overwork: null,
        kpis: []
      });
    }

    private deleteGrade(index: number) {
      this.position.grades.splice(index, 1);
    }

    private deleteKPI(index: number) {
      this.position.grades[this.gradeInd].kpis.splice(index, 1);
    }

    private openKPIs(index: number) {
      this.modal = true;
      this.gradeInd = index;
    }

    private handleCancel(evt) {
      evt.preventDefault();
      this.position.grades[this.gradeInd].kpis.push({
        name: null,
        type: null,
        fp: null,
        price: null,
      });
    }

    private cancelIt() {
      this.$router.push('/positions');
    }

    private submitIt() {
      this.loading = true;

      for (let g of this.position.grades) {
        g.salary = parseFloat(g.salary);
        g.overwork = parseFloat(g.overwork);
        for (let k of g.kpis) {
          k.price = parseFloat(k.price);
          if (k.type === 'percent') k.percentage = parseFloat(k.fp);
          else k.freq = parseFloat(k.fp);
          delete k.fp;
        }
      }

      firestore.collection('positions').add(this.position).then((ans) => {
        this.$router.push('/positions');
        this.loading = false;
      }).catch(() => {
        alert("Something went wrong...");
        this.loading = false;
      });
    }
  }
</script>
