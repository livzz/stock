const state = {
  data :[]
};

const getters = {
  getPrintData() {
    console.log(state)
    return state.data;
  },
}
const mutations = {
  addPrintData: function(state , payload){
    
    state.data.push(payload);
    console.log(state)
  }
};
export default {
  state,
  getters,
  mutations,
};
