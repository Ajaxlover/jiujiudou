import {
  setToken,
  getToken,
  removeStuInfo,
  removeStuToken
} from "@/libs/cookieUtil";
import axios from "@/libs/api.request";

export default {
  state: {
    userName: "",
    userId: "",
    avatarImgPath: "",
    mobile: "",
    token: getToken(),
    hasGetInfo: false,
    roles: [],
    currentRole: {}
  },
  mutations: {
    setAvatar(state, avatarPath) {
      state.avatarImgPath = avatarPath;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
    setMobile(state, mobile) {
      state.mobile = mobile;
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
    setCurrentRole(state, role) {
      state.currentRole = role;
    }
  },
  actions: {
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          axios
            .request({
              method: "post",
              url: "/v1/user/info"
            })
            .then(function(data) {
              let ret = data.data;
              if (ret.code === 200) {
                let res = ret.data;
                commit("setAvatar", res.pic);
                commit("setUserName", res.username);
                commit("setUserId", res.uid);
                // commit('setMobile', res.mobile)
                commit("setRoles", res.roles);
                commit("setHasGetInfo", true);
                resolve(res);
              } else {
                reject(ret.msg);
              }
            });
        } catch (error) {
          reject(error);
        }
      });
    },
    setCurrentRoleById({ state, commit }, { mrId }) {
      return new Promise((resolve, reject) => {
        let exist = false;
        for (let i = 0; i < state.roles.length; i++) {
          let role = state.roles[i];
          if (`${role.mrId}` === mrId) {
            exist = true;
            commit("setCurrentRole", role);
            break;
          }
        }
        if (exist) {
          resolve();
        } else {
          reject(new Error("角色不存在"));
        }
      });
    },
    // 退出登录
    logout({ state, commit }) {
      commit("setToken", "");
      commit("setHasGetInfo", false);
      commit("setRoles", []);
      removeStuInfo();
      removeStuToken();
      localStorage.removeItem("currentRole");
      localStorage.removeItem("currentRoleName");
      localStorage.removeItem("selectedMenu");
    }
  }
};
