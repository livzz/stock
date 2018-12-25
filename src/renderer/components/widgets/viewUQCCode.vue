<template>
  <div class="modal" :class="{'is-active': show }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">List of Unit Quantity Codes (UQC)</p>
        <button class="delete" aria-label="close" @click="$emit('toggle',!show)"></button>
      </header>
      <section class="modal-card-body">
        <table class="table is-striped is-fullwidth">
          <thead>
          <tr>
            <th>Serial no.</th>
            <th>UQC code</th>
            <th>Quantity</th>
            <th>Quantity Type</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in getUQC " >
            <td>{{ i + 1 }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.type }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="modal-card-foot">
        <button class="button is-success" :class="{ 'is-loading': isUpdating}" @click="update"> Update </button>
      </section>
    </div>
  </div>
</template>

<script>
// TODO make api call to server when update is clicked
// import Axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "view-u-q-c-code",
  props: {
    show: Boolean,
  },
  data() {
    return {
      isUpdating: false,
    };
  },
  methods: {
    ...mapActions(["setUQC"]),
    update() {
      this.isUpdating = true;
      setTimeout(() => {
        this.isUpdating = false;
      }, 1000);
    },
  },
  computed: {
    ...mapGetters(["getUQC"]),
  },
  watch: {
    show() {
      if (this.show) {
      }
    },
  },
};
</script>

<style scoped>

</style>
