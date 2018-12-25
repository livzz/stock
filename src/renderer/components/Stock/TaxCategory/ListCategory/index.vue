<template>
  <div>
  <div class="container" v-if="selectedCategory === ''">
    <div class="box">

      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-4">
              List Categories
            </p>
          </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
          <div class="level-item">
            <div class="field has-addons">
              <div class="buttons">
                <button class="button is-" @click="printList">Export To</button>
              </div>
              <p class="control">
                <input class="input" v-model="search" type="text" placeholder="Find a category">
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="scrollable">
    <table class="table is-bordered is-striped is-fullwidth">
      <thead>
      <tr>
        <th>Serial no.</th>
        <th>Category</th>
        <th>Tax Rate</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,i) in filterList">
        <th>{{ i + 1 }}</th>
        <td>
          {{row.category | capitalize }}
        </td>
        <td>
          <button class="button is-primary" @click="() => selectedCategory = row.category">Display</button>
        </td>
      </tr>
      </tbody>
    </table>
    </div>
  </div>
    <app-tax-rate :db="db" :categoryName="selectedCategory" @hide="() => selectedCategory = ''" v-else></app-tax-rate>
  </div>
</template>

<script>
import appTaxRate from './TaxRate';

export default {
  name: "index",
  components: {
    appTaxRate
  },
  data() {
    return {
      search:"",
      rows: [],
      db: {},
      selectedCategory: ''
    };
    // end of data
  },
  computed:{
    filterList:function() {
      return this.rows.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        return data.category.match(patt);
      })
    }
    // end of computes
  },
  methods: {
    printList:function(){
      let data = {
        name:"anvaya",
        title:"Tax Category List",
        table:this.rows,
      }

      this.$electron.ipcRenderer.send("showPrint",data);
  },
    // end of methods
  },
  created() {
    // connect to database Groups
    this.db.category = new this.$db({ filename: "categories", autoload: true });
    // find names in Group and push to component data
    this.db.category.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
           this.rows.push(d);
        });
      }

    });

    // end of created
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
