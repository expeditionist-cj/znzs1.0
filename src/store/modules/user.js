import {
  login,
  getMenu,
  logout
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getTicket
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '', // 用户中文名称
    plantCode: '', // 电厂code
    plantCn: "", // 电厂中文名称
    plants: [], // 电厂机构
    showPlants: true,
    menu: [], // 要显示的用户菜单
    uid: "",
    instanceIdList: [],
    roleId: "", // 角色id
    ticket: getTicket(),

  }
}
const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TICKET: (state, ticket) => {
    state.ticket = ticket;
  },
  SET_NAME: (state, data) => {
    state.name = data
  },
  // 设置功能菜单
  SET_MENU: (state, data) => {
    state.menu = data
  },
  SET_PLANTCODE: (state, data) => {
    state.plantCode = data
  },
  SET_PLANTCN: (state, data) => {
    state.plantCn = data
  },
  SET_UID: (state, data) => {
    state.uid = data
  },
  SET_INSTANCEIDLIST: (state, data) => {
    state.instanceIdList = data
  },
  SET_ROLEID: (state, data) => {
    state.roleId = data;
  },
  SET_PLANTS: (state, data) => {
    state.plants = data;
  },
  SET_SHOWPLANTS: (state, data) => {
    state.showPlants = data;
  },

}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      loginName,
      pwd
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        loginName: loginName.trim(),
        pwd: pwd
      }).then(response => {
        const {
          data
        } = response;
        commit('SET_TOKEN', data.token);
        commit('SET_NAME', data.userName);
        if (data.plants.length) {
          commit('SET_PLANTCODE', data.plants[0].deptCode);
          commit('SET_PLANTCN', data.plants[0].deptName);
        }
        commit('SET_UID', data.uid);
        commit('SET_ROLEID', data.roleId);
        commit('SET_PLANTS', data.plants);
        commit('SET_MENU', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户菜单
  getMenu({
    commit
  }, roleId) {
    return new Promise((resolve, reject) => {
      getMenu(roleId).then(response => {
        const {
          data
        } = response;
        console.log(data, '功能菜单')
        commit('SET_MENU', data || [])
        resolve(data || [])
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      logout(data).then(response => {
        let info = response;
        commit('SET_TOKEN', "");
        commit('SET_NAME', '');
        commit('SET_PLANTCODE', '');
        commit('SET_PLANTCN', '');
        commit('SET_INSTANCEIDLIST', '');
        commit('SET_UID', '');
        commit('SET_ROLEID', '');
        commit('SET_PLANTS', []);
        resolve(info)
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
