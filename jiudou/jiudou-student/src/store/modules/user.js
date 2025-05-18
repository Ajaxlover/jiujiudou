/* eslint-disable */
import {
  setStuToken,
  getStuToken,
  removeStuInfo,
  removeStuToken,
  setToken,
} from "@/libs/cookieUtil"
import axios from "@/libs/api.request"

export default {
  state: {
    userName: "",
    userId: "",
    avatarImgPath: "",
    mobile: "",
    token: getStuToken(),
    hasGetInfo: false,
    roles: [],
    currentRole: {},
    keywords: "",
    classId: "",
  },
  mutations: {
    setClassId(state, classId) {
      state.classId = classId
    },
    setKeywords(state, keywords) {
      state.keywords = keywords
    },
    setAvatar(state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setRoles(state, roles) {
      state.roles = roles
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setStuToken(state, token) {
      state.token = token
      setStuToken(token)
    },
    setMobile(state, mobile) {
      state.mobile = mobile
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setCurrentRole(state, role) {
      state.currentRole = role
    },
  },
  actions: {
    // 获取用户相关信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          axios
            .request({
              method: "post",
              url: "https://api.guangyiedu.com/liubingnan/v1/user/info",
            })
            .then(function (data) {
              let ret = data.data
              if (ret.code === 200) {
                let res = ret.data
                commit("setAvatar", res.pic)
                commit("setUserName", res.username)
                commit("setUserId", res.uid)
                commit("setHasGetInfo", true)
                resolve(res)
              } else {
                reject(ret.msg)
              }
            })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 退出登录
    logout({ commit }) {
      commit("setToken", "")
      commit("setStuToken", "")
      commit("setHasGetInfo", false)
      commit("setAvatar", "")
      commit("setUserName", "")
      commit("setUserId", "")
      removeStuInfo()
      removeStuToken()
      window.location.reload()
    },
  },
}
