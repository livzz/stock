<template>
  <div class="container">
    <div class="box">
      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-4">
              Add Stock
            </p>
          </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
          <div class="buttons">
            <button class="button is-info" @click="viewAddCategory = true">Add Category</button>
            <button class="button is-dark" @click="addRow">Add row</button>
            <button class="button is-dark" @click="removeRow">Remove Row</button>
            <button class="button is-primary" @click="submit">Save</button>
          </div>
        </div>
      </nav>
    </div>
    <div class="scrollable">
      <table class="table is-bordered is-striped">
        <thead>
        <tr>
          <th><abbr title="Serial No.">Sl. No.</abbr></th>
          <th>Stock Name</th>
          <th><abbr title="HSN Code">HSN</abbr></th>
          <th><abbr title="Unit Name">Unit Name</abbr></th>
          <th><abbr title="Groups">Stock Groups</abbr></th>
          <th>Tax Category</th>
          <th>Opening Stock</th>
          <th>Rate</th>
          <th><abbr title="Opening Stock x Rate">Amount</abbr></th>
          <!-- <th>Location</th> -->
          <th>Set Selling price</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row,i) in rows">
          <th>{{ i + 1 }}</th>
          <td>
            <input class="input " type="text" placeholder="Stock Name" v-model="row.stockName">
          </td>
          <td>
            <input class="input " type="number" placeholder="HSN" v-model="row.HSNCode">
          </td>
          <td>
            <div class="select">
              <select v-model="row.unitName">
                <option selected disabled>Select Unit Name</option>
                <option class="Option" v-for="unit in units">{{unit.main}}</option>
              </select>
            </div>
          </td>
          <td>
            <div class="select">
              <select v-model="row.stockGroup">
                <option disabled>Select Group</option>
                <option selected>default</option>
                <option class="Option" v-for="group in groups">{{group.group}}</option>
              </select>
            </div>
          </td>
          <td>
            <div class="select">
              <select v-model="row.taxCategory">
                <option disabled selected>Select Category</option>
                <option v-for="category in categories">{{ category | capitalize }}</option>
              </select>
            </div>
          </td>
          <td>
            <input class="input" type="text" placeholder="Opening Stock" v-model="row.openingStock">
          </td>
          <td>
            <input class="input" type="number" placeholder="Rate" v-model="row.rate">
          </td>
          <td>
            <input class="input" type="number" placeholder="Amount" :value="row.openingStock*row.rate">
          </td>
          <td>
            <div class="checkbox">
              <input type="checkbox" id="checkbox" @click="checkbox(i,$event)">
              <label for="checkbox"> Set Default</label>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="modal" :class="{'is-active': viewAddCategory}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Tax Category</p>
          <button class="delete" aria-label="close" @click="viewAddCategory = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Category Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g.: Phone, Oil" v-model="category">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="addCategory">Add</button>
          <button class="button" @click="viewAddCategory = false">Cancel</button>
        </footer>
      </div>
    </div>
    <div class="modal" :class="{'is-active': viewAddSellingPrice}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Default Selling Price</p>
          <button class="delete" aria-label="close" @click="viewAddSellingPrice = false"></button>
        </header>
        <section class="modal-card-body">
          <input class="input" type="text" placeholder="Default Selling Price" v-model="defaultSP">
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="addSellingPrice(defaultSP)">Add</button>
          <button class="button" @click="viewAddSellingPrice = false, defaultSP = 0">Cancel</button>
        </footer>
      </div>
    </div>
  </div>

</template>

<script>
  /* eslint-disable space-before-function-paren */


  export default {
    name: "add-stock",
    data() {
      return {
        sublist: [],
        rows: [],
        db: {},
        categories: [],
        units: [],
        locations: [],
        groups: [],
        category: '',
        viewAddCategory: false,
        viewAddSellingPrice: false,
        rowId: 0,
        defaultSP: 1,
        flags: {
          isNewTaxCategory: false
        }
      };
    },
    computed: {},
    methods: {
      checkbox(serialNo, event) {
        if (event.target.checked) {
          this.viewAddSellingPrice = true;
        } else if (!event.target.checked) {
          this.addSellingPrice(1);
        }
        this.rowId = serialNo;

      },
      addSellingPrice(price) {
        // console.log(price);
        this.viewAddSellingPrice = false;
        this.rows[this.rowId].defaultSP = price;
        this.defaultSP = 0;
      },
      addRow() {
        this.rows.push({
          stockName: "",
          HSNCode: 0,
          unitName: "Select Unit Name",
          stockGroup: "default",
          taxCategory: "Select Category",
          openingStock: 0,
          rate: 0,
          amount: 0,
          defaultSP: 0,
          location: "",
        });
      },
      removeRow() {
        this.rows.pop();
      },
      addCategory() {
        if (this.category !== "" && this.categories.indexOf(this.category.toLowerCase()) === -1) {
            this._insertToCategory();
        } else {
          alert("Category Name Already Exits or the field is empty!!", "Stock Manager");
        }
      },
      _insertToCategory(){
        let x = {
          category: this.category.toLowerCase(),
          rateList: []
        };
        this.db.categories.insert(x,(err, newDoc) => {
          if(!err) {
            this.categories.push(this.category.toLowerCase());
            this.category = "";
            alert("Done!!", "Stock Manager");
            this.viewAddCategory = false;
          } else {
            alert("Error Please Try Again!!", "Stock Manager");
          }
        });
      },
      submit() {
        // check for empty value
        let nullValues = false;
        this.rows.forEach(d => {
          if (d.stockName === "") {
            nullValues = true;
          }
        });
        if (!nullValues) {
          this.rows.forEach(row => {
            row.amount = row.openingStock * row.rate;
          });
          this.rows.forEach(d => {
            this.db.stocks.findOne({stockName: d.stockName}, (err, docs) => {
              if (docs !== null) {
                // console.log("found");
                alert("Error!! Data Already Present in Database")
              } else {
                // console.log('not found')
                this.db.stocks.insert(this.rows, (err, docs) => {
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
        } else {
          alert("Non of the Fields can be empty!!", "Stock Manager");
        }
      },
    },

    created() {
      // get the gst codes
      [...Array(1).keys()].map(() => this.addRow());
      this.sublist = this.$store.getters.getSubUnits;
      this.db.stocks = new this.$db({filename: "stocks", autoload: true});
      this.db.units = new this.$db({filename: "units", autoload: true});
      this.db.groups = new this.$db({filename: "groups", autoload: true});
      this.db.categories = new this.$db({filename: "categories", autoload: true});

      this.db.units.find({}, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          docs.forEach(d => {
            this.units.push(d);
          });
          // console.log(docs);
        }
      });
      this.db.categories.find({}, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          docs.forEach(d => {
            this.categories.push(d.category);
          });
          // console.log(docs);
        }
      });
      // this.db.location = new Datastore({ filename: "location", autoload: true });
      // this.db.location.find({}, (err, docs) => {
      //   if (err !== null) {
      //     alert("Error");
      //     console.log(err);
      //   } else {
      //     docs.forEach(d => {
      //       this.locations.push(d);
      //     });
      //     // console.log(docs);
      //   }
      // });

      // Get Group data from database
      this.db.groups.find({}, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          docs.forEach(d => {
            this.groups.push(d);
          });
        }

      });
    },
  };
</script>

<style>

</style>
