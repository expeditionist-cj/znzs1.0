import request from '@/utils/request';

// 分页查询
export function getUserData(params) {
  return request({
    url: '/sysUser/getUserData',
    method: 'get',
    params
  })
}
// 批量删除
export function batchDelete(data) {
  return request({
    url: '/sysUser/batchDelete',
    method: 'post',
    data
  })
}
// 批量重置
export function batchReset(data) {
  return request({
    url: '/sysUser/batchReset',
    method: 'post',
    data
  })
}
// 停用
export function batchStop(data) {
  return request({
    url: '/sysUser/batchStop',
    method: 'post',
    data
  })
}
// 启用
export function batchStart(data) {
  return request({
    url: '/sysUser/batchStart',
    method: 'post',
    data
  })
}
// 导入excel
export const importUser = (query) => {
  return request({
      url: '/sysUser/importUser',
      method: 'post',
      // headers: { 'Content-Type': 'multipart/form-data' },
      data: query
  })
}

// 查询组织机构数
export const getTree = (query) => {
  return request({
      // url: '/sys_dept/tree',
      url:"/sys_dept/projects",
      method: 'get',
      // headers: { 'Content-Type': 'multipart/form-data' },
      query
  })
}

// 查询所属部门
export const getProject = (params) => {
  return request({
      url: '/sys_dept/children',
      method: 'get',
      // headers: { 'Content-Type': 'multipart/form-data' },
      params
  })
}

// 查询角色
export const getRole = (params) => {
  return request({
      url: '/sys_role/list',
      method: 'get',
      // headers: { 'Content-Type': 'multipart/form-data' },
      params
  })
}

// 上传图片
export function uploadImg(data) {
  return request({
    url: '/file/uploadFile',
    method: 'post',
    data
  })
}

// 用户新增
export function insertUser(data) {
  return request({
    url: '/sysUser/insertUser',
    method: 'post',
    data
  })
}

// 用户更新
export function updateUser(data) {
  return request({
    url: '/sysUser/updateUser',
    method: 'post',
    data
  })
}

// 修改密码
export function updateUserPass(data) {
  return request({
    url: '/sysUser/updateUserPass',
    method: 'post',
    data
  })
}
