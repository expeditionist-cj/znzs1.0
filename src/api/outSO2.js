import request from '@/utils/request'

// 查询页面初始化数据
export function getSO2(data) {
  return request({
    url: '/exportIntelligentForecast/ini',
    method: 'get',
    params: data
  })
}

// 查询初始化曲线数据
export function getSO2Diagram(data) {
  return request({
    url: '/exportIntelligentForecast/iniQu',
    method: 'get',
    params: data
  })
}