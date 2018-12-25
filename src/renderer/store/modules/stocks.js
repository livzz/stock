import Datastore from "nedb";
let db = {};
db.stocks = new Datastore({ filename: "stocks", autoload: true });
db.stock_log = new Datastore({ filename: "stock_log", autoload: true,timestampData: true });

const state = {
  stocks: [],
  stock_log: {}
};

const mutations = {

  populateStock(state,payload){
    state.stocks.push(payload)
  }
};

const getters = {
  getStocks(state) {
    return state.stocks;
  }
}

const actions = {
  changeStock({ commit }, payload) {
    if(payload.type === 'INCREMENT'){
      db.stocks.update({id:payload._id},{ $set: { openingStock: payload.amount}})
    }
  },
  initStocksState({ commit }) {
    db.stocks.find({}, (err, docs) => {
      if (err) {
        alert("Error Loading Database!!", "Stock Manager");
        console.log(err);
      } else {
        if (docs.length > 0) {
          docs.forEach(d => {
            commit('populateStock',Object.assign({},d))
          });
        }
      }
    });
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
