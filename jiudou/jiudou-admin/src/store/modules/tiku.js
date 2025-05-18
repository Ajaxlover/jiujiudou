export default {
  state: {
    tikuPage: 0,
    currentTiku: null
  },
  mutations: {
    setTikuPage(state, data) {
      state.tikuPage = data;
    },
    setCurrentTiku(state, data) {
      state.currentTiku = data;
    }
  },
  getters: {}
};
