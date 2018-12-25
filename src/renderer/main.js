/* eslint-disable no-unused-vars */
import Vue from "vue";
import axios from "axios";
import Promise from "bluebird";

import App from "./App";
import router from "./router";
import store from "./store";

import "bulma/css/bulma.css";
import "../../semantic/dist/semantic.min.css";
import "../../static/bulma-divider.css";
import Datastore from "nedb";

import AutoComplete from "v-autocomplete";
import "v-autocomplete/dist/v-autocomplete.css";
import "vue2-autocomplete-js/dist/style/vue2-autocomplete.css";
import "./utility/filters";
import "./assets/css/animate.css";
import "./utility/mixin";

// importing unitsStore for GST Units

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.db = Vue.prototype.$db = Datastore;
Vue.promisify = Vue.prototype.$promisify = Promise;
Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");

Vue.use(AutoComplete);

export const eventBus = new Vue();
