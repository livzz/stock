<template>
    <div class="modal" :class="{'is-active': show }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Invoice Setting</p>
                <button class="delete" aria-label="close" @click="$emit('toggle',!show)"></button>
            </header>
            <section class="modal-card-body">
                <!-- <div class="field">
                    <label class="label">Set Invoice No.</label>
                    <div class="control">
                        <input class="input" v-model="invoice">
                    </div>
                </div> -->
                <div class="columns">
                    <div class="column">
                        <div class="field">
                            <label class="label">Invoice Prefix</label>
                            <div class="control">
                                <input class="input" type="text" v-model="invoicePrefix">
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="field">
                            <label class="label">Invoice Suffix</label>
                            <div class="control">
                                <input class="input" type="text" v-model="invoiceSuffix">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <label class="checkbox">
                            <input type="checkbox" v-model="enableInvoice">
                            Enable auto Invoice No.
                        </label>
                    </div>
                </div>
                <div class="is-divider"></div>
                <div class="field">
                    <label class="label">Current Bill Format</label>
                    <div class="select">
                        <select v-model="billFormat">
                            <option>Regular</option>
                            <option>Composite</option>
                            <!-- <option>Exempt</option> -->
                        </select>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="update">Update</button>
                <button class="button" @click="$emit('toggle',!show)">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "setting",
  props: {
    show: Boolean,
  },
  data() {
    return {
      db: {},
      invoice: 0,
      invoicePrefix: "",
      invoiceSuffix: "",
      enableInvoice: "",
      billFormat: "",
    };
  },
  methods: {
    ...mapActions([
      "setInvoice",
      "setInvoicePrefix",
      "setInvoiceSuffix",
      "setEnableInvoice",
      "setBillFormat",
    ]),
    update() {
      this.setInvoice(this.invoice);
      this.setInvoicePrefix(this.invoicePrefix);
      this.setInvoiceSuffix(this.invoiceSuffix);
      this.setEnableInvoice(this.enableInvoice);
      this.setBillFormat(this.billFormat);
      this.$emit("toggle", !this.show);
    },
  },
  computed: {
    ...mapGetters([
      "getInvoice",
      "getInvoicePrefix",
      "getInvoiceSuffix",
      "getEnableInvoice",
      "getBillFormat",
    ]),
    getSetInvoice: {
      get() {
        return this.getInvoice;
      },
      set(data) {
        console.log("Data: " + data + " Invoice: " + this.invoice);
        this.invoice = data;
      },
    },
    getSetInvoicePrefix: {
      get() {
        return this.getInvoicePrefix;
      },
      set(data) {
        this.invoicePrefix = data;
      },
    },
    getSetInvoiceSuffix: {
      get() {
        return this.getInvoiceSuffix;
      },
      set(data) {
        this.invoiceSuffix = data;
      },
    },
    getSetEnableInvoice: {
      get() {
        return this.getEnableInvoice;
      },
      set(data) {
        this.enableInvoice = data;
      },
    },
    getSetBillFormat: {
      get() {
        return this.getBillFormat;
      },
      set(data) {
        this.billFormat = data;
      },
    },
  },
  watch: {
    show() {
      if (this.show) {
        this.invoice = this.getInvoice;
        this.invoicePrefix = this.getInvoicePrefix;
        this.invoiceSuffix = this.getInvoiceSuffix;
        this.billFormat = this.getBillFormat;
        this.enableInvoice = this.getEnableInvoice;
      }
    },
  },
};
</script>

<style scoped>

</style>
