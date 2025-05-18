export default {
  state: {
    courseWareRowItem: {},
    createVoteShow: false
  },
  mutations: {
    setCourseWareRowItem(state, data) {
      state.courseWareRowItem = data;
    },
    setCreateVoteShow(state, data) {
      state.createVoteShow = data;
    }
  },
  getters: {}
};
