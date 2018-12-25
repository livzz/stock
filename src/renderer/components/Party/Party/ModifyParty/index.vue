<template>
    <div class="container">
        <div class="box">

            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Modify Party
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <input class="input" v-model="search" type="text" placeholder="Find a Party">
                        <div class="buttons">
                            <button class="button is-primary"  @click="update"> Update</button>
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
                    <input class="input" type="text" placeholder="UQC Code" v-model="row.name">
                </td>
                <td>
                    
                    <div class=" select selectContainer" >
                        <select v-model="row.type">
                            <option selected disabled>Select Type</option>
                            <option >Registered</option>
                            <option >Unregistered</option>
                            <option >Customer</option>
                        </select>
                    </div>
                    <div v-if="row.type=='Registered'" class="checkbox checkboxContainer">

                        <input type="radio" id="one" value="regular" v-model="row.registerType">
                        <label for="one">Regular</label>
                        <br>
                        <input type="radio" id="two" value="composite" v-model="row.registerType">
                        <label for="two">Composite</label>

                    </div>
                </td>
                <td>
                    <input class="input" type="text" placeholder="gstin" :disabled="row.type!='Registered'"  v-model="row.gstin">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Address" v-model="row.address">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Pin" v-model="row.pin">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Address" v-model="row.phone">
                </td>
                <td>
                    <input class="input" type="text" placeholder="District" v-model="row.district">
                </td>
                <td>
                    <input class="input" type="text" placeholder="State" v-model="row.state">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Country" v-model="row.country">
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
      rows: [],
      db:{},
      search:"",
    };
    //  end of data
  },
  methods: {
    update(){
    
        let nullValues = false;
        this.rows.forEach(d => {
            if (d.name == "") {
                nullValues = true;
            }
        });

        if(!nullValues){
            this.rows.forEach(d => {
                        // console.log('not found')
                         this.db.party.update({_id:d._id},{$set:{
                            name:d.name,
                            type:d.type,
                            registerType:d.registerType,
                            gstin:d.gstin,
                            phone:d.phone,
                            address:d.address,
                            pin:d.pin,
                            district:d.district
                            ,state:d.state
                            ,country:d.country
                            }},(err, docs) => {
                            if (err !== null) {
                                alert("Error While Updating the Database");
                                console.log(err);
                            } else {
                                alert("SuccessFully Updated Database");
                                // this.rows = [];
                                // this.addRow();
                            }
                 });
                    

            });   
        }else{
            alert("Non of the Fields can be empty!!", "Party Manager");
        }

    },
    change(id){
    }
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
  computed:{
    filterList:function(){
      return this.rows.filter((data)=>{
        let patt = new RegExp("^"+this.search+"");
        return data.name.match(patt);
      })
    }
    // end of computes
  },
};
</script>

<style scoped>

</style>
