<template>
  <div class="container">
    <div class="box">

      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-4">
              List Groups
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
                <input class="input" v-model="search" type="text" placeholder="Find a stock">
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div id="table-scroll">
    <table class="table is-bordered is-striped is-fullwidth">
      <thead>
      <tr>
        <th>Serial no.</th>
        <th>Group</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,i) in filterList">
        <th>{{ i + 1 }}</th>
        <td>
          {{row.group}}
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
  name: "index",
  data() {
    return {
      search:"",
      rows: [],
      db: {},
    };
    // end of data
  },
  computed:{
    filterList:function(){
      return this.rows.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        return data.group.match(patt);
      })
    }
    // end of computes
  },
  methods: {
    printList:function(){
      let data = {
        name:"anvaya",
        title:"Group List",
        table:this.rows,
      }
      
      this.$electron.ipcRenderer.send("showPrint",data);
       
     // window.print();
    }
    // end of methods
  },
  created() {
    // connect to database Groups
    this.db.groups = new Datastore({ filename: "groups", autoload: true });
    // find names in Group and push to component data
    this.db.groups.find({}, (err, docs) => {
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
