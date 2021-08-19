import request from '@/utils/request'

// 分页查询表格数据
export function getSubscribe(data) {
  return request({
    url: '/point/subscribe/page',
    method: 'post',
    data
  })
}
// 查询页面位置
export function getPlace(type) {
  return request({
    url: `/sys/dic/getDicByType/${type}`,
    method: 'get' 
  })
}
// 新增
export function addPoints(data) {
  return request({
    url: '/point/subscribe',
    method: 'post',
    data 
  })
}
// 修改
export function editPoints(data) {
  return request({
    url: '/point/subscribe',
    method: 'put',
    data 
  })
}
// 删除
export function delPoints(id) {
  return request({
    url: `/point/subscribe/${id}`,
    method: 'delete', 
  })
}
// 启停
export function sdtPoints(id,isUse) {
  return request({
    url: `/point/subscribe/${id}/${isUse}`,
    method: 'get', 
  })
}