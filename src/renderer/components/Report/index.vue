<template>
  <div>
    <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-tabs">
          <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Sales')}"
          @click="changeView('Sales')">Sales</a>
          <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Purchase')}"
          @click="changeView('Purchase')">Purchase</a>
          <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('Stock')}"
          @click="changeView('Stock')">Stock</a>
          <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('CreditNote')}"
          @click="changeView('CreditNote')">CreditNote</a>
          <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('DebitNote')}"
          @click="changeView('DebitNote')">DebitNote</a>
          <a class="navbar-item is-tab" :class="{ 'is-active' : isActive('DeliveryChalan')}"
          @click="changeView('DeliveryChalan')">DeliveryChalan</a>
        </div>
      </div>
    </nav>
    <br/>
    <div class="container">
      <stock v-if="viewToken === 'Stock'"></stock>
      <sales v-if="viewToken === 'Sales'"></sales>
      <purchase v-if="viewToken === 'Purchase'"></purchase>
      <credit-note v-if="viewToken === 'CreditNote'"></credit-note>
      <debit-note v-if="viewToken === 'DebitNote'"></debit-note>
      <delivery-chalan v-if="viewToken === 'DeliveryChalan'"></delivery-chalan>
    </div>
  </div>
</template>

<script>
  import Sales from "./Sales/sales";
  import Purchase from "./Purchase/purchase";
  import Stock from "./Stock/stock";
  import CreditNote from "./CreditNote/creditnote";
  import DebitNote from "./DebitNote/debitnote";
  import DeliveryChalan from "./DeliveryChalan/deliverychalan";
  export default {
    name: "index",
    components: {
      Stock,
      Sales,
      Purchase,
      CreditNote,
      DebitNote,
      DeliveryChalan,
    },
    data() {
      return {
        viewToken: "Sales",
      };
    },
    methods: {
      changeView(view) {
        this.viewToken = view;
      },
      isActive(view) {
        if (this.viewToken === view) {
          return true;
        }
      },
    },
  };
</script>

<style scoped>

</style>
