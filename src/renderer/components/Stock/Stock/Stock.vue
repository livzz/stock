<template>
  <section class="mt-4 ml-4">
    <div class="columns is-mobile">
      <div class="column is-info is-1">
        <aside class="menu">
          <p class="menu-label">
            Select
          </p>
          <ul class="menu-list">
            <li><a :class="{ 'is-active' :isActive('Add')}" @click="changeView('Add')">Add </a></li>
            <li><a :class="{ 'is-active' :isActive('Modify')}" @click="changeView('Modify')">Modify </a></li>
            <li><a :class="{ 'is-active' :isActive('List')}" @click="changeView('List')">List </a></li>
          </ul>
        </aside>
      </div>
      <div class="is-divider-vertical" style="padding:0rem"></div>
      <div class="column is-primary">
        <add-stock v-if="viewToken === 'Add'"></add-stock>
        <modify-stock v-if="viewToken === 'Modify'"></modify-stock>
        <list-stock v-if="viewToken === 'List'"></list-stock>
      </div>
    </div>
  </section>
</template>

<script>
  import addStock from "./AddStock/addStock";
  import modifyStock from "./ModifyStock/modifyStock";
  import listStock from "./SearchStock/searchStock";

  export default {
    name: "create-stock",
    data() {
      return {
        viewToken: "Add",
      };
    },
    components: {
      addStock,
      modifyStock,
      listStock,
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
