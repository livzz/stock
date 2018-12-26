import Datastore from "nedb";
import * as utils from "../utils";
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

    // payload.data.forEach(() => {

    // })

    const logData = {
      os: '',
      cs: '',
      date: ''
    }

    if(payload.type === 'INCREMENT'){
      db.stocks.update({id:payload.id},{ $set: { openingStock: payload.openingStock + payload.quantity}})
      logData.os = payload.openingStock;
      logData.cs = payload.openingStock + payload.quantity;
      logData.date = payload.date
    }
    db.stock_log.findOne({item:payload.id},(err,doc) => {
      if(doc.length === 0) {
        db.stock_log.insert({
          item: payload.id, logs: [logData]
        }, (err, newDoc) => {
          if(err) {
            alert("Error while inserting into Database!!", "Stock Manager");
          }
        })
      } else {
        dispatch('_persistChanges', {
          id: payload.id,
          data: logData,
          quantity: payload.quantity,
          type: payload.type,
          date: payload.date,
          openingStock: payload.openingStock
        })
      }
    })
  },
  _persistChanges({dispatch}, newData) {
    let logEntryFoundFlag = false;
    db.stock_log.findOne({
      item: newData._id
    },(err,doc) => {
      doc.logs.forEach((log,index,logs) => {
        if(utils.dateCompare(log.date,newData.date) === 0){
          logEntryFoundFlag = true;
          if(newData.type === 'INCREMENT'){
            logs[index].cs = newData.quantity + newData.openingStock
          }
          db.stock_log.update({
            _id: newData._id
          }, {
            $set: {
              logs: logs
            }
          })
        }
      })

    })

    if(!logEntryFoundFlag){
     db.stock_log.update({
       item: newData.id
     }, {
       $push: {
         logs: newData.data
       }
     })
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
