<template>
    <div>
        <!-- <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
            <div class="container">
                <div class="navbar-tabs">
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Sales Entry')}" @click="changeView('Sales Entry')">Sales Entry</a>
                </div>
            </div>
        </nav> -->
        <sales-entry v-if="willShow === 'Sales Entry'"></sales-entry>
    </div>
</template>

<script>
import salesEntry from "./SalesEntry/entry";

export default {
  name: "index",
  components: {
    salesEntry,
  },
  data() {
    return {
      willShow: "Sales Entry",
    };
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
  },
};
</script>

<style scoped>

</style>
