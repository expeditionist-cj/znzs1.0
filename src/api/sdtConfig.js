import request from '@/utils/request';

// 分页查询
export function getSdtData(data) {
  return request({
    url: '/point/sdt/page',
    method: 'post',
    data
  })
}
// 新增测点
export function addSdt(data) {
  return request({
    url: '/point/sdt',
    method: 'post',
    data
  })
}
// 修改测点
export function mdfSdt(data) {
  return request({
    url: '/point/sdt',
    method: 'put',
    data
  })
}
// 删除测点
export function delSdt(id) {
  return request({
    url: `/point/sdt/${id}`,
    method: 'delete', 
  })
}
// 上传
export function uploadSdt(data) {
  return request({
    url: '/point/sdt/import',
    method: 'post', 
    data
  })
}
 