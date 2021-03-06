import Vue from 'vue';
import Datastore from "nedb";
let db = {};
db.stocks = new Datastore({ filename: "stocks", autoload: true });
db.stocks.loadDatabase();
Vue.mixin({
  methods: {
    // Source: http://stackoverflow.com/questions/497790
    convert(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp)
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0], d[1], d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year, d.month, d.date) :
        NaN
        );
    },
    compare(a, b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
        isFinite(a = this.convert(a).valueOf()) &&
        isFinite(b = this.convert(b).valueOf()) ?
        (a > b) - (a < b) :
        NaN
        );
    },
    rateListComparator(a, b) {
      a = a.date;
      b = b.date;
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
        isFinite(a = this.convert(a).valueOf()) &&
        isFinite(b = this.convert(b).valueOf()) ?
        (a > b) - (a < b) :
        NaN
        );
    },
    inRange(d, start, end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
      return (
        isFinite(d = this.convert(d).valueOf()) &&
        isFinite(start = this.convert(start).valueOf()) &&
        isFinite(end = this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
        );
    },
    getToday() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }

      today = yyyy + '-' + mm + '-' + dd;
      return today.toString();
    },
    changeStock(payload) {
      console.log("Called Changed stock");
      const stockData = {
        openingStock: '',
        closingStock: '',
        lastUpdated: ''
      }
      return new Promise((resolve,reject) => {
        console.log("Promise executing")
        db.stocks.findOne({
          _id: payload.id
        }, (err, doc) => {
          const lastUpdated = doc.lastUpdated ? doc.lastUpdated : ''
          const openingStock = doc.openingStock
          const closingStock = doc.closingStock ? doc.closingStock : openingStock

          if (lastUpdated === payload.date) {
            stockData.openingStock = openingStock // same date thus opening stock will not change
          } else {
            stockData.openingStock = closingStock // first entry on a particular
          }

          switch (payload.type) {
            case 'INCREMENT':
              stockData.closingStock = `${parseInt(closingStock) + payload.quantity}`
              break;
            case 'DECREMENT':
              if ((parseInt(closingStock) - payload.quantity) <= 0) {
                alert("Your Stock is to low", "Stock Manager")
                return reject()
              } else {
                stockData.closingStock = `${parseInt(closingStock) - payload.quantity}`
              }
              break;
          }
          stockData.lastUpdated = payload.date
          console.log("Stock Data", stockData)
          console.log("Find One Data ", doc)
          db.stocks.update({
            _id: payload.id
          }, {
            $set: stockData
          },{},err => {
            
            resolve()
          })
          console.log("Error ",err);
        })
      })
    }
  }
});
