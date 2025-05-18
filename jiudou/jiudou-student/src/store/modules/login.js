/* eslint-disable */

export default {
  state: {
    isLoginShow: false,
    isRegisterShow: false,
  },
  mutations: {
    setLoginShow(state, isLoginShow) {
      state.isLoginShow = isLoginShow
    },
    setRegisterShow(state, isRegisterShow) {
      state.isRegisterShow = isRegisterShow
    },
  },
  actions: {},
}
