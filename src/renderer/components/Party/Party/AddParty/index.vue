<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Add Party
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <div class="buttons">
                            <button class="button is-dark" @click="addRow">Add More Party</button>
                            <button class="button is-dark" @click="removeRow">Remove Row</button>
                            <button class="button is-primary" @click="submit">Save</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <table class="table is-bordered is-striped is-fullwidth">
            <thead>
            <tr>
                <th>Serial no.</th>
                <th>Name</th>
                <th>Type</th>
                <th>GSTIN</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Pin</th>
                <th>District</th>
                <th>State</th>
                <th>Country</th>
            </tr>
            </thead>
            <tbody>
              <!-- Print all the rows when adding -->
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" placeholder="Name" required v-model="row.name">
                </td>
                <td>
                    
                    <div class=" select selectContainer" >
                        <select v-model="row.type" required>
                            <option selected disabled>Select Type</option>
                            <option >Registered</option>
                            <option >Unregistered</option>
                            <option >Customer</option>
                        </select>
                    </div>
                    <div v-if="row.type=='Registered'" class="checkbox checkboxContainer">

                        <input type="radio" id="one" value="regular" v-model="row.registerType">
                        <label for="one">Regular</label>
                        <br>
                        <input type="radio" id="two" value="composite" v-model="row.registerType">
                        <label for="two">Composite</label>

                    </div>
                </td>
                <td>
                    <input class="input" type="text" placeholder="gstin" :disabled="row.type!='Registered'"  v-model="row.gstin">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Phone" v-model="row.phone">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Address" requiredv-model="row.address">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Pin" required v-model="row.pin">
                </td>
                <td>
                    <input class="input" type="text" placeholder="District" required v-model="row.district">
                </td>
                <td>
                    <input class="input" type="text" placeholder="State" required v-model="row.state">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Country" required v-model="row.country">
                </td>

            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
/* eslint-disable space-before-function-paren */

import Datastore from "nedb";

export default {
  name: "index",
  data() {
    return {
      rows: [],
      db: {},
      type:"unregistered",
      registerType:[],
      picked:"",
    };
    // end of data
  },
  methods: {
    // Add a new row
    addRow() {
      this.rows.push({
          name:"",
          type:"Select Type",
          registerType:"",
          gstin:"",
          phone:"",
          address:"",
          pin:"",
          district:"",
          state:"",
          country:""

      });
    },
    removeRow(){
        this.rows.pop();
    },
    removeAllRows(){
        this.rows =[];
    },
    // submit to database
    submit() {
      // check for empty value
        let nullValues = false;
        this.rows.forEach(d => {
            if (d.name == "") {
                nullValues = true;
            }
        });
        
        if(!nullValues){
            this.rows.forEach(d => {
                this.db.party.findOne({name:d.name}, (err, docs) => {
                    if (docs !== null) {
                        // console.log("found");
                        alert("Error!! Data Already Present in Database")
                    } else {
                        // console.log('not found')
                        this.db.party.insert(this.rows,(err, docs) => {
                            if (err !== null) {
                                alert("Error While Adding to Database");
                                console.log(err);
                            } else {
                                alert("SuccessFully Added to Database");
                                this.rows = [];
                                this.addRow();
                            }
                        });
                    }

                });
            });   
        }else{
            alert("Non of the Fields can be empty!!", "Party Manager");
        }
        
    },
    // end of methods
  },
  created() {
    // add a new empty row, and connect to database
    this.addRow();
    this.db.party = new Datastore({ filename: "party", autoload: true });
    // end of created
  },
};
</script>

<style scoped>
.checkboxContainer{
    margin-top: 10px;
}

</style>
