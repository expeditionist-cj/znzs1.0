import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout';
import Develop from "@/views/developing"

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },



  // 刷新当前页面的方法
  {
    path: '/refresh',
    component: () => import('@/views/refresh/index'),
    hidden: true
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: '首页',
        component: () => import('@/views/dashboard/index'),
      },
      {
        path: 'developing',
        name: '开发中1',
        component: () => import('@/views/developing/index'),
      },

    ]
  },
  // 商城
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/dashboard',
    children: [
      {
        path: '/shop/dashboard',
        name: '开发中',
        component: () => import('@/views/developing/index'),
      },
    ]
  },
  // 个人账号
  {
    path: '/person',
    component: Layout,
    redirect:'/person/index',
    children: [
      {
        path: '/person/index',
        name: '个人账号',
        component: () => import('@/views/personalAccount/index'),
      },
    ]
  },

  // 404 page must be placed at the end !!!
  // 权限控制的路由模块是动态添加进去的，而我的404监听路由是在默认路由里面的，优先级比动态路由要高，所以刷新后默认先被404接管了
  // { path: '*', redirect: '/404' }
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
