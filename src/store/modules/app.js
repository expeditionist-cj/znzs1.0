import Cookies from 'js-cookie'

const state = {
  activeMenu: '首页',
  activeModel: '', // 激活的模型菜单
  globalData:{},
  activeSysSetting: '', // 激活的系统设置菜单
}

const mutations = {
  CHANGE_ACTIVEMENU: (state, data) => {
    state.activeMenu = data;
  },
  SET_ACTIVEMODEL: (state, data) => {
    state.activeModel = data;
  },
  SET_GLOBALDATA: (state, data) => {
    state.globalData = data;
  },
  SET_ACTIVESYSETTING: (state,data)=>{
    state.activeSysSetting = data;
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
