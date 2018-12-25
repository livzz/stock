<template>
    <div class="modal " :class="{'is-active': showModidyModelView }">
        <div class="modal-background"></div>
        <div class="modal-card modalSize">
            <header class="modal-card-head">
                <p class="modal-card-title">Add Party</p>
                <button class="delete" aria-label="close" @click="$emit('toggleModityEntryView',!showModidyModelView)"></button>
            </header>
            <section>
                <div class="box">
                    <nav class="level">
                        <div class="level-left">
                            <div class="level-item">
                                <div>
                                      <div class="subtitle">Invoice date:</div>
                                       <input class="input" v-model="party.date" type="date">
                                </div>
                            </div>
                            <div class="level-item">
                                <div>
                                      <div class="subtitle">Party A/C Name:</div>
                                      <div class="select">
                                        <select v-model="party.partyName">
                                            <option  value="cash" selected>cash</option>
                                            <option>asd</option>
                                            <option>asasd</option>
                                        </select>
                                      </div>
                                </div>
                            </div>
                            <div class="level-item">
                                <div>
                                    <div class="subtitle">Invoice No:</div>
                                    <input class="input" v-model="party.invoice" placeholder="Invoice no">
                                </div>
                            </div>
                            
                            <!--  -->
                        </div>
                        <div class="level-right">
                                <div class="level-item">
                                    <button class="button is-info" >Add Row</button>
                                </div>
                                <div class="level-item">
                                    <button class="button is-dark" >Remove Row</button> 
                                </div>
                                <div class="level-item">
                                    <button class="button is-success" >Save</button>
                                </div>
                        </div>
                    </nav>
                
                <div id="table-scroll">
                    <table class="table is-bordered is-striped">
                        <thead>
                        <tr>
                            <th><abbr title="Serial No.">Sl.</abbr></th>
                            <th>Items</th>
                            <th>HSN Code</th>
                            <th><abbr title="Quantity">Qty</abbr></th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Discount</th>
                            <th>Taxable Value</th>
                            <th>Tax %</th>
                            <th>GST</th>
                            <th>Total Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(row,i) in items">
                            <th>{{ i + 1 }}</th>
                            <td>
                                <select v-model="row.stockName" v-on:change="selected($event,i)">
                                    <option selected>{{row.stockName}}</option>
                                    <option v-for="name in stockName">{{name}}</option>
                                </select>
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="HSN Code" v-model="row.HSNCode">
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Qty" v-model="row.quantity" @input="quantityOrRateChanged(i)">
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Rate" v-model="row.rate" @input="quantityOrRateChanged(i)">
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Qty x Rate" v-model="row.amount"  >
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Discount" v-model="row.discount" @input="discountChanged(row.flag,i)">
                                <br>
                                <input class="checkbox" name="percentage" type="checkbox" @change="percentageChanged($event,i)" > 
                                <label for="percentage">Percentage</label>
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Taxable Value" @change="taxableValueChanged()" v-model="row.taxableValue">
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Tax Rate" v-model="row.taxPer" @input="taxChanged(i)">
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="GST" v-model="row.gst">
                            </td>
                            <td>
                                <input class="input" type="number" placeholder="Total Amount" v-model="row.totalAmount">
                    
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    
                    <div class="sumary">
                    </div>
                    
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="add">Add</button>
                <button class="button" @click="$emit('toggleModityEntryView',!showModidyModelView)">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>

import autoComplete from "./autoComplete";
import Datastore from "nedb";

export default {
  name: "add-party",
  components:{
    autoComplete,
  },
  props: {
    showModidyModelView: Boolean,
    updateParty: Function,
    row: Object,
    type:String,
  },
  data() {
    return {
      party: {
          partyName:"",
          date:"",
          invoice:"",
          totalAmount:"",
          items:[],
      },
      db: {},
      stocks: [],
      stockName:[],
    };
  },
  methods: {
    add() {
    },
    selected(event,i){
      
      let stock = this.findStock(event)[0];
      let row = this.items[i];
      row.stockName = stock.stockName;
      row.HSNCode =  stock.HSNCode;
      row.rate = stock.defaultSP;
      row.taxPer = stock.taxCategory;
      console.log(stock)
      
    },
    findStock:function(name){
      let patt = new RegExp('\\b'+name+'\\b');
      // console.log(patt)
      return this.stocks.filter((data)=>{
        return data.stockName.match(patt);
      })
    }
  },
  created() {
      this.db.stocks = new Datastore({ filename: "stocks", autoload: true });
    this.db.stocks.find({}, (err, docs) => {
      if (err) {
        alert("Database Error", "Stock Manager");
      } else {
        docs.forEach(d => {
          this.stocks.push(d);
          this.stockName.push(d.stockName);
        });
      }
    });
      
  },
  watch:{
      showModidyModelView: function(){
        this.party.partyName = this.row.detail.party;
        this.party.date = this.row.detail.date;
        this.party.invoice = this.row.detail.invoice;

        this.items = this.row.items;
      }
  }
};
</script>

<style scoped>
.modalSize{
    width: 90%;
}
</style>
