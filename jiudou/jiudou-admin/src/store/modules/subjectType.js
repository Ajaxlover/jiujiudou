import axios from "@/libs/api.request";

export default {
  state: {
    subjectType: []
  },
  mutations: {
    setList(state, list) {
      state.subjectType = list;
    }
  },
  actions: {
    // 获取学科分类列表
    getSubjectList({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          axios
            .request({
              method: "post",
              url: "/subject/subject/listAll"
            })
            .then(function(data) {
              let ret = data.data;
              if (ret.code === 200) {
                commit("setList", ret.data);
                resolve(ret.data);
              } else {
                reject(ret.msg);
              }
            });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
