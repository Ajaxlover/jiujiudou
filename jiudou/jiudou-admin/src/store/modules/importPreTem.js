export default {
  state: {
    testList: [],
    subjects: []
  },
  mutations: {
    setTestList(state, testList) {
      state.testList = testList;
    },
    setSubjects(state, subjects) {
      state.subjects = subjects;
    }
  },
  getters: {}
};
