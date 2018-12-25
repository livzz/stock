<template>
    <div class="modal" :class="{'is-active': showItem }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Add Item</p>
                <button class="delete" aria-label="close" @click="$emit('toggleItem',!showItem)"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Stock Name</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Stock Name" v-model="item.stockName">
                    </div>
                </div>
                
                <div  class="field">
                    <label class="label">HSN</label>
                    <div class="control">
                        <input class="input" maxlength="15" placeholder="HSN Code"  v-model="item.HSNCode">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Unit Name</label>
                    <div class="select">
                        <select v-model="item.unitName">
                        <option selected disabled >Select Unit Name</option>
                        <option class="Option" v-for="unit in units">{{unit.main}}</option>
                        </select>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Stock Group</label>
                     <div class="select">
                    <select v-model="item.stockGroup" >
                      <option disabled >Select Group</option>
                      <option selected >default</option>
                      <option class="Option" v-for="group in groups">{{group.group}}</option>
                    </select>
                  </div>
                </div>
                <div class="field">
                    <label class="label">Tax Category</label>
                    <div class="select">
                        <select v-model="item.taxCategory" >
                            <option disabled selected>Select Category</option>
                            <option v-for="category in categories">{{ category.category }}</option>
                        </select>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Opening Stock</label>
                    <div class="control">
                        <input class="input" placeholder="Opening Stock" @input="openingStockChanged" v-model="item.openingStock">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Rate</label>
                    <div class="control">
                        <input class="input" placeholder="Rate" @input="rateChanged" v-model="item.rate">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Amount</label>
                    <div class="control">
                        <input class="input" placeholder="eg India" v-model="item.amount">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Set Selling Price</label>
                    <div class="checkbox">
                        <input type="checkbox" id="checkbox" @click="checkbox($event)">
                        <label for="checkbox"> Set Default</label>
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
            </section>

            <footer class="modal-card-foot">
                <button class="button is-success" @click="add">Add</button>
                <button class="button" @click="$emit('toggleItem',!showItem)">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
import Datastore from "nedb";
// import { eventBus } from "../../main";

export default {
  name: "add-party",
  props: {
    showItem: Boolean,
    updateItem: Function,
  },
  data() {
    return {
        groups:[],
        categories: [],
        units:[],
        viewAddSellingPrice:false,
        defaultSP:"",
      item: {
        stockName: "",
        HSNCode: 0,
        unitName: "Select Unit Name",
        stockGroup: "default",
        taxCategory: "Select Category",
        openingStock: 0,
        rate: 0,
        amount: 0,
        defaultSP:0,
        location: "",
      },
      db: {},
    };
  },
  methods: {
      checkbox(event){
      if(event.target.checked){
        this.viewAddSellingPrice = true;
      }else if(!event.target.checked){
        this.addSellingPrice(1);
      }
    },
    rateChanged(event){
        this.item.amount = event.target.value * this.item.openingStock;
    },
    openingStockChanged(event){
        this.item.amount = this.item.rate * event.target.value;
    },
     addSellingPrice(price){
      // console.log(price);
      this.viewAddSellingPrice = false;
      this.item.defaultSP = price;
      this.defaultSP = 0;
    },
    add() {
      // check for empty value
        this.db.stocks = new Datastore({ filename: "stocks", autoload: true });
        let nullValues = false;
        if (this.item.stockName == "") {
                nullValues = true;
        }
        
        if(!nullValues){
                
                this.db.stocks.findOne({stockName:this.item.stockName}, (err, docs) => {
                    if (docs !== null) {
                        // console.log("found");
                        alert("Error!! Data Already Present in Database")
                    } else {
                        // console.log('not found')
                        this.db.stocks.insert(this.item,(err, docs) => {
                            if (err !== null) {
                                alert("Error While Adding to Database");
                                console.log(err);
                            } else {
                                alert("SuccessFully Added to Database");
                    
                                this.$emit("toggleItem", !this.showItem);
                                this.updateItem(this.item);
                            }
                        });
                    }

                }); 
        }else{
            alert("Non of the Fields can be empty!!", "Stock Manager");
        }
    },
  },
  created() {
    this.db.units = new Datastore({ filename: "units", autoload: true });
    this.db.groups = new Datastore({ filename: "groups", autoload: true });
    this.db.categories = new Datastore({
      filename: "categories",
      autoload: true,
    });

    this.db.units.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
          this.units.push(d);
        });
        
      }
    });

    
    this.db.categories.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
          this.categories.push(d);
        });
        
      }
    });

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

<style scoped>

</style>
