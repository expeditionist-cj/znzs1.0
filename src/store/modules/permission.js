import { asyncRoutes, constantRoutes } from '@/router';
import Layout from '@/layout/index';
import {menu} from "@/global";
import store from '@/store';
import { MessageBox, Message } from 'element-ui'
const menuData = menu;
/**
 * 过滤掉
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes,str) {
  let data = [];
   data = routes.filter(route => {
    return route.flag == str
  });
  return data;
}

// 递归生成动态路由
const generaMenu = (routes,data) => {
  data.forEach(item => {
    var menu = {
      path: item.path,
      component: item.component == "layout"? Layout : () => import(`@/views/${item.component}`),
      name: item.mname ,
      children: []
    };
    if ( item.children && item.children.length ) {
     generaMenu(menu.children,item.children )
    }
    routes.push(menu);
  });
}

const state = {
  routes: [],
  addRoutes: []
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    // vue-router 动态生产路由
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  /**
   * 动态生产路由
   * @param {*} param0 
   * @param {*} roles 
   */
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = [];
      if(store.state.user.menu.length){
        generaMenu(accessedRoutes,store.state.user.menu);
      }else{
        Message({
          message: '该用户没有可用的功能菜单，请先配置菜单',
          type: 'error',
          duration: 5 * 1000
        });
        throw new Error();
      }
      accessedRoutes.push({ path: '*', redirect: '/404' })
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes)
    })

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}