import Vue from 'vue'
import Vuex from 'vuex'
import Database from '../assets/lib/Database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    db: new Database(),
  },
  mutations: {},
  actions: {
    OPEN_DB({ state }) {
      return state.db.openDB()
    },
  },
  modules: {},
})
