<template>
  <div>
    <div class="box">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <div class="subtitle">Filter Your Search</div>
              <div class="select">
               <select v-model="stockGroup">
                <option selected value="">ALL Group</option>
                <option v-for="stock in stocks">{{stock.stockGroup}}</option>

              </select>
            </div>
            <div class="select">
              <select v-model="hsnCode">
                <option selected value="">HSN Code</option>
                <option v-for="stock in count">{{stock.HSNCode}}</option>

              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div>
            <div class="field has-addons">
              <p class="control">
                <input class="input" type="text" placeholder="Find a location">
              </p>
              <p class="control">
                <button class="button">
                  Search
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <br>
  <div class="scrollable">
   <table class="table is-bordered is-striped is-fullwidth scrollable">
    <thead>
      <tr>
        <th>Serial no</th>
        <th>Stock Name</th>
        <th>HSN Code</th>
        <th>Stock Group</th>
        <th>Tax Category</th>
        <th>Rate</th>
        <th>Opening Stock</th>
        <th>Closing Stock</th>


      </tr>
    </thead>
    <tbody >
      <!-- "detail":{"invoice":"ANV17PR","date":"2018-04-11","party":"cash","totalAmount":128.57600000000002} -->
      <tr v-for="(row,i) in filterlist" >
        <th>{{ i + 1 }}</th>
        <td>
          {{row.stockName}}
        </td>
        <td>
          {{row.HSNCode}}
        </td>
        <td>
         {{row.stockGroup}}
       </td>
       <td>
        {{row.taxCategory}}
      </td>
      <td>
       {{row.rate}}
     </td>
     <td>
       {{row.openingStock}}
     </td>
     <td>
       {{row.closingStock}}
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
    name: "stock",
    data(){
      return {
        stocks:[],
        db:{},
        rows:[],
        hsnCode:'',
        stockGroup:'',
        count:[],
      };
    },
    created() {
      this.db.stocks = new Datastore({ filename: "stocks", autoload: true });
      this.db.stocks.find({}, (err, docs) => {
        if (err) {
          alert("Database Error", "Stock Manager");
        } else {
          docs.forEach(d => {
            this.stocks.push(d);
          });
          console.log('stock',this.stocks);
        }
      })
      this.db.sales = new Datastore({ filename: "sales", autoload: true });
      this.db.sales.find({}, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          docs.forEach(d => {
           this.rows.push(d);
         });
        }
        console.log('sll',this.rows);
      });
    },
    methods: {
     editEntry(id){
       this.$electron.ipcRenderer.send("editStock",id);
     }
   },
   computed:{
     filterlist(){
       if(this.stockGroup===''){
         return this.stocks;
       }else if(this.stockGroup!='' && this.hsnCode===''){
         return this.stocks.filter(element=>element.stockGroup===this.stockGroup);
       }
       else return this.stocks.filter(element=>(element.stockGroup===this.stockGroup && element.HSNCode===this.hsnCode));
     }
   },
   watch: {
    stockGroup: function() {
      if (this.stockGroup.length > 0) {
        console.log(this.stockGroup);
        this.count=this.stocks.filter(data=>data.stockGroup===this.stockGroup);
        console.log(this.count);

      }
    }
  },
};
</script>

<style scoped>
</style>
