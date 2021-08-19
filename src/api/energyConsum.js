import request from '@/utils/request'

// 查询页面初始化数据
export function getEnergyConsum(data) {
  return request({
    url: '/powerConsumeMode/analyze',
    method: 'get',
    params: data
  })
}
// 查询instanceId
export function getInstanceId(data) {
  return request({
    url: '/modelInstance/selectInstance',
    method: 'get',
    params: data
  })
}