<template>
    <div>
        <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
            <div class="container">
                <div class="navbar-tabs">
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Stock')}" @click="changeView('Stock')">Stock</a>
                   <!-- not required for now -->
                    <!-- <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Location')}" @click="changeView('Location')">Location</a> -->
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Units')}" @click="changeView('Units')">Units</a>
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Groups')}" @click="changeView('Groups')">Groups</a>
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('TaxCategory')}" @click="changeView('TaxCategory')">TaxCategory</a>
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('UQC')}" @click="changeView('UQC')">UQC</a>
                </div>
            </div>
        </nav>
        <app-create-stock v-if="willShow === 'Stock'"></app-create-stock>
        <!-- not required for now -->
        <!-- <app-location v-if="willShow === 'Location'"></app-location> -->
        <app-units v-if="willShow === 'Units'"></app-units>
        <app-groups v-if="willShow === 'Groups'"></app-groups>
        <app-tax-category v-if="willShow === 'TaxCategory'"></app-tax-category>
        <app-u-q-c v-if="willShow === 'UQC'"></app-u-q-c>
    </div>
</template>

<script>
import Stock from "./Stock/Stock";
// import Location from "./Location/location";
import Units from "./Units/units";
import Groups from "./Groups/groups";
import TaxCategory from "./TaxCategory/TaxCategory";
import UQC from "./UQC/UQC";

export default {
  name: "index",
  data() {
    return {
      willShow: "Stock",
    };
  },
  components: {
    appCreateStock: Stock,
    // appLocation: Location,
    appUnits: Units,
    appGroups: Groups,
    appTaxCategory : TaxCategory,
    appUQC: UQC,

  },
  methods: {
    changeView(view) {
      this.willShow = view;
    },
    isActive(view) {
      if (this.willShow === view) {
        return true;
      }
    },
    test() {
      alert("Done!!", "Stock Manager");
    },
  },
};
</script>

<style scoped>

</style>
