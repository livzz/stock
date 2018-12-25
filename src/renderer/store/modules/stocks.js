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

    payload.data.forEach(() => {

    })

    const logData = {
      os: '',
      cs: '',
      date: ''
    }

    if(payload.type === 'INCREMENT'){
      payload.amount = payload.data.openingStock + payload.quantity
      db.stocks.update({id:payload._id},{ $set: { openingStock: payload.amount}})
      db.stock_log.find({id:payload._id},(err,doc) => {
        if(doc.length === 0) {
          logData.os = payload.data.openingStock + payload.amount;
          logData.cs = payload.data.openingStock + payload.amount
          logData.date = payload.date
          db.stock_log.insert({
                item: payload._id, log: [payload.data]
              }, (err, newDoc) => {
            if(err) {
              alert("Error while inserting into Database!!", "Stock Manager");
            }
          })
        } else {
          dispatch('_persistChanges')
        }
      })
    }
  },
  /**
   * 
   * newData: {
   *    _id:    id of the store object
   *    amount:  the no. items changed (integer: -infinty to infinity) 
   *    type: "INCREMENT" or "DECREMENT"
   *    data: data that is to be inserted in the stock_log
   *    date: Date of Entry
   * }
   * 
   * 
   * **/
  _persistChanges({ dispatch },newData) {
    if (newData.type === 'INCREMENT') {
      db.stocks.update({
        id: newData._id
      }, {
        $set: {
          openingStock: newData.amount
        }
      })
      db.stock_log.find({
        id: newData._id
      }, (err, doc) => {
        if (doc.length === 0) {
          dispatch('_newStockItemLog')
        } else {
          dispatch('_incrementalStockItemLogChanges')
        }
      })
    }
  },
  _newStockItemLog({dispatch}, newData) {
    db.stock_log.insert({
      item: newData._id,
      logs: [newData.data]
    }, (err, newDoc) => {
      if (err) {
        alert("Error while inserting into Database!!", "Stock Manager");
      }
    })
  },

  /** 
   *  1: push into array on different date
   * 
   *  2: if entry already exits then update CS 
   * 
   * */
  _incrementalStockItemLogChanges({dispatch}, newData) {
    let itemFoundFlag = false;

    db.stock_log.findOne({
      item: newData._id
    },(err,doc) => {
      doc.logs.forEach((log,index,logs) => {
        if(utils.dateCompare(log.date,newData.date) === 0){
          itemFoundFlag = true;
          logs[index].cs = abs(newData.amount)
          db.stock_log.update({
            _id: newData._id
          }, {
            $set: {
              log: doc.log
            }
          })
        }
      })
     
    })

    if(!itemFoundFlag){
       db.stock_log.update({
         _id: newData._id
       }, {
         $push: {
           log: newData.data
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
