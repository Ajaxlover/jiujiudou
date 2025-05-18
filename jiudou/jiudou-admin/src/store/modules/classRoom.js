export default {
  state: {
    currentClass: {},
    currentTimu: {},
    unCheckList: [],
    newAddExerciseId: "", // 新创建的exciseId
    classTabName: "zero",
    checkTaskTab: "first",
    homeList: [], // 班级页发布作业功能选中的作业题目,
    libHomeList: [] // 作业库发布作业功能选中的作业题目
  },
  mutations: {
    setCurrentClass(state, data) {
      state.currentClass = data;
    },
    setCurrentTimu(state, data) {
      state.currentTimu = data;
    },
    setUnCheckList(state, data) {
      state.unCheckList = data;
    },
    setNewAddExerciseId(state, data) {
      state.newAddExerciseId = data;
    },
    setClassTabName(state, data) {
      state.classTabName = data;
    },
    setCheckTaskTabName(state, data) {
      state.checkTaskTab = data;
    },
    setHomeList(state, data) {
      state.homeList = data;
    },
    pushHomeList(state, data) {
      let arr = state.homeList;
      state.homeList = [...arr, ...data];
    },
    setLibHomeList(state, data) {
      state.libHomeList = data;
    },
    pushLibHomeList(state, data) {
      let arr = state.libHomeList;
      state.libHomeList = [...arr, ...data];
    }
  },
  getters: {}
};
