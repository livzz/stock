<template>
  <div id="app">
    <div class="container-fluid partyDetailDiv">
      <div class="box">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <div class="subtitle">Invoice date:</div>
                <input class="input" type="date" v-model="date">
              </div>
            </div>
            <div class="level-item">
              <div>
                <div>
                  <div class="subtitle">Party A/C Name:</div>
                  <div class="select">
                    <select v-model="selectedParty">
                      <option value="cash" selected>cash</option>
                      <option
                      v-for="(account,i) in party"
                      :key="i"
                      :value="account"
                      >{{account.name}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="level-item">
              <div>
                <div>
                  <div class="subtitle">Invoice No:</div>
                  <input class="input" placeholder="Invoice no" v-model="invoiceNumber">
                </div>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-info" @click="$emit('addRowEvent')">Add Row</button>
            </div>
            <div class="level-item">
              <button class="button is-dark" @click="removeRow">Remove Row</button>
            </div>
            <div class="level-item">
              <button class="button is-dark" @click="addParty = true">Add Party</button>
            </div>
            <div class="level-item">
              <button class="button is-dark" @click="addItem = true">Add Item</button>
            </div>
            <div class="level-item">
              <button class="button is-success" @click="submitEvent" :disabled="Check==false">Save</button>
            </div>
            <div class="level-item">
              <button class="button is-info" @click="pdf">Export</button>
            </div>
          </div>
        </nav>
      </div>

      <app-add-party
      :updateParty="updateParty"
      :showParty="addParty"
      @toggleParty="addParty = $event"
      ></app-add-party>
      <app-add-item :updateItem="updateItem" :showItem="addItem" @toggleItem="addItem = $event"></app-add-item>
    </div>

    <!-- table of list -->
    <div id="table-scroll">
      <table class="table is-bordered is-striped">
        <thead>
          <tr>
            <th>
              <abbr title="Serial No.">Sl.</abbr>
            </th>
            <th>Items</th>
            <th>HSN Code</th>
            <th>
              <abbr title="Quantity">Qty</abbr>
            </th>
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
          <tr v-for="(row,i) in rows" :key="i">
            <th>{{ i + 1 }}</th>
            <td>
              <auto-complete
              ref="complete"
              v-if="reload"
              :items="stocks"
              v-model="row.stockName"
              v-on:Selected="selected($event,i)"
              ></auto-complete>
            </td>
            <td>
              <input class="input" type="number" placeholder="HSN Code" v-model="row.HSNCode">
            </td>
            <td>
              <input
              class="input"
              type="number"
              placeholder="Qty"
              v-model="row.quantity"
              @input="quantityOrRateChanged(i)"
              >
            </td>
            <td>
              <input
              class="input"
              type="number"
              placeholder="Rate"
              v-model="row.rate"
              @input="quantityOrRateChanged(i)"
              >
            </td>
            <td>
              <input class="input" type="number" placeholder="Qty x Rate" v-model="row.amount">
            </td>
            <td>
              <input
              class="input"
              type="number"
              placeholder="Discount"
              v-model="row.discount"
              @input="discountChanged(row.flag,i)"
              >
              <br>
              <input
              id="percentage"
              class="checkbox"
              name="percentage"
              type="checkbox"
              @change="percentageChanged($event,i)"
              >
              <label for="percentage">Percentage</label>
            </td>
            <td>
              <input
              class="input"
              type="number"
              placeholder="Taxable Value"
              @change="taxableValueChanged()"
              v-model="row.taxableValue"
              >
            </td>
            <td>
              <input
              class="input"
              type="number"
              placeholder="Tax Rate"
              v-model="row.taxPer"
              @input="taxChanged(i)"
              >
            </td>
            <td>
              <input class="input" type="number" placeholder="GST" v-model="row.gst">
            </td>
            <td>
              <input
              class="input"
              type="number"
              placeholder="Total Amount"
              v-model="row.totalAmount"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sumary">
      <table class="table is-bordered is-striped">
        <thead>
          <tr>
            <th>Tax Rate</th>
            <th>Taxable Amount</th>
            <template v-if="localParty">
              <th>CGST</th>
              <th>SGST</th>
            </template>
            <th v-else>IGST</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in gstSummaryRows">
            <td>{{row.rate}}</td>
            <td>{{row.taxableAmount}}</td>
            <template v-if="localParty">
              <td>{{row.cgst}}</td>
              <td>{{row.sgst}}</td>
            </template>
            <td v-else></td>
            <td>{{row.totalAmount}}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <td>Totals</td>
            <td>{{summary_taxableAmount}}</td>
            <template v-if="localParty">
              <td>{{summary_CGST}}</td>
              <td>{{summary_SGST}}</td>
            </template>
            <td v-else>{{summary_IGST}}</td>
            <td>{{summary_totalAmount}}</td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
  import html2canvas from "html2canvas";
  import JSPDF from "jspdf";
  import autoComplete from "../../../widgets/autoComplete";
  import appAddParty from "../../../widgets/addParty";
  import appAddItem from "../../../widgets/addItem";
  import { mapGetters } from "vuex";

  export default {
    name: "addSalesList",
    components: {
      autoComplete,
      appAddParty,
      appAddItem
    },
    data() {
      return {
        date: "",
        viewToken: 0,
        addParty: false,
        addItem: false,
        party: [],
        db: {},
        selectedParty: "cash",
        invoiceNumber: 0,
        gstinNumber: "",
        invoice: {
          number: 0,
          prefix: "",
          suffix: 0,
          enable: false
        },
        rows: [],
        gstSummaryRows: [],
        db: {},
        reload: true,
        stocks: [],
        stockName: [],
        item: [],
        viewDiscount: false,
        summary_taxableAmount: 0,
        summary_CGST: 0,
        summary_SGST: 0,
        summary_IGST: 0,
        summary_totalAmount: 0,
        localParty: true,
        summary_partyGstNo: "",
        category: [],
        limit: "",
        IsPeriod: true,
        Check: true,
        opening: ""
      };
    },
    methods: {
    // reset summary record after upload
    resetSummary() {
      (this.summary_taxableAmount = 0),
      (this.summary_CGST = 0),
      (this.summary_SGST = 0),
      (this.summary_IGST = 0),
      (this.summary_totalAmount = 0);
    },
    // reset rows after upload
    resetRows() {
      this.rows = [];
      this.addRow();
    },
    // refresh sumary and rows after upload sucess
    refresh() {
      this.resetSummary();
      this.resetRows();
    },

    updateParty(data) {
      this.party.push(data);
    },
    updateItem(data) {
      this.refresh(data);
    },
    formatInvoiceNumber(setting) {
      if (setting.enable) {
        this.invoiceNumber = setting.prefix + setting.number + setting.suffix;
      } else {
        this.invoiceNumber = 0;
      }
    },
    submitEvent() {
      this.submit();
    },
    checkFields() {
      return true;
    },
    removeRow() {
      if (this.rows.length > 1) {
        this.rows.pop();
      }
    },

    quantityOrRateChanged(i) {
      console.log(this.rows[i].quantity);
      this.rows[i].amount = this.rows[i].quantity * this.rows[i].rate;

      this.discountChanged(this.rows[i].flag, i);
    },
    percentageChanged(event, i) {
      this.rows[i].flag = event.target.checked;
      this.discountChanged(event.target.checked, i);
    },
    discountChanged(flag, i) {
      if (flag) {
        this.rows[i].taxableValue =
        this.rows[i].amount * (1 - this.rows[i].discount / 100.0);
      } else {
        this.rows[i].taxableValue = this.rows[i].amount - this.rows[i].discount;
      }
      this.gstChnaged(i);
      this.calculateGstSummary(i);
    },
    taxChanged(i) {
      this.gstChnaged(i);
    },
    gstChnaged(i) {
      this.rows[i].gst =
      this.rows[i].taxableValue * (this.rows[i].taxPer / 100.0);
      this.getTotalAmount(i);
    },
    getTotalAmount(i) {
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
          totalAmount: parseFloat(t.toFixed(2)) + parseFloat(g.toFixed(2))
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
        this.gstSummaryRows[i].totalAmount =
        this.gstSummaryRows[i].taxableAmount + this.gstSummaryRows[i].igst;
      } else if (!found) {
        this.gstSummaryRows.push({
          rate: r,
          taxRate: r,
          taxableAmount: parseFloat(t.toFixed(2)),
          cgst: parseFloat((g / 2).toFixed(2)),
          sgst: parseFloat((g / 2).toFixed(2)),
          igst: parseFloat(g.toFixed(2)),
          totalAmount: parseFloat(t.toFixed(2)) + parseFloat(g.toFixed(2))
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
      this.summary_totalAmount = parseFloat(this.getTotalSalesAmount()).toFixed(
        2
        );
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
      return this.selectedParty.gstin;
    },
    getPartyName() {
      if (this.selectedParty != "cash") {
        return this.selectedParty.name;
      }
      return this.selectedParty;
    },
    stock(item) {
      // console.log(item);
      this.db.stocks.find({ stockName: item }, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          docs.forEach(d => {
            this.limit = d.openingStock;
            console.log(this.limit);
            if (d.openingStock != 0) {
              this.Check = true;
            } else {
              this.Check = false;
              alert("Item is Out Of Stock");
            }
          });
        }
      });
    },
    checkTrue() {
      console.log("true");
      return true;
    },
    checkFalse() {
      console.log("false");
      return false;
    },
    submit() {
      if (this.checkFields() && this.limit != 0) {
        const x = {
          items: this.rows,
          detail: {
            invoice: this.invoiceNumber,
            date: this.date,
            party: this.getPartyName(),
            gstNo: this.getPartyGstNo(),
            totalGst: this.getTotalGst(),
            getTotalTaxableAmount: this.getTotalTaxableAmount(),
            totalAmount: this.getTotalSalesAmount(),
            localParty: this.localParty
          }
        };
        this.db.sales.insert(x, err => {
          if (err)  {
            alert("Error Try Again!!", "Stock Manager");
          } else {
            this._stockChanged();
          }
        });
      } else {
        alert(
          "None of the Fields can be empty or Out Of Stock",
          "Stock Manager"
          );
      }
    },
    _clearData() {
      this.rows = [];
      this.gstSummaryRows = [];
      this.addRow();
      alert("Done!!", "Stock Manager");
      this.refresh();
      this.$store.dispatch("incrementInvoice");
    },
    async _stockChanged() {
      const changes = [];
      this.rows.forEach((data, index, arr) => {
        let changeData = {
          id: data.id,
          quantity: parseInt(data.quantity),
          date: this.getToday(),
          type: "DECREMENT"
        };
        changes.push(this.changeStock(changeData));
      });
      console.log(changes);
      await Promise.all([...changes]).then(() => {
        this._clearData();
      });
    },
    selected(event, i) {
      let stock = this.findStock(event)[0];
      let row = this.rows[i];
      row.stockName = stock.stockName;
      this.stock(this.rows[0].stockName);
      row.HSNCode = stock.HSNCode;
      row.rate = stock.defaultSP;
      row.id = stock._id;
      row.taxPer = this.getTaxRate(
        stock.taxCategory,
        this.date,
        this.getToday()
        );
    },
    addRow() {
      const x = {
        stockName: "",
        HSNCode: "",
        quantity: "",
        rate: "",
        amount: "",
        discount: "",
        taxableValue: "",
        taxPer: "",
        gst: "",
        totalAmount: "",
        flag: false
      };
      this.rows.push(x);
    },
    addSummaryRow() {},
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
        if (data.stockName === "") {
          nullValues = false;
        }
      });

      return nullValues;
    },
    findStock: function(name) {
      return this.stocks.filter(data => {
        return data.stockName === name;
      });
    },
    getTaxRate(categoryName, entryDate, endDate) {
      let startDateRange = this._getTaxRateList(categoryName);
      let dates = startDateRange.filter(data =>
        this.inRange(entryDate, data.date, endDate)
        );
      console.log("At getTaxRate", dates);
      return dates[dates.length - 1].value;
    },
    _getTaxRateList(categoryName) {
      let list = this.category.filter(
        data => data.category === categoryName.toLowerCase()
        );
      console.log("At _getTaxRateList ", categoryName, " ", list);
      return list[0].rateList;
    },
    pdf() {
      // let i=0;
      html2canvas(document.getElementById("app")).then(canvas => {
        let img = canvas.toDataURL("image/png");
        let doc = new JSPDF("l", "mm", [370, 210]);
        doc.addImage(img, "JPEG", 5, 10);
        doc.save("StockMaster.pdf");
      });
      // let img=canvas.toDataURL("image/png");
      // var doc= new jsPDF();
      // doc.addImage(img,'JPEG',20,20);
      // doc.save('anvaya.pdf');
    }
  },
  created() {
    this.date = this.getToday();
    this.db.stocks = new this.$db({ filename: "stocks", autoload: true });
    this.db.category = new this.$db({ filename: "categories", autoload: true });

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
    // new this.$promisify(this.db.category.find, {})
    //   .then((data) => this.category = data)
    //   .catch((err) => {
    //     alert("Database Error", "Stock Manager")
    //     console.log(err);
    //   });
    // find names in Group and push to component data
    this.db.party = new this.$db({ filename: "party", autoload: true });
    this.db.party.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
          this.party.push(d);
        });
      }
    });

    [...Array(1).keys()].map(() => this.addRow());
    this.$on("addRowEvent", this.addRow);
    this.$on("submitEventExempt", this.submit);
    this.db.sales = new this.$db({ filename: "sales", autoload: true });
  },
  watch: {
    getBillFormat() {
      this.viewToken = this.getBillFormat;
    },
    getInvoice() {
      this.invoice.number = this.getInvoice;
      this.formatInvoiceNumber(this.invoice);
    },
    getInvoiceSuffix() {
      this.invoice.suffix = this.getInvoiceSuffix;
      this.formatInvoiceNumber(this.invoice);
    },
    getInvoicePrefix() {
      this.invoice.prefix = this.getInvoicePrefix;
      this.formatInvoiceNumber(this.invoice);
    },
    getEnableInvoice() {
      this.invoice.enable = this.getEnableInvoice;
      this.formatInvoiceNumber(this.invoice);
    },
    selectedParty: function() {
      let stateId = this.selectedParty.gstin.substring(0, 2);
      // console.log(this.selectedParty.gstin);

      if (stateId === this.$store.getters.getGSTIN.substring(0, 2)) {
        console.log("from sales", this.$store.getters.getGSTIN.substring(0, 2));
        this.localParty = true;
      } else {
        this.localParty = false;
      }
      // console.log('sales party',this.localParty);
    },
    date: function() {
      console.log(this.date);
      let x = this.date.substring(0, 4);
      console.log(x);
      if (x === "2018") {
        this.IsPeriod = false;
        console.log("flalbla", this.IsPeriod);
      }
    }
  },
  mounted() {
    // alert("Here")
    // const changeData = {
    //   id: '6TxJ3xisw86EP64w',
    //   quantity: 4,
    //   date: this.getToday(),
    //   type: "DECREMENT",
    // }
    // this.$store.dispatch("changeStock", changeData);
    this.viewToken = this.getBillFormat;
    this.invoice.number = this.getInvoice;
    this.invoice.suffix = this.getInvoiceSuffix;
    this.invoice.prefix = this.getInvoicePrefix;
    this.invoice.enable = this.getEnableInvoice;
    this.formatInvoiceNumber(this.invoice);
  },
  computed: {
    ...mapGetters([
      "getInvoice",
      "getInvoicePrefix",
      "getInvoiceSuffix",
      "getEnableInvoice",
      "getBillFormat"
      ]),
    filterList: function() {
      return this.stocks.filter(data => {
        let patt = new RegExp("^" + this.search + "");
        return data.stockName.match(patt);
      });
    }
    // end of computes
  }
};
</script>

<style scoped>
#table-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  height: 330px;
}

.sumary {
  position: absolute;
  bottom: 10px;
}

.partyDetailDiv {
  margin-top: -50px;
}
</style>
