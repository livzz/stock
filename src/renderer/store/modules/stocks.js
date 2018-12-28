// import Datastore from "nedb";
// import * as utils from "../utils";
let db = {};
// db.stocks = new Datastore({ filename: "stocks", autoload: true });
// db.stock_log = new Datastore({ filename: "stock_log", autoload: true,timestampData: true });

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

    // const stockData = {
    //   openingStock: '',
    //   closingStock: '',
    //   lastUpdated: ''
    // }

    // db.stocks.findOne({
    //   _id: payload.id
    // }, (err,doc) => {
    //   const lastUpdated = doc.lastUpdated
    //   const openingStock = doc.openingStock
    //   const closingStock = doc.closingStock

    //   if(lastUpdated === payload.date) {
    //     stockData.openingStock = openingStock // same date thus opening stock will not change
    //   } else {
    //     stockData.openingStock = closingStock // first entry on a particular
    //   }

    //   switch(payload.type) {
    //     case 'INCREMENT': 
    //     stockData.closingStock = `${parseInt(closingStock) + payload.quantity}`
    //     break;
    //     case 'DECREMENT':
    //     if((parseInt(closingStock) - payload.quantity) <= 0 ){
    //       alert("Your Stock is to low","Stock Manager")
    //     } else {
    //       stockData.closingStock = `${parseInt(closingStock) - payload.quantity}`  
    //     }
    //     break;
    //   }
    //   stockData.lastUpdated = payload.date  
    //   console.log("Stock Data", stockData)
    //   console.log("Find One Data ", doc)
    //   db.stocks.update({_id:payload.id},{ $set: stockData})
    // })
    
    
    
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
