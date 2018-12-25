<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Modify Unit
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <input class="input"  v-model="search"  type="text" placeholder="Find a stock">
                        <div class="buttons">
                            <button class="button is-primary" @click="update">Update</button>
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
                <th>Unit Name</th>
                <th>UQC</th>
                <!-- <th>Conversion</th> -->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in filterList">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" v-model="row.main" placeholder="Unit Name">
                </td>
                <td>
                  <!-- Todo list -->
                  <div class="select">

                    <select v-model="row.sub">
                      <option class="Option">{{row.sub}}</option>
                      <option class="Option" v-for="unit in sublist"  > {{unit.uqc}}</option>
                    </select>
                  </div>
                </td>
                <!-- <td>
                    <input class="input" type="text" v-model="row.conversion" placeholder="Conversion">
                </td> -->
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
      rows: [],
      db:{},
      sublist:[],
      search:"",
    };
    // end of data
  },
  methods: {
    addRow() {
      this.rows.push({
        main: "",
        sub: "",
        conversion: 0,
      });
    },
    update(){

      let successUpdate = true;
      let nullValue = false;
        this.rows.forEach(d => {
            if (d.main == "") {
              nullValue = true;
            }
        });

      if(!nullValue){
        this.rows.forEach(d => {
              this.db.units.update({_id:d._id},{$set:{main:d.main,sub:d.sub,conversion:d.conversion,_id:d._id}},function(err,numReplaced){
                if(err!==null){
                  alert("Error! Some of the datas Cannot be inserted ")
                  successUpdate = false;
                }
              });
        });

      }else{
        alert("Non of the Fields can be empty!!", "Stock Manager");
      }

        if(successUpdate){
          alert("Successfully Updated")
        }else{
          alert("Error!! Couldn't Updated")
        }

    }
    // end of methods
  },

  created() {
    // this.sublist = this.$store.getters.getSubUnits;
    this.db.units = new Datastore({ filename: "units", autoload: true });
    this.db.units.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
          this.rows.push(d);
        });
      }
    });

    this.db.uqc = new Datastore({ filename: "UQC", autoload: true });
    this.db.uqc.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
           this.sublist.push(d);
        });
      }

    });
    // end of created
  },
  computed:{
    filterList:function(){
      return this.rows.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        return data.main.match(patt);
      })
    }
    // end of computed
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
