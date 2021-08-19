import request from '@/utils/request'

// 上传图片
export function uploadPhoto(data) {
  return request({
    url: '/file/uploadFile',
    method: 'post',
    data
  })
}

// 查询全部树形导航
export function getTree(data) {
  return request({
    url: '/sys_dept/tree',
    method: 'get',
    params: data
  })
}
// 添加
export function addTree(data) {
  return request({
    url: '/sys_dept',
    method: 'post',
    data
  })
}
// 删除
export function deleteTree(data) {
  return request({
    url: `/sys_dept/${data}`,
    method: 'delete',
    data
  })
}
// 修改
export function updateTree(data) {
  return request({
    url: '/sys_dept',
    method: 'put',
    data
  })
}