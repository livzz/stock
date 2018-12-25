<template>
    <div class="container-fluid partyDetailDiv">
        <div class="box">
            <nav class="level">
                <div class="level-left">
                    <div class="level-item">
                        <div>
                            <div class="subtitle">Invoice date:</div>
                            <input class="input" type="date"  v-model="date">
                        </div>
                    </div>
                    <div class="level-item">
                        <div>
                            <div>
                              
                                
                                
                              
                                  <div class="subtitle">Party A/C Name:</div>
                                  

                                <div class="select">
                                    <select v-model="selectedParty">

                                        <option  value="cash" selected>cash</option>
                                        <option v-for="account in getparties" :value="account">{{account.name}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="level-item">
                        <div>
                            <div>
                                <div class="subtitle">Invoice No:</div>
                                <!-- v-model="invoiceNumber" -->
                                <input class="input" placeholder="Invoice no" v-model="invoiceNo">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <button class="button is-info" @click="$emit('addRowEvent')">Add Row</button>
                    </div>
                    <div class="level-item">
                        <button class="button is-dark" @click="$emit('RemoveRowEvent')">Remove Row</button>
                    </div>
                    <div class="level-item">
                        <button class="button is-dark" @click="addParty = true">Add Party</button>
                    </div>
                    <div class="level-item">
                        <button class="button is-dark" @click="addItem = true">Add Item</button>
                    </div>
                    <div class="level-item">
                        <button class="button is-success" @click="submitEvent">Save</button>
                    </div>
                </div>
            </nav>
        </div>
        
        <app-add-purchase-list ref="addSalesList" :party="selectedParty" :data="{ date, selectedParty, invoiceNo }"></app-add-purchase-list>
        <app-add-party :updateParty="updateParty" :showParty="addParty" @toggleParty="addParty = $event"></app-add-party>
        <app-add-item :updateItem="updateItem" :showItem="addItem" @toggleItem="addItem = $event"> </app-add-item>
    </div>
</template>
<script>
import appAddPurchaseList from "./addPurchaseList";
import appAddParty from "../../../widgets/addParty";
import appAddItem from "../../../widgets/addItem";

import Datastore from "nedb";

import {
  mapGetters
} from "vuex";

export default {
  components: {
    appAddPurchaseList,
    appAddParty,
    appAddItem,
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
      newParty:"cash",
      invoiceNo:"",
      switchState:true,
      stateId:"",
      invoice: {
        number: 0,
        prefix: "",
        suffix: 0,
        enable: false,
      },
    };
  },
  methods: {
    updateParty(data) {
      this.party.push(data);
    },
    updateItem(data) {
      let child = this.$refs.addSalesList;
      child.refresh(data);
    },
    formatInvoiceNumber(setting) {
      if (setting.enable) {
        this.invoiceNumber = setting.prefix + setting.number + setting.suffix;
      } else {
        this.invoiceNumber = 0;
      }
    },
    submitEvent() {
      let child = this.$refs.addSalesList;
      child.submit();
    },
    checkFields() {
      return true;
    },
    getToday(){
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }

      today = yyyy + '-' + mm + '-' + dd;
      return today.toString();
    }
  },
  created() {
    this.date = this.getToday();
    
    // connect to database Groups
     this.db.party = new Datastore({ filename: "party", autoload: true });
    // find names in Group and push to component data
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
  },
  computed: {
    ...mapGetters([
  //    "getInvoice",
 //     "getInvoicePrefix",
  //    "getInvoiceSuffix",
  //    "getEnableInvoice",
 //     "getBillFormat",
   ]),


    getparties(){
      return this.party;
    }
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

   // selectedParty : function () {
      // if(this.selectedParty!='cash'){
      //   this.stateId = this.  selectedParty.gstin.substring(0, 2);
     //   console.log("id",this.stateId);
    //   }
    //    if (this.stateId != 18) {
     //     this.switchState = false;
     //     console.log(this.switchState);
     //   } else {
     //     this.switchState = true;
      //    console.log(this.switchState);
      //  }
      // },

  },
  mounted() {
   // this.viewToken = this.getBillFormat;
  //  this.invoice.number = this.getInvoice;
  //  this.invoice.suffix = this.getInvoiceSuffix;
   // this.invoice.prefix = this.getInvoicePrefix;
   // this.invoice.enable = this.getEnableInvoice;
   // this.formatInvoiceNumber(this.invoice);
  },
};

</script>

<style scoped>
.partyDetailDiv{
  margin-top: -50px;
}
</style>
