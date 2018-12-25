<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Modify Groups
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <input class="input" v-model="search" type="text" placeholder="Find a stock">
                        <div class="buttons">
                            <button class="button is-primary"  @click="update"> Update</button>
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
                    <input class="input" type="text" v-model="row.group" @click="change(row._id)"></input>
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
      rows: [],
      db:{},
      search:"",
    };
    //  end of data
  },
  methods: {
    update(){

      let successUpdate = true;
        this.rows.forEach(d => {
            if (d.group !== "") {
              this.db.groups.update({_id:d._id},{$set:{group:d.group}},function(err,numReplaced){
                if(err!==null){
                  alert("Error! Some of the datas Cannot be inserted ")
                  successUpdate = false;
                }
              });
            } else {
              alert("Non of the Fields can be empty!!", "Stock Manager");
            }
        });
        if(successUpdate){
          alert("Successfully Updated")
        }

    },
    change(id){
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
  computed:{
    filterList:function(){
      return this.rows.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        return data.group.match(patt);
      })
    }
    // end of computes
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
