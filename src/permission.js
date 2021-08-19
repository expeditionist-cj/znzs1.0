import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { cas } from "@/version";
import {getQueryString} from "@/utils/commonUtil";
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist，不需要token验证的




router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.name)
  const hasToken = getToken();
  if (cas) {
    // cas 服务器单点登录,获取url后面的token
    let ticket = getQueryString(token);

    await store.commit("user/SET_TICKET", ticket); // vuex存储ticket，保证刷新浏览器的时候ticket存在

    // determine whether the user has logged in
    
    if (!ticket) {
      window.location.href = "http://baidu.com"; // 跳到cas 服务器登录页面
    } else {
      // 调用本系统登录接口，并且缓存token
    }
  }

  // 有token情况（token没有过期）
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 第一次登陆进来没有角色菜单
      if (store.state.user.menu.length) {
        // 在模型页面切换三级路由时，缓存model页面
        if (from.path.split("/")[1] == 'model' && to.path.split("/")[1] == 'model') {
          to.meta.keepAlive = true
        } else {
          to.meta.keepAlive = false
        }
        // 进模型页的时候缓存
        if (to.path.split("/")[1] == 'model') {
          to.meta.keepAlive = true
        } else {
          to.meta.keepAlive = false
        }
        // if is logged in, redirect to the home page
        next()
        NProgress.done()
      } else { // 没有角色菜单
        try {
          const data = await store.dispatch('user/getMenu', store.state.user.roleId);
          const accessRoutes = await store.dispatch('permission/generateRoutes');
          // dynamically add accessible routes
          router.addRoutes(accessRoutes);
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          store.commit('user/SET_TOKEN', ''); // 设置token为空，直接跳到登录页面
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
