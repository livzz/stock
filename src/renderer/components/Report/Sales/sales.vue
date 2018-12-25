<template>
  <div>
    <div class="box">
      <div class="level">
        <div class="level-left">
          <div>
            <div class="subtitle">Filter Your Search</div>
            <div class="level-item">
              <div class="select">
                <select v-model="selectedParty">
                  <option  selected  value="">All Party</option>
                  <option  value="cash">Cash</option>
                  <option v-for="name in party">{{name.name}}</option>
                </select>
              </div>
              <div class="select">
                <select v-model="selectedPeriods" :disabled="selectedParty.length == 0">
                  <option  selected value="">All Period</option>
                  <option v-for="periods in count">{{periods.detail.date}}</option>
                </select>

              </div>
              <div class="select">
                <select v-model=" period1" :disabled="selectedPeriods.length == 0">
                  <option  selected value="">Select Start Date</option>
                  <option v-for="periods in startdate">{{periods.detail.date}}</option>
                </select>

              </div>
              <div class="select">
                <select v-model=" period2" :disabled="selectedPeriods.length == 0">
                  <option  selected value="">Select End Date</option>
                  <option v-for="periods in startdate">{{periods.detail.date}}</option>
                </select>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br/>
    <div class="scrollable">
      <table class="table is-bordered is-striped is-fullwidth scrollable">
        <thead>
          <tr>
            <th>Serial no.</th>
            <th>Invoice No.</th>
            <th>Invoice Date</th>
            <th>Party Name</th>
            <th>GST NO</th>
            <th>Total Taxable Amount</th>
            <th>Total GST</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody >
          <!-- "detail":{"invoice":"ANV17PR","date":"2018-04-11","party":"cash","totalAmount":128.57600000000002} -->
          <tr v-for="(row,i) in filterList" >
            <th>{{ i + 1 }}</th>
            <td>
              {{ row.detail.invoice }}
            </td>
            <td>
              {{ row.detail.date }}
            </td>
            <td>
              {{ row.detail.party }}
            </td>
            <td>
              {{row.detail.gstNo}}
            </td>
            <td>
              {{row.detail.getTotalTaxableAmount}}
            </td>
            <td>
              {{row.detail.totalGst}}
            </td>
            <td>
              {{ row.detail.totalAmount }}
            </td>
            <td>
              <button class="button is-info" @click="editEntry(row._id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import Datastore from "nedb";

  export default {
    name: "editSales",
    components: {
    },
    data() {
      return {
        rows: [],
        loaded: false,
        db: {},
        showModifyModel:false,
        type:"SALES",
        row:{},
        searchSelectType:0,
        party: [],
        selectedParty: "",
        selectedPeriods:"",
        count:[],
        period1:"",
        period2:"",
        startdate:[],
      };
    },
    created() {
      this.db.sales = new Datastore({ filename: "sales", autoload: true });
      this.db.sales.find({}, (err, docs) => {
        if (err) {
          alert("Database Error", "Stock Manager");
        } else {
          docs.forEach(d => {
            this.rows.push(d);
          });
          console.log('sales',this.rows);
        }
      })
      this.db.party = new Datastore({ filename: "party", autoload: true });
      this.db.party.find({}, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          docs.forEach(d => {
           this.party.push(d);
         });
        }
        console.log(this.party);
      });
    },
    mounted(){
      this.$electron.ipcRenderer.on('reload',()=>{
        console.log("reload called");
        this.reloadRows();
      })
    },
    computed:{
      filterList () {
        if(this.selectedParty === ''){
          return this.rows;
        } else
        if(this.selectedParty!='' && this.selectedPeriods===''){
          return this.rows.filter(data => data.detail.party === this.selectedParty);
        }else if(this.selectedPeriods!='' && this.period1===''){
          return this.rows.filter(data => (data.detail.party === this.selectedParty && data.detail.date===this.selectedPeriods));
        }
        else{
          return this.startdate.filter((data)=>{
            let setdate=data.detail.date;
            console.log(setdate);
            return (setdate>=this.period1 && setdate<=this.period2);
          })
        }

      }
    // end of computes
  },
  watch: {
    selectedParty: function() {
      if (this.selectedParty.length > 0) {
        console.log(this.selectedParty)
        this.count=this.rows.filter(data=>data.detail.party===this.selectedParty);
        console.log(this.count);

      }
    },
    count: function() {
      if (this.selectedParty.length > 0) {
        console.log(this.selectedParty)
        this.startdate=this.rows.filter(data=>data.detail.party===this.selectedParty);
        console.log('startdate',this.startdate);

      }
    }
  },
  methods:{
    searchSelectChanged(e){
      this.searchSelectType = e.target.selectedIndex;
      console.log(this.searchSelectType)
    },
    editEntry(id){
      this.$electron.ipcRenderer.send("editSales",id);
    },

    reloadRows(){
      this.rows = [];
      this.db.sales = new Datastore({ filename: "sales", autoload: true });
      this.db.sales.find({}, (err, docs) => {
        if (err) {
          alert("Database Error", "Stock Manager");
        } else {
          docs.forEach(d => {
            this.rows.push(d);
          });
        }
      });
    },
  }
};
</script>

<style scoped>
.select,
.input {
  margin-right: 20px;
}
.space {
  padding-left: 10px;
}
</style>
