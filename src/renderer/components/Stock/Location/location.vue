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
      <div class="is-divider-vertical"></div>
      <div class="column is-primary">
        <add-location v-if="viewToken === 'Add'"></add-location>
        <modify-location v-if="viewToken === 'Modify'"></modify-location>
        <list-location v-if="viewToken === 'List'"></list-location>
      </div>
    </div>
  </section>
</template>

<script>
  import addLocation from "./AddLocation";
  import listLocation from "./ListLocation";
  import modifyLocation from "./ModifyLocation";

  export default {
    name: "location",
    data() {
      return {
        viewToken: "Add",
      };
    },
    components: {
      addLocation,
      listLocation,
      modifyLocation,
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
