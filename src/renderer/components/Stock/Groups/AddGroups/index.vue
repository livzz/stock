<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Add Groups
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
                <th>Group</th>
            </tr>
            </thead>
            <tbody>
              <!-- Print all the rows when adding -->
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" placeholder="Main" v-model="row.group">
                </td>

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
    };
    // end of data
  },
  methods: {
    // Add a new row
    addRow() {
      this.rows.push({
          group:"",
      });
    },
    removeRow(){
        this.rows.pop();
    },
     submit() {
      // check for empty value
        let nullValues = false;
        this.rows.forEach(d => {
            if (d.group == "") {
                nullValues = true;
            }
        });
        
        if(!nullValues){
            this.rows.forEach(d => {
                this.db.groups.findOne({group:d.group}, (err, docs) => {
                    if (docs !== null) {
                        // console.log("found");
                        alert("Error!! Data Already Present in Database")
                    } else {
                        // console.log('not found')
                        this.db.groups.insert(this.rows,(err, docs) => {
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
    // end of methods
  },
  created() {
    // add a new empty row, and connect to database
    this.addRow();
    this.db.groups = new Datastore({ filename: "groups", autoload: true });
    // end of created
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
