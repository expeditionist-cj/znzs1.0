import request from '@/utils/request'

// 查询所有电厂
export const getAllPlants = (query) => {
  return request({
    // url: '/sys_dept/tree',
    url: "/sys_dept/plants",
    method: 'get',
    // headers: { 'Content-Type': 'multipart/form-data' },
    query
  })
}
// 查询机组信息
export function selectUnitCode(params) {
  return request({
    url: '/modelDataSource/selectUnitCode',
    method: 'get',
    params
  })
}
// 分页查询催化剂信息操作历史记录
export function getCtlstByPage(params) {
  return request({
    url: '/ctlst_report/getCtlstByPage',
    method: 'get',
    params
  })
}
// 根据id查询
export function getCtlstParamById(params) {
  return request({
    url: '/ctlst_report/getCtlstParamById',
    method: 'get',
    params
  })
}
// 根据反应器查询 -- 新增操作时需要
export function getCtlstParam(params) {
  return request({
    url: '/ctlst_report/getCtlstParam',
    method: 'get',
    params
  })
}
// 新增催化剂记录
export function addCtlstParam(data) {
  return request({
    url: '/ctlst_report/addCtlstParam',
    method: 'post',
    data: data
  })
}
// 修改催化剂记录
export function mdfCtlstParam(data) {
  return request({
    url: '/ctlst_report/mdfCtlstParam',
    method: 'post',
    data: data
  })
}
