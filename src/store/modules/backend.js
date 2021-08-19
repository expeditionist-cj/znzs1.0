/**
 * 参数设置 vuex
 */
const state = {
  which_to_show: 'InstanceList',
  isChangeInstance: false, // 是否是修改状态
  addInstanceId: "", // 新增的模型实例id
  modelCode: "", // 新增的模型code
  addFirst: false, // 第一步是否已经新增
  addSecend: false, // 第二步是否已经新增
  addThird: false, // 第三步是否已经新增
  plantCode: undefined, // 电厂code
  unitCode: undefined, // 机组code
  add_eng_sub_consume: false, // 智能分析
  plantName: '',
  modelName: '',
  enable: '',
}

// vue 中通过this.$store.commit('dashboard/CHANGE_SHOW', 'FirstStep') 调用
const mutations = {
  CHANGE_SHOW: (state, componentName) => {
    state.which_to_show = componentName;
  },
  CHANGE_ISCHANGEINSTANCE: (state, boolean) => {
    state.isChangeInstance = boolean;
  },
  CHANGE_ADDINSTANCEID: (state, instanceId) => {
    state.addInstanceId = instanceId;
  },
  CHANGE_MODELCODE: (state, data) => {
    state.modelCode = data;
  },
  CHANGE_ADDFIRST: (state, data) => {
    state.addFirst = data;
  },
  CHANGE_ADDSECEND: (state, data) => {
    state.addSecend = data;
  },
  CHANGE_ADDTHIRD: (state, data) => {
    state.addThird = data;
  },
  CHANGE_PLANTCODE: (state, data) => {
    state.plantCode = data;
  },
  CHNAGE_UNITCODE: (state, data) => {
    state.unitCode = data;
  },
  CHANGE_ADD_ENG_SUB_CONSUME: (state, data) => {
    state.add_eng_sub_consume = data;
  },
  CHANGE_PLANTNAME: (state,data) => {
    state.plantName = data;
  },
  CHANGE_MODELNAME: (state,data) => {
    state.modelName = data;
  },
  CHANGE_ENABLE: (state,data) => {
    state.enable = data;
  },
}

// 异步mutations
// vue 中通过this.$store.dispatch('dashboard/CHANGE_SHOW', 'FirstStep') 调用
const actions = {
  // changeSetting({ commit }, data) {
  //   commit('CHANGE_SETTING', data)
  // }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
