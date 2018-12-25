import Datastore from "nedb";
let db = {};
db = new Datastore({ filename: "UQC", autoload: true });
const state = {
  _id: "",
  UQC: [],
};
const mutations = {
  initUQCCodeState(state, payload) {
    state._id = payload._id;
    state.UQC = payload.UQC;
  },
  mutateUQC(state, payload) {
    state.UQC = payload.UQC;
  },
};

const getters = {
  getUQC(state) {
    return state.UQC;
  },
};

const actions = {
  initUQCCodeState({ commit }) {
    const x = {
      UQC: [],
    };
    db.find({}, (err, docs) => {
      if (err) {
        alert("Error Loading Database!!", "Stock Manager");
        console.log(err);
      } else {
        if (docs.length > 0) {
          docs.forEach(d => {
            commit("initUQCCodeState", d);
          });
        } else {
          db.insert(x, (undefined, d) => {
            commit("initProfileState", d);
          });
        }
      }
    });
  },
  setUQC({ commit, state }, payload) {
    db.update({ _id: state._id }, { $set: { UQC: payload } }, {}, () => {
      commit("mutateUQC", payload);
    });
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
