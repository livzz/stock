<template>
    <div class="container">
        <div class="box">
            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Modify Stock
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <div class="field has-addons">
                            <p class="control">
                                <input class="input" v-model="search" type="text" placeholder="Find a stock">
                            </p>
                            <p class="control select">

                                    <select v-model="searchBy">
                                        <option disabled selected>Search By</option>
                                        <option value="0" >Stock Name</option>
                                        <option  value="1" >Stock Group</option>
                                        <option value="2" >Unit Name</option>
                                    </select>

                            </p>
                            <p class="control">
                              <button class="button is-primary" @click="update">Update</button>
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div class="scrollable">
        <table class="table is-bordered is-striped">
            <thead>
            <tr>
                <th>Sl. No.</abbr></th>
                <th>Stock Name</th>
                <th>HSN</abbr></th>
                <th>Unit Name</abbr></th>
                <th>Stock Groups</abbr></th>
                <th>Tax Category</th>
                <th>Opening Stock</th>
                <th>Rate</th>
                <th>Amount</th>
                <!-- <th>Location</th> -->
                <th>Selling Price</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in filterList">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" v-model="row.stockName" placeholder="Stock Name">
                </td>
                <td>
                    <input class="input" type="number" placeholder="HSN code" v-model="row.HSNCode">
                </td>
                <td>
                    <div class="select">
                    <select v-model="row.unitName">
                      <option disabled >Select Unit Name</option>
                      <option class="Option" v-for="unit in units">{{unit.main}}</option>
                    </select>
                  </div>
                </td>
                <td>
                   <div class="select">
                    <select v-model="row.stockGroup" >
                      <option disabled selected>Select Group</option>
                      <option selected >default</option>
                      <option class="Option" v-for="group in groups">{{group.group}}</option>
                    </select>
                  </div>
                </td>
                <td>
                  <p><span>{{row.taxCategory}} </span> &nbsp; <button class="button" @click="openChangeTaxCategoryModal(row)">Change</button></p>
                </td>
                <td>
                  <input class="input" type="text" placeholder="Opening Stock" v-model="row.openingStock">
                </td>
                <td>
                  <input class="input" type="number" placeholder="Rate" v-model="row.rate">
                </td>
                <td>
                    <input class="input" type="number" placeholder="Amount" v-model="row.amount">
                </td>
                <td>
                    <input class="input" type="number" placeholder="defaultSP" v-model="row.defaultSP">
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        <div class="modal" :class="{'is-active': showTaxCategoryUpdateView}">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Change Tax Category</p>
                    <button class="delete" aria-label="close" @click="showTaxCategoryUpdateView = false"></button>
                </header>
                <section class="modal-card-body">
                    <div>
                            <div class="subtitle">Tax Category</div>
                            <input class="input" type="text" v-model="previousTaxDataForAUnit.taxCategory" placeholder="Category" >
                    </div>
                    <div>
                            <div class="subtitle">From Date:</div>
                            <input class="input" type="date" v-model="previousTaxDataForAUnit.date">
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="changeTaxCategory(previousTaxDataForAUnit)">Change</button>
                    <button class="button" @click="showTaxCategoryUpdateView = false">Cancel</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import Datastore from "nedb";

