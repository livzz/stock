<template>
    <div >
        <div class="section">
            <div class="column is-primary">
                <create  v-if="viewToken === 'Create'"></create>
            </div>
        </div>
    </div>
</template>

<script>
import create from "./Create";

export default {
  name: "index",
  components: {
    create,
  },
  data() {
    return {
      viewToken: "Create",
      
    };
  },
  methods: {
    changeView(view) {
      this.viewToken = view;
    },
    save(){

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
