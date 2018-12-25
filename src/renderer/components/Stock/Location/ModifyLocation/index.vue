<template>
    <div class="container">
        <div class="box">
            <nav class="level">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-4">
                            Modify location
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="buttons">
                        <button class="button is-primary">Update</button>
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
                    <input class="input" type="text" v-model="row.locationName" placeholder="Location Name">
                </td>
                <td>
                    <input class="input" type="text" v-model="row.address" placeholder="Address">
                </td>
                <td>
                    <input class="input" type="text" v-model="row.person" placeholder="Responsible Person">
                </td>
                <td>
                    <input class="input" type="number" v-model="row.phone" placeholder="Phone no.">
                </td>
                <td>
                    <input class="input" type="email" v-model="row.email" placeholder="Email">
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      rows: [],
    };
  },
  methods: {
    addRow() {
      this.rows.push({
        locationName: "Location 1",
        address: "Garali, Jorhat",
        person: "Mr x",
        phone: 1234567890,
        email: "test@test.com",
      });
    },
  },
  created() {
    this.addRow();
  },
};
</script>

<style scoped>

</style>
