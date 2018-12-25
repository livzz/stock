<template>
  <section class="mt-4 ml-4">
    <div class="columns is-mobile">
      <div class="column is-info is-1">
        <aside class="menu">
          <p class="menu-label">
            Select
          </p>
          <ul class="menu-list">
            <li><a :class="{ 'is-active' :isActive('Add')}" @click="changeView('Add')">Add</a></li>
            <li><a :class="{ 'is-active' :isActive('Modify')}" @click="changeView('Modify')">Modify</a></li>
            <li><a :class="{ 'is-active' :isActive('List')}" @click="changeView('List')">List</a></li>
          </ul>
          
        </aside>
      </div>
      <div class="is-divider-vertical" style="padding:0rem"></div>
      <div class="column is-primary">
        
        <add-u-q-c v-if="viewToken === 'Add'"></add-u-q-c>
        <modify-u-q-c v-if="viewToken === 'Modify'"></modify-u-q-c>
        <list-u-q-c v-if="viewToken === 'List'"></list-u-q-c>

      </div>
      
    </div>
  </section>
</template>

<script>
  import addUQC from "./AddUQC";
  import modifyUQC from "./ModifyUQC";
  import listUQC from "./ListUQC";


  export default {
    name: "uqc",
    data() {
      return {
        viewToken: "Add",
      };
    },
    components: {
      addUQC,
      modifyUQC,
      listUQC,
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
