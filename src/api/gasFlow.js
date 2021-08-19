import request from '@/utils/request'

// 查询页面初始化数据
export function getGasFlow(data) {
  return request({
    url: '/gasFlow/ini',
    method: 'get',
    params: data
  })
}

// 查询初始化曲线数据
export function getGasDiagram(data) {
  return request({
    url: '/gasFlow/iniQu',
    method: 'get',
    params: data
  })
}