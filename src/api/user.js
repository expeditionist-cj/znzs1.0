import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 获取菜单
export function getMenu(roleId) {
  return request({
    url: '/sys_menu/tree/'+roleId,
    method: 'get',
  })
}

// 退出
export function logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data
  })
}



