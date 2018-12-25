<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Add Unit
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <div class="buttons">
                            <button class="button is-dark" @click="addRow">Add Row</button>
                            <button class="button is-dark" @click="removeRow">Remove Row</button>
                            <button class="button is-primary" @click="submit">Save</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div id="table-scroll">
        <table class="table is-bordered is-striped is-fullwidth">
            <thead>
            <tr>
                <th>Serial no.</th>
                <th>Unit Name</th>
                <th>UQC</th>
                <!-- <th>Conversion</th> -->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" placeholder="Unit Name" v-model="row.main">
                </td>
                <td>
                  <div class="select" >
                    <select  v-model="row.sub" >
                      <option selected disabled>{{row.sub}}</option>
                      <option  class="Option" v-for="unit in sublist">{{unit.uqc}}</option>
                    </select>
                  </div>
                </td>
                <!-- <td>
                    <input class="input" type="number" placeholder="Conversion" v-model="row.conversion">
                </td> -->
            </tr>
            </tbody>
        </table>
        </div>
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
      sublist:[],
    };
  },
  methods: {
    addRow() {
      this.rows.push({
        main: "",
        sub:"Select Sub Unit",
        conversion: 0,
      });
    },
    removeRow(){
        this.rows.pop();
    },
     submit() {
      // check for empty value
        let nullValues = false;
        this.rows.forEach(d => {
            if (d.main == "") {
                nullValues = true;
            }
        });
        
        if(!nullValues){
        
            this.rows.forEach(d => {
                this.db.units.findOne({main:d.main}, (err, docs) => {
                    if (docs !== null) {
                        // console.log("found");
                        alert("Error!! Data Already Present in Database")
                    } else {
                        // console.log('not found')
                        this.db.units.insert(this.rows,(err, docs) => {
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
            alert("Non of the Fields can be empty!!", "Stock Manager");
        }
        
    },
  },
  created() {
    this.addRow();
    this.db.units = new Datastore({ filename: "units", autoload: true });
    this.db.uqc = new Datastore({ filename: "UQC", autoload: true });
    this.db.uqc.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
           this.sublist.push(d);
        });
      }

    });
    // this.sublist = this.$store.getters.getSubUnits;
  },
};
</script>

<style scoped>
#table-scroll{
    overflow-y:auto;
    overflow-x: hidden;
    height:360px;
}
</style>
