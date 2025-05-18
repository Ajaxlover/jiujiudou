/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import video from './modules/video'
import book from './modules/book.js'
import login from './modules/login.js'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    video,
    book,
    login,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          user: val.user,
          video: val.video,
          book: val.book,
        }
      },
    }),
  ],
})
