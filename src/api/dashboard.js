import request from '@/utils/request'


// 查询安全运行天数
export function selectSafeRunDay(params) {
  return request({
    url: '/modelInstance/selectSafeRunDay',
    method: 'get',
    params
  })
}

// 根据电厂code查询机组
export function selectUnitCode(params) {
  return request({
    url: '/modelDataSource/selectUnitCode',
    method: 'get',
    params
  })
}

// 关键指标看板数据
export function selectImportantIndicator(params) {
  return request({
    url: '/plantIndependent/selectImportantIndicator',
    method: 'get',
    params
  })
}
// 关键指标看板数据
export function selectIndicators(params) {
  return request({
    url: '/rtIdxShow/getSglCnf',
    method: 'get',
    params
  })
}


//查询instanceId
export function selectInstanceId(params) {
  return request({
    url: '/modelInstance/selectByPage',
    method: 'get',
    params
  })
}
//查询首页排班信息
export function getSchedule(params) {
  return request({
    url: '/dutyRecord/hpShow',
    method: 'get',
    params
  })
}
//查询首页综合指标
export function getComprehensivePnc(params) {
  return request({
    url: '/home/comprehensivePnc',
    method: 'get',
    params
  })
}
//查询首页瞬时指标
export function getInstantPnc(params) {
  return request({
    url: '/home/instantPnc',
    method: 'get',
    params
  })
}
//查询首页循环泵电耗
export function getPowerConsumPnc(params) {
  return request({
    url: '/home/pumpPower',
    method: 'get',
    params
  })
}
//查询首页循环泵电耗
export function getMaterialPowerPnc(params) {
  return request({
    url: '/home/materialPower',
    method: 'get',
    params
  })
}