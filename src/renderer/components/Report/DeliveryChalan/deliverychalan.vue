<template>
    <div>
        <div class="box">
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <div>
                            <div class="subtitle">Filter Your Search</div>
                            <div class="select">
                                <select v-model="selectedParty">
                                    <option selected value="">All Party</option>
                                    <option  value="cash">Cash</option>
                                    <option v-for="party in party">{{party.name}}</option>

                                </select>
                            </div>
                            <div class="select">
                                <select v-model="selectedPeriods" :disabled="selectedParty.length == 0">
                                    <option selected value="">All Periods</option>
                                    <option v-for="date in count">{{date.detail.date}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="select" id="set">
                            <select v-model=" period1" :disabled="selectedPeriods.length == 0">
                              <option  selected value="">Select Start Date</option>
                              <option v-for="periods in startdate">{{periods.detail.date}}</option>
                            </select>

                          </div>
                          <div class="select" id="sett">
                            <select v-model=" period2" :disabled="selectedPeriods.length == 0">
                              <option  selected value="">Select End Date</option>
                              <option v-for="periods in startdate">{{periods.detail.date}}</option>
                            </select>

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
                <th>Date</th>
                <th>Invoice No.</th>
                <th>Party Name</th>
                <th>Taxable Value</th>
                <th><abbr title="Goods Sales Tax">GST</abbr></th>
                <th>Bill Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in filterList">
                <th>
                <div v-if="isEdit">
                {{ row.detail.date }}
                </div>
                
                </th>
                <td>
                <div>
                    {{ row.detail.chalanNo }}
                </div>
                
                </td>
                <td>
                
                 <div>
                 {{row.detail.party}}
                 </div>
                
                 
                </td>

                <td>
                <div>
                   {{row.detail.getTotalTaxableAmount}}
                 </div>
                </td>

                <td>
                <div>
                   {{row.detail.totalGst}}
                 </div>
                 
                </td>

               <td>
                <div>
                   {{row.detail.totalAmount}}
                 </div>
                 
                </td>
                <td v-if="isEdit">
                    <button class="button is-info" @click="editEntry(row._id)">Edit</button>
                </td>
                <td v-if="!isEdit">
                    <button class="button is-info" @click="Cancel">Cancel</button>
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
  name: "purchase",
  data() {
    return {
      rows:[],
       db: {},
       selectedParty:'',
       selectedPeriods:'',
       count:'',
       period1:'',
       period2:'',
       party:[],
       selectedItem:'',
       isEdit:true,
       startdate:[],
    };
  },
  created() {
    this.db.delivery_challan = new Datastore({ filename: "delivery_challan", autoload: true });
    this.db.delivery_challan.find({}, (err, docs) => {
      if (err) {
        alert("Database Error", "Stock Manager");
      } else {
        docs.forEach(d => {
          this.rows.push(d);
        });
        console.log('purchase',this.rows);
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
  computed:{
      filterList(){
          if(this.selectedParty===''){
              return this.rows;
          }else if(this.selectedParty!='' && this.selectedPeriods===''){
          return this.rows.filter(data=>(data.detail.party.name===this.selectedParty || data.detail.party===this.selectedParty));
          }
           else if(this.selectedPeriods!='' && this.period1===''){
             return this.rows.filter(data => ((data.detail.party.name===this.selectedParty || data.detail.party===this.selectedParty)&& data.detail.date===this.selectedPeriods));
      }
      else{
          return this.count.filter((data)=>{
              let setdate=data.detail.date;
              console.log(setdate);
              return (setdate>=this.period1 && setdate<=this.period2);
          })
      }

      }

  },
   watch: {
        selectedParty: function() {
            if (this.selectedParty.length > 0) {
              console.log(this.selectedParty)
               this.count=this.rows.filter(data=>(data.detail.party.name===this.selectedParty||data.detail.party===this.selectedParty));
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
    editEntry(id){
        //   console.log(id);
        //   this.selectedItem=id;
        //   this.isEdit=false;
        this.$electron.ipcRenderer.send("editdelivery",id);
      },
    Cancel(){
        this.isEdit=true;
        this.selectedItem='';
    }
}
};
</script>

<style scoped>
.select,
.input {
  margin-right: 20px;
}
.space2 {
  padding-left: 5px;
  margin-top: 23px;
}
#set{
margin-top: 19px;
}
#sett{
margin-top: 19PX;
}
</style>
