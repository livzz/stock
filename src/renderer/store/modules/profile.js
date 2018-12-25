/* eslint-disable no-shadow-restricted-names */
import Datastore from "nedb";
let db = {};
db = new Datastore({ filename: "profile", autoload: true });
const state = {
  name: "",
  email: "",
  phone: "",
  GSTIN: "",
  address: "",
  state: "",
  district: "",
  _id: "",
};

const mutations = {
  initProfileState(state, payload) {
    state.name = payload.name;
    state.email = payload.email;
    state.phone = payload.phone;
    state.GSTIN = payload.GSTIN;
    state.address = payload.address;
    state.state = payload.state;
    state.district = payload.district;
    state._id = payload._id;
  },
  mutateName(state, payload) {
    state.name = payload;
  },
  mutateEmail(state, payload) {
    state.email = payload;
  },
  mutatePhone(state, payload) {
    state.phone = payload;
  },
  mutateGSTIN(state, payload) {
    state.GSTIN = payload;
  },
  mutateAddress(state, payload) {
    state.address = payload;
  },
  mutateState(state, payload) {
    state.state = payload;
  },
  mutateDistrict(state, payload) {
    state.district = payload;
  },
};

const getters = {
  getProfile(state) {
    return state;
  },
  getName(state) {
    return state.name;
  },
  getEmail(state) {
    return state.email;
  },
  getPhone(state) {
    return state.phone;
  },
  getGSTIN(state) {
    return state.GSTIN;
  },
  getState(state) {
    return state.state;
  },
  getDistrict(state) {
    return state.district;
  },
  getAddress(state) {
    return state.address;
  },
};

const actions = {
  setName({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { name: payload } }, {}, () => {
      commit("mutateName", payload);
    });
  },
  setEmail({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { email: payload } }, {}, () => {
      commit("mutateEmail", payload);
    });
  },
  setPhone({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { phone: payload } }, {}, () => {
      commit("mutatePhone", payload);
    });
  },
  setGSTIN({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { GSTIN: payload } }, {}, () => {
      commit("mutateGSTIN", payload);
    });
  },
  setAddress({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { address: payload } }, {}, () => {
      commit("mutateAddress", payload);
    });
  },
  setState({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { state: payload } }, {}, () => {
      commit("mutateState", payload);
    });
  },
  setDistrict({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { district: payload } }, {}, () => {
      commit("mutateDistrict", payload);
    });
  },
  setProfile({ commit, state }, payload) {
    db.update({ _id: state._id }, payload, {}, () => {
      commit("initProfileState", payload);
    });
  },
  initProfileState({ commit }) {
    const x = {
      name: "",
      address: "",
      email: "",
      phone: "",
      GSTIN: "",
      state: "",
      district: "",
    };
    db.find({}, (err, docs) => {
      if (err) {
        alert("Error Loading Database!!", "Stock Manager");
        console.log(err);
      } else {
        if (docs.length > 0) {
          docs.forEach(d => {
            commit("initProfileState", d);
          });
        } else {
          db.insert(x, (undefined, d) => {
            commit("initProfileState", d);
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
