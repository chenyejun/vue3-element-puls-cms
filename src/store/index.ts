import { createStore } from "vuex"
import createPersistedState from "vuex-persistedstate"
export default createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  },
  modules: {},
  plugins: [createPersistedState({ storage: window.sessionStorage })]
});
