<template>
  <div>
    <b-row class="justify-content-center">
      <b-col md="10">
        <b-card-group>
          <b-card no-body class="p-4">
            <b-card-body>
              <b-form>
                <b-form-group
                    label="First Name"
                    label-cols="4">
                  {{user.firstName}}
                </b-form-group>
                <b-form-group
                    label="Last Name"
                    label-cols="4">
                  {{user.lastName}}
                </b-form-group>
                <b-form-group
                    label="Position"
                    label-cols="4">
                  {{user.salary}}
                </b-form-group>
                <b-form-group
                    label="Grade"
                    label-cols="4">
                  {{user.salary}}
                </b-form-group>
                <b-form-group
                    label="Salry"
                    label-cols="4">
                  {{user.salary}}
                </b-form-group>
                <b-form-group
                    label="Overwork"
                    label-cols="4">
                  {{user.overwork}}
                </b-form-group>
              </b-form>
            </b-card-body>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';
  import firebase from 'firebase';
  @Component
  export default class Profile extends Vue {
    private get user() {
      console.log("====> ", this.$store.state.user);
      return this.$store.state.user;
    }
  }
</script>