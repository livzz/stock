<template>
    <div>
        <!-- <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
            <div class="container">
                <div class="navbar-tabs">
                    <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Sales Entry')}" @click="changeView('Sales Entry')">Sales Entry</a>
                </div>
            </div>
        </nav> -->
        <purchase-entry v-if="willShow === 'Purchase Entry'"></purchase-entry>
    </div>
</template>

<script>
import purchaseEntry from "./PurchaseEntry/entry";

export default {
  name: "index",
  components: {
    purchaseEntry,
  },
  data() {
    return {
      willShow: "Purchase Entry",
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
