<template>
    <div class="container">
        <div class="box">
            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            List location
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
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
            </nav>
        </div>
        <table class="table is-bordered is-striped is-fullwidth">
            <thead>
            <tr>
                <th><abbr title="Serial No.">Sl. No.</abbr></th>
                <th>Location Name</th>
                <th>Address</th>
                <th>Responsible Person</th>
                <th>Phone no.</th>
                <th>Email Address</th>
                <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in rows">
                <th>{{ i + 1 }}</th>
                <td>
                    {{row.locationName}}
                </td>
                <td>
                    {{row.address}}
                </td>
                <td>
                    {{row.person}}
                </td>
                <td>
                    {{row.phone}}
                </td>
                <td>
                    {{row.email}}
                </td>
                <td>
                    <button class="button is-text">Edit</button>
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
  created() {
    // this.addRow()
    this.db.location = new Datastore({ filename: "location", autoload: true });
    this.db.location.find({}, (err, docs) => {
      if (err !== null) {
        alert("Error");
        console.log(err);
      } else {
        docs.forEach(d => {
          this.rows.push(d);
        });
        // console.log(docs)
      }
    });
  },
};
</script>

<style scoped>

</style>
