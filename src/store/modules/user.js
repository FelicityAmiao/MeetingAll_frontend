import { postUser } from '../../api/user.js'

const state = {
  exampleState: '0'
}
const getters = {
  exampleGetter: state => state.exampleState
}
const mutations = {
  setExampleState: (state, exampleState) => {
    state.exampleState = exampleState
  }
}
const actions = {
  async postUser ({ commit }, postObject) {
    const response = await postUser(postObject)
    commit('setExampleState', response.data.bc)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
