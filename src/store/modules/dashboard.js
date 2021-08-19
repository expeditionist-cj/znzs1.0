import { selectUnitCode } from '@/api/dashboard'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    unitList: [],
    initalData: [],
    dictionary: [],
    showDrawer: false,
    which_to_show: 'Unit'
  }
}

const state = getDefaultState()

const mutations = {
  SET_UNITLIST: (state, data) => {
    state.unitList = data
  },
  SET_INITALDATA: (state, data) => {
    state.initalData = data
  },
  SET_DICTIONARY: (state, data) => {
    state.dictionary = data
  },
  SET_SHOWDRAWER: (state, data) => {
    state.showDrawer = data
  },
  SET_WHICHTOSHOW: (state, data) => {
    state.which_to_show = data
  }
}

const actions = {
  // 获取机组
  // user login
  getUnitList({ commit }, plantCode) {
    return new Promise((resolve, reject) => {
      selectUnitCode({ plant: plantCode }).then(response => {
        const { data } = response
        console.log(response, 9999)
        commit('SET_UNITLIST', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
