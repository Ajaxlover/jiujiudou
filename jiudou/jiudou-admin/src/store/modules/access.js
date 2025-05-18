export default {
  state: {
    fullMenu: [],
    button: new Map(),
    currentPath: ""
  },
  mutations: {
    setFullMenu(state, fullMenu) {
      state.fullMenu = fullMenu
    },
    setButton(state, button) {
      state.button = button
    },
    setCurrentPath(state, currentPath) {
      state.currentPath = currentPath
    }
  },
  getters: {
    hasButton: (state, code) => (code) => {
      let isExist = false
      if (state.button.has(state.currentPath)) {
        let codes = state.button.get(state.currentPath)
        isExist = codes.has(code)
        // let codes = state.button.get(state.currentPath)
        // for(let i = 0; i < codes.length; i++) {
        //   if (code === codes[i].perCode) {
        //     isExist = true
        //     break;
        //   }
        // }
      }
      return isExist
    }
  }
}
