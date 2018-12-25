<template>
  <div class="container">
    <div class="box">

      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-4">
              List Party
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
                <input class="input" v-model="search" type="text" placeholder="Find a Party">
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <table class="table is-bordered is-striped is-fullwidth">
      <thead>
      <tr>
        <th>Serial no.</th>
        <th>Name</th>
        <th>Type</th>
        <th>Register Type</th>
        <th>GSTIN</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Pin</th>
        <th>District</th>
        <th>State</th>
        <th>Country</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,i) in filterList">
        <th>{{ i + 1 }}</th>
        <td>
          {{row.name}}
        </td>
        <td>
          {{row.type}}
        </td>
        <td>
          {{row.registerType}}
        </td>
        <td>
          {{row.gstin}}
        </td>
        <td>
          {{row.phone}}
        </td>
        <td>
          {{row.address}}
        </td>
        <td>
          {{row.pin}}
        </td>
        <td>
          {{row.district}}
        </td>
        <td>
          {{row.state}}
        </td>
        <td>
          {{row.country}}
        </td>
      </tr>
      </tbody>
    </table>
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
        return data.name.match(patt);
      })
    }
    // end of computes
  },
  methods: {
    printList:function(){
      let data = {
        name:"anvaya",
        title:"Party List",
        table:this.rows,
      }
      console.log(data)
      this.$electron.ipcRenderer.send("showPrint",data);
  },
    // end of methods
  },
  created() {
    // connect to database Groups
    this.db.party = new Datastore({ filename: "party", autoload: true });
    // find names in Group and push to component data
    this.db.party.find({}, (err, docs) => {
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

</style>
