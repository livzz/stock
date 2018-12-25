<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Add Category
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
        <div class="scrollable">
        <table class="table is-bordered is-striped is-fullwidth">
            <thead>
            <tr>
                <th>Serial no.</th>
                <th>Category</th>
            </tr>
            </thead>
            <tbody>
              <!-- Print all the rows when adding -->
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" placeholder="Category" v-model="row.category">
                </td>

            </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
/* eslint-disable space-before-function-paren */

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
          category:"",
      });
    },
    removeRow(){
        this.rows.pop();
    },
     submit() {
      // check for empty value
        this.rows.forEach(d => {
            if (d.category === "") {
              alert("Non of the Fields can be empty!!", "Stock Manager");
            } else {
              this._insertToCategories();_
            }
        });
    },
    _insertToCategories() {
        this.rows.forEach(d => {
          this.db.category.findOne({category:d.category.toLowerCase()}, (err, docs) => {
            if (docs !== null) {
              // console.log("found");
              alert("Error!! Data Already Present in Database");
            } else {
              // console.log('not found')
              let x = this.rows.map((value) => {
                return {
                  category: value.category.toLowerCase(),
                  rateList: []
                };
              });
              this.db.category.insert(x,(err, docs) => {
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
    }
    // end of methods
  },
  created() {
    // add a new empty row, and connect to database
    this.addRow();
    this.db.category = new this.$db({ filename: "categories", autoload: true });
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
