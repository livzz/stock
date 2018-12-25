<template>
    <div class="container">
        <div class="box">
            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Add location
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="buttons">
                        <button class="button is-dark" @click="addRow">Add more row</button>
                        <button class="button is-primary" @click="submit">Submit</button>
                    </div>
                </div>
            </nav>
        </div>
        <table class="table is-bordered is-striped">
            <thead>
            <tr>
                <th><abbr title="Serial No.">Sl. No.</abbr></th>
                <th>Location Name</th>
                <th>Address</th>
                <th>Responsible Person</th>
                <th>Phone no.</th>
                <th>Email Address</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    <input class="input" type="text" placeholder="Location Name" v-model="row.locationName">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Address" v-model="row.address">
                </td>
                <td>
                    <input class="input" type="text" placeholder="Responsible Person" v-model="row.person">
                </td>
                <td>
                    <input class="input" type="number" placeholder="Phone no." v-model="row.phone">
                </td>
                <td>
                    <input class="input" type="email" placeholder="Email" v-model="row.email">
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
      db: {},
    };
  },
  methods: {
    addRow() {
      this.rows.push({
        locationName: "",
        address: "",
        person: "",
        phone: "",
        email: "",
      });
    },
    submit() {
      if (this.rows[0].locationName !== "") {
        this.db.location.insert(this.rows);
        this.rows = [];
        this.addRow();
        alert("Done!!", "Stock Manager");
      } else {
        alert("Non of the Fields can be empty!!", "Stock Manager");
      }
    },
  },
  created() {
    this.addRow();
    this.db.location = new Datastore({ filename: "location", autoload: true });
  },
};
</script>

<style scoped>

</style>
