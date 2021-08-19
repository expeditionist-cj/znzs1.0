import request from '@/utils/request'

// 查询供浆循环建议
export function getPulpData(data) {
  return request({
    url: '/pumpOptimization/getPumpOptimizationConsum',
    method: 'get',
    params: data
  })
}
// 查询供浆循环曲线图数据
export function getDiagram(data) {
  return request({
    url: '/pumpOptimization/getPumpOptimizationConsumQu',
    method: 'get',
    params: data
  })
}
// 查询字典
export function getDict() {
  return request({
    url: '/plantIndependent/selectDictionaryCn',
    method: 'get'
  })
}
// 查询循环泵字典
export function getPumpDict(params) {
  return request({
    url: '/plantIndependent/selectDictionaryCn',
    method: 'get',
    params
  })
}
// 查询参数设置-是否挂起
export function getSettings(data) {
  return request({
    url: '/model_instance_point/changeable_params',
    method: 'get',
    params: data
  })
}
// 查询建议及时间
export function getPumpModelInitData(data) {
  return request({
    url: '/pumpOptimization/getPumpModelInitData',
    method: 'get',
    params: data
  })
}
// 保存手填的浆液循环泵挂起状态
export function postSettings(data) {
  return request({
    url: '/model_instance_point/changeable_params/update',
    method: 'post',
    data: data
  })
}
