<template>
    <div class="modal" :class="{'is-active': showParty }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Add Party</p>
                <button class="delete" aria-label="close" @click="$emit('toggleParty',!showParty)"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Party Name</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Party Name" v-model="party.name">
                    </div>
                </div>
                <div class="field">
                    <div class=" select selectContainer" >
                        <select v-model="party.type" required>
                            <option selected disabled>Select Type</option>
                            <option >Registered</option>
                            <option >Unregistered</option>
                            <option >Customer</option>
                        </select>
                    </div>
                    <div v-if="party.type=='Registered'" class="checkbox checkboxContainer">

                        <input type="radio" id="one" value="regular" v-model="party.registerType" >
                        <label for="one">Regular</label>
                        <br>
                        <input type="radio" id="two" value="composite" v-model="party.registerType" >
                        <label for="two">Composite</label>
                    </div>
                </div>
                <div  class="field">
                    <label class="label">GSTIN</label>
                    <div class="control">
                        <input class="input" maxlength="15" placeholder="Add GSTIN Here" :disabled="party.type!='Registered'"  v-model="party.gstin">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Phone</label>
                    <div class="control">
                        <input class="input" placeholder="+91 78456 45245" v-model="party.phone">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Address</label>
                    <div class="control">
                        <textarea class="textarea" placeholder="eg G. S Road, Block No. 23 " v-model="party.address"></textarea>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Pin</label>
                    <div class="control">
                        <input class="input" placeholder="eg 781001" v-model="party.pin">
                    </div>
                </div>
                <div class="field">
                    <label class="label">District</label>
                    <div class="control">
                        <input class="input" placeholder="eg Kamrup" v-model="party.district">
                    </div>
                </div>
                <div class="field">
                    <label class="label">State</label>
                    <div class="control">
                        <input class="input" placeholder="eg Assam" v-model="party.state">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Country</label>
                    <div class="control">
                        <input class="input" placeholder="eg India" v-model="party.country">
                    </div>
                </div>
        
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="add">Add</button>
                <button class="button" @click="$emit('toggleParty',!showParty)">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
import Datastore from "nedb";
import { eventBus } from "../../main";

export default {
  name: "add-party",
  props: {
    showParty: Boolean,
    updateParty: Function,
  },
  data() {
    return {
      party: {
          name:"",
          type:"Select Type",
          registerType:"",
          gstin:"",
          phone:"",
          address:"",
          pin:"",
          district:"",
          state:"",
          country:""
      },
      db: {},
    };
  },
  methods: {
    add() {
      this.db.party = new Datastore({ filename: "party", autoload: true });
      this.db.party.insert(this.party, (err, doc) => {
        if (!err) {
          alert("Done!!", "Stock Manager");
          this.$emit("toggleParty", !this.showParty);
        }
      });
      this.updateParty(this.party);
      eventBus.$emit("newParty", this.party);
    },
  },
  created() {
    
  },
};
</script>

<style scoped>

</style>
