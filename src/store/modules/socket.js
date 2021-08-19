import Vue from "vue";


const getDefaultState = () => {
  return {
    message: '',
  }
}

const state = getDefaultState()

const mutations = {
  'SET_MESSAGE': (state, data) => {
    state.message = data;
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

