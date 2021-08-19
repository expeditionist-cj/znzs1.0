import request from '@/utils/request'

// 查询电耗分析基本数据
export function getPowerConsum(data) {
  return request({
    url: '/devicePowerConsum/getPushDevicePowerConsum',
    method: 'get',
    params: data
  })
}
// 查询电耗分析曲线图数据
export function getDiagram(data) {
  return request({
    url: '/devicePowerConsum/getPushDevicePowerConsumIni',
    method: 'get',
    params: data
  })
}
