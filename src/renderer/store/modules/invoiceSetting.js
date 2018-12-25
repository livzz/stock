/* eslint-disable no-shadow-restricted-names */
import Datastore from "nedb";
let db = {};
db = new Datastore({ filename: "invoiceSetting", autoload: true });

const state = {
  _id: 0,
  invoice: 0,
  invoicePrefix: "",
  invoiceSuffix: "",
  enableInvoice: false,
  billFormat: "",
};

const mutations = {
  initInvoiceState(state, payload) {
    state._id = payload._id;
    state.invoiceSuffix = payload.invoiceSuffix;
    state.invoicePrefix = payload.invoicePrefix;
     state.invoice = payload.invoice;
    state.enableInvoice = payload.enableInvoice;
    state.billFormat = payload.billFormat;
  },
  mutateInvoice(state, payload) {
    state.invoice = payload;
  },
  incrementInvoice(state) {
    state.invoice++;
  },
  mutateInvoicePrefix(state, payload) {
    state.invoicePrefix = payload;
  },
  mutateInvoiceSuffix(state, payload) {
    state.invoiceSuffix = payload;
  },
  mutateEnableInvoice(state, payload) {
    state.enableInvoice = payload;
  },
  mutateBillFormat(state, payload) {
    state.billFormat = payload;
  },
};

const getters = {
  getInvoice(state) {
    return state.invoice;
  },
  getInvoicePrefix(state) {
    return state.invoicePrefix;
  },
  getInvoiceSuffix(state) {
    return state.invoiceSuffix;
  },
  getEnableInvoice(state) {
    return state.enableInvoice;
  },
  getBillFormat(state) {
    return state.billFormat;
  },
};

const actions = {
  setInvoice({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { invoice: payload } }, {}, () => {
      commit("mutateInvoice", payload);
    });
  },
  incrementInvoice({ commit, state }) {
    console.log("ad")
    db.update(
      { _id: state._id },
      { $set: { invoice: state.invoice + 1 } },
      {},
      () => {
        commit("incrementInvoice");
      },
    );
  },
  setInvoicePrefix({ commit, state }, payload) {
    db.update(
      { _id: state._id },
      { $set: { invoicePrefix: payload } },
      {},
      () => {
        commit("mutateInvoicePrefix", payload);
      },
    );
  },
  setInvoiceSuffix({ commit, state }, payload) {
    db.update(
      { _id: state._id },
      { $set: { invoiceSuffix: payload } },
      {},
      () => {
        commit("mutateInvoiceSuffix", payload);
      },
    );
  },
  setEnableInvoice({ commit, state }, payload) {
    db.update(
      { _id: state._id },
      { $set: { enableInvoice: payload } },
      {},
      () => {
        commit("mutateEnableInvoice", payload);
      },
    );
  },
  setBillFormat({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { billFormat: payload } }, {}, () => {
      commit("mutateBillFormat", payload);
    });
  },
  initInvoiceState({ commit }) {
    let x = {
      invoice: 0,
      invoicePrefix: "",
      invoiceSuffix: "",
      enableInvoice: false,
      billFormat: "Regular",
    };
    db.find({}, (err, docs) => {
      if (err) {
        alert("Error Loading Database!!", "Stock Manager");
        console.log(err);
      } else {
        if (docs.length > 0) {
          docs.forEach(d => {
            commit("initInvoiceState", d);
          });
        } else {
          db.insert(x, (undefined, d) => {
            commit("initInvoiceState", d);
          });
        }
      }
    });
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