export default {
  name: "modify-stock",
  data() {
    return {
      rows: [],
      db:{},
      categories: [],
      units: [],
      locations: [],
      groups:[],
      category: "",
      search:"",
      searchBy:"0",
      showTaxCategoryUpdateView:false,
      previousTaxDataForAUnit:{},
      taxCategoriesTobeChanged:[],
    };
  },
  methods: {
    addRow() {
      this.rows.push({
        stockName: "",
        HSNCode: 0,
        unitName: "",
        stockGroup: "",
        taxCategory: "",
        openingStock: 0,
        rate: 0,
        amount: 0,
        defaultSP:0,
        location: "",
      });
    },
    openChangeTaxCategoryModal(row){

      this.previousTaxDataForAUnit = {};
      this.showTaxCategoryUpdateView = true;
      this.previousTaxDataForAUnit.taxCategory = row.taxCategory;
      this.previousTaxDataForAUnit._id = row._id;
      this.previousTaxDataForAUnit.stockName = row.stockName;
      this.previousTaxDataForAUnit.date = this.getToday();
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
    },
    changeTaxCategory(data){
      this.showTaxCategoryUpdateView = false;
      this.taxCategoriesTobeChanged.push(data);
      this.rows.forEach((row)=>{
          if(row._id === data._id){
            row.taxCategory = data.taxCategory;
          }
      })
    },
    updateSalesEntry(data){
      // console.log(data);
       let updateRows =[];
      data.forEach((d,i)=>{
        this.db.sales.find({"detail.date":d.date}, (err, docs) => {
      if (err !== null) {
        alert("Database Error", "Stock Manager");
      } else {
          // console.log(docs);
          this.updateSaleEnteryInFetechedData(docs,d.stockName,d.taxCategory,d.date);
          // updateRows.push(docs);
          docs.forEach(obj=>{
            updateRows.push(obj);
          })
        if(i === data.length -1){
          // console.log(updateRows);
          updateRows.forEach(row=>{
             console.log(row._id);
            this.db.sales.update({_id:""+row._id},{$set :{items:row.items,detail:row.detail}},{ multi: true,returnUpdatedDocs:true },(err,affectedDocuments,numReplaced)=>{
              console.log(affectedDocuments);
              console.log(numReplaced);

            this.db.sales.find({},{},(err,docs)=>{
              docs.forEach(obj=>{
              console.log(obj);
          })
            })
            })
          })
        }

      }
    });

    });


    },

    updateSaleEnteryInFetechedData(docs,stockName,taxCategory,date){
      console.log(stockName,taxCategory,date)
      docs.forEach(row=>{
        // console.log(row.items);
        row.items.forEach(item=>{
          if(item.stockName === stockName){
            item.taxPer = taxCategory
            item.gst = item.taxableValue *item.taxPer/100;
            item.totalAmount = item.gst+ item.taxableValue;
          }
        })
      })
    },
    processSalesEntryData(rowsToChnageOfSalesEntry){
      rowsToChnageOfSalesEntry.forEach(d=>{
        // console.log(d._id)
          this.db.sales.update({_id:d._id},{$set:{
             "detail.date":d.detail.date,
             "items":[""],
          }
          },{multi: true},(err)=>{
            console.log(err);
          })
      })
    },
    update(){
      // console.log(this.rows)
      let successUpdate = true;
      let nullValue = false;
        this.rows.forEach(d => {
            if (d.stockName == "") {
              nullValue = true;
            }
        });

      if(!nullValue){
        this.rows.forEach(d => {
              this.db.stocks.update({_id:d._id},{$set:{
                  stockName:d.stockName,
                  HSNCode:d.HSNCode,
                  unitName:d.unitName,
                  stockGroup:d.stockGroup,
                  taxCategory:d.taxCategory,
                  openingStock:d.openingStock,
                  rate:d.rate,
                  amount:d.amount,
                  defaultSP:d.defaultSP,
                  location:d.location,
                  _id:d._id
                  }
                  },
                  function(err,numReplaced){
                    if(err!==null){
                      alert("Error! Some of the datas Cannot be inserted ")
                      successUpdate = false;
                    }
                 }
              );
        });

      }else{
        alert("Non of the Fields can be empty!!", "Stock Manager");
      }

        if(successUpdate){

          this.updateSalesEntry(this.taxCategoriesTobeChanged);
          this.taxCategoriesTobeChanged= [];
          alert("Successfully Updated")
        }else{
          alert("Error!! Couldn't Updated")
        }

    }
  },
  computed:{
    filterList:function(){
      return this.rows.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        switch(this.searchBy){
            case "0":
             return data.stockName.match(patt);
            case "1":
            return data.stockGroup.match(patt);
            case "2":
            return data.unitName.match(patt);
        }

      })
    }
  },
  created() {

    this.db.stocks = new Datastore({ filename: "stocks", autoload: true });
     this.db.units = new Datastore({ filename: "units", autoload: true });
    this.db.groups = new Datastore({ filename: "groups", autoload: true });
    this.db.sales = new Datastore({ filename: "sales", autoload: true });

    this.db.stocks.find({}, (err, docs) => {
      if (err !== null) {
        alert("Database Error", "Stock Manager");
      } else {
        docs.forEach(d => {
          this.rows.push(d);
        });
      }
    });

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
    this.db.categories = new Datastore({
      filename: "categories",
      autoload: true,
    });
    this.db.categories.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
          this.categories.push(d);
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

<style scoped>
#table-scroll{
    overflow-y:auto;
    overflow-x: hidden;
    height:360px;
}
</style>
