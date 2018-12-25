<template>
  <div>
    <app-party v-if="willShow === 'Party'"></app-party>
  </div>
</template>

<script>
  import Party from "./Party/Party";

  export default {
    name: "index",
    data() {
      return {
        willShow: "Party",
      };
    },
    components: {
      appParty: Party,

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
        alert("Done!!", "Party Manager");
      },
    },
  };
</script>

<style scoped>

</style>
