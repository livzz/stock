<template>
    <div>
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
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    <auto-complete  ref="complete" v-if="reload"  :items="stocks" v-model="row.stockName" v-on:Selected="selected($event,i)"></auto-complete>
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
                    <input class="input" type="number" placeholder="Taxable Value" v-model="row.taxableValue">
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
          <table class="table is-bordered is-striped">
            <thead>
              <tr>
                <th><abbr title="Points">CGST/SGST</abbr></th>
                <th><abbr title="Points">IGST</abbr></th>
              </tr>
            </thead>
            <tbody>
              <td>{{summary_CGST}}</td>
              <td>{{summary_IGST}}</td>
            </tbody>
          </table>
        </div>
    </div>
</template>

<script>
import Datastore from "nedb";

import autoComplete from "../../widgets/autoComplete";

export default {
  name: "addPurchaseList",
  components: {
    autoComplete,
  },
  props: ["data","new"],
  data() {
    return {
      rows: [],
      db: {},
      reload: true,
      stocks: [],
      stockName:[],
      item: [],
      viewDiscount:false,
      selectedParty: "cash",
     // localParty:true,
      new:true,
      gstinNumber: "",
      gstSummaryRows: [],
      summary_taxableAmount: 0,
      summary_CGST: 0,
      summary_SGST: 0,
      summary_IGST: 0,
      summary_totalAmount: 0,
      localParty: true,
      summary_partyGstNo: "",
    };
  },
  methods: {
    refresh(data){
      this.stocks.push(data);
    },
    quantityOrRateChanged(i){
      this.rows[i].amount = this.rows[i].quantity * this.rows[i].rate
      this.discountChanged(this.rows[i].flag,i);
    },
    percentageChanged(event,i){
        this.rows[i].flag = event.target.checked;
        this.discountChanged(event.target.checked,i);
    },
    discountChanged(flag,i){
      if(flag){
        this.rows[i].taxableValue = this.rows[i].amount * (1 - this.rows[i].discount/100) ;
      }else{
        this.rows[i].taxableValue = this.rows[i].amount - this.rows[i].discount;
      }

      this.gstChnaged(i);
      this. calculateGstSummary(i);
    },
    taxChanged(i){
      this.gstChnaged(i);
    },

    gstChnaged(i){
      this.rows[i].gst = this.rows[i].taxableValue * this.rows[i].taxPer/100;
      this.getTotalAmount(i);
    },
    getTotalAmount(i){
      this.rows[i].totalAmount = this.rows[i].taxableValue + this.rows[i].gst;
    },
    calculateGstSummary(i) {
        this.gstSummaryRows = [];
        this.rows.forEach(d => {
          let r = parseFloat(d.taxPer);
          let t = parseFloat(d.taxableValue);
          let g = parseFloat(d.gst);
          if (!isNaN(r) && !isNaN(t) && !isNaN(g)) {
            this.addToSummary(r, t, g);
          }
        });
        // console.log(totalSumTemp);
      },
      addToSummary(r, t, g) {
        let i = 0;
        let found = false;
        for (; i < this.gstSummaryRows.length; i++) {
          if (this.gstSummaryRows[i].rate == r) {
            found = true;
            break;
          }
        }
        if (this.gstSummaryRows.length <= 0 && !found) {
          this.gstSummaryRows.push({
            rate: r,
            taxRate: r,
            taxableAmount: parseFloat(t.toFixed(2)),
            cgst: parseFloat((g / 2).toFixed(2)),
            sgst: parseFloat((g / 2).toFixed(2)),
            igst: parseFloat(g.toFixed(2)),
            totalAmount: parseFloat(t.toFixed(2)) + (parseFloat(g.toFixed(2))),
          });
        } else if (found) {
          this.gstSummaryRows[i].taxRate += r;
          this.gstSummaryRows[i].taxableAmount = parseFloat(
            (
              parseFloat(this.gstSummaryRows[i].taxableAmount) + parseFloat(t)
            ).toFixed(2)
          );
          this.gstSummaryRows[i].cgst += parseFloat((g / 2.0).toFixed(2));
          this.gstSummaryRows[i].sgst += parseFloat((g / 2.0).toFixed(2));
          this.gstSummaryRows[i].igst += parseFloat(g.toFixed(2));
          this.gstSummaryRows[i].totalAmount = this.gstSummaryRows[i].taxableAmount + this.gstSummaryRows[i].igst;
        } else if (!found) {
          this.gstSummaryRows.push({
            rate: r,
            taxRate: r,
            taxableAmount: parseFloat(t.toFixed(2)),
            cgst: parseFloat((g / 2).toFixed(2)),
            sgst: parseFloat((g / 2).toFixed(2)),
            igst: parseFloat(g.toFixed(2)),
            totalAmount: parseFloat(t.toFixed(2)) + (parseFloat(g.toFixed(2))),
          });
        }
        // console.log(i);
        let amountSum = 0;
        let cgstSum = 0;
        let sgstSum = 0;
        let igstSum = 0;
        this.gstSummaryRows.forEach(d => {
          // console.log(d.taxableAmount, d.cgst);
          amountSum = amountSum + d.taxableAmount;
          cgstSum = cgstSum + d.cgst;
          sgstSum = sgstSum + d.sgst;
          igstSum = igstSum + d.igst;
        });
        // console.log(amountSum);
        this.summary_taxableAmount = parseFloat(amountSum).toFixed(2);
        this.summary_CGST = parseFloat(cgstSum).toFixed(2);
        this.summary_SGST = parseFloat(sgstSum).toFixed(2);
        this.summary_IGST = parseFloat(igstSum).toFixed(2);
        this.summary_totalAmount = parseFloat(this.getTotalSalesAmount()).toFixed(2);
      },
      getTotalSalesAmount() {
        let sum = 0;
        this.rows.forEach(d => {
          sum += parseFloat(d.totalAmount);
        });
        return parseFloat(sum.toFixed(2));
      },
      getTotalGst() {
        if (this.localParty) {
          return parseFloat(this.summary_CGST) + parseFloat(this.summary_SGST);
        } else {
          return parseFloat(this.summary_IGST);
        }
      },
      getTotalTaxableAmount() {
        return this.summary_taxableAmount;
      },
      getPartyGstNo() {
        if(this.data.selectedParty!="cash"){
          return this.data.selectedParty.gstin;
        }else{
          return "1818";
        }
      },
      getPartyName() {
        if (this.data.selectedParty != "cash") {
          console.log('partyname',this.data.selectedParty.name);
          return this.data.selectedParty.name;
        }
        return this.data.selectedParty;
      },
    submit() {
      // console.log("a")
      if (this.checkFields()) {
        const x = {
          items: this.rows,
          detail: {
            date:this.data.date,
            invoiceno:this.data.originalInvoiceNumber, 
            credit_number: this.data.creditNumber,
            originalDate:this.data.originalDate,
            party: this. getPartyName(),
            gstNo: this.getPartyGstNo(),
            totalGst: this.getTotalGst(),
            getTotalTaxableAmount: this.getTotalTaxableAmount(),
            totalAmount: this.getTotalSalesAmount(),
          },
        };
         let child = this.$refs.complete;
        this.db.creditNote.insert(x, err => {
          if (err) {
            alert("Error Try Again!!", "Stock Manager");
          } else {
            this.rows = [];
            this.addRow();
            alert("Done!!", "Stock Manager");
            child[0].refresh()
            this.$store.dispatch("incrementInvoice")

          }
        });
      } else {
        alert("None of the Fields can be empty", "Stock Manager");
      }
      
    },
    selected(event,i){

      let stock = this.findStock(event)[0];
      let row = this.rows[i];
      row.stockName = stock.stockName;
      row.HSNCode =  stock.HSNCode;
      row.rate = stock.defaultSP;
      row.taxPer = this.getTaxRate(stock.taxCategory,this.data.date,this.getToday());
      // this.newparty=this.localParty;
     // console.log('nwparty',this.newparty);

    },
    addRow() {
      const x = {
        stockName: "",
        HSNCode:"",
        quantity: "",
        rate:"",
        amount: "",
        discount: "",
        taxableValue:"",
        taxPer:"",
        gst:"",
        totalAmount: "",
        flag:false,
      };
      this.rows.push(x);
    },
    getTotal() {
      let total = 0;
      for (const row of this.rows) {
        total += Number.parseInt(row.totalAmount, 10);
      }
      return total;
    },
    checkFields() {
      let nullValues = true;

      this.rows.forEach(data => {
        if(data.stockName==""){
          nullValues = false;
        }
      });

     return nullValues;
    },
     findStock: function (name) {
        return this.stocks.filter(data => {
          return data.stockName === name;
        });
      },
     getTaxRate(categoryName, entryDate ,endDate) {
        let startDateRange = this._getTaxRateList(categoryName);
        let dates = startDateRange.filter((data) => this.inRange(entryDate,data.date, endDate));
        console.log("At getTaxRate", dates);
        return dates[dates.length-1].value;
      },
      _getTaxRateList(categoryName){
        let list = this.category.filter((data) => data.category === categoryName.toLowerCase());
        console.log("At _getTaxRateList ",categoryName," ",list);
        return list[0].rateList;
      }

  },
  created() {
    this.db.stocks = new Datastore({ filename: "stocks", autoload: true });
    this.db.category = new this.$db({filename: "categories", autoload: true});
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
     this.db.category.find({}, (err, docs) => {
        if (err) {
          alert("Database Error", "Stock Manager");
          console.log(err);
        } else {
          this.category = docs;
        }
      });


    [...Array(1).keys()].map(() => this.addRow());
    this.$parent.$on("addRowEvent", this.addRow);
    this.$parent.$on("submitEventExempt", this.submit);
    this.db.creditNote = new Datastore({ filename: "credit_note", autoload: true });
  },
 computed:{
    filterList:function(){
      return this.stocks.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        return data.stockName.match(patt);
      })
    }
    // end of computes
  },
 

};
</script>

<style scoped>
#table-scroll{
    overflow-y:auto;
    overflow-x: hidden;
    height:330px;
}
.sumary{
  position: absolute;
  bottom: 10px;
}
</style>
