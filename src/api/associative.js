import request from '@/utils/associateRequest'

// 查询页面初始化数据
export function getAssociate(data) {
  return request({
    url: '/basicinfo/queryModelRecentCall',
    method: 'get',
    params: data
  })
}

// 查询初始化曲线数据
export function getAssociateDiagram(data) {
  return request({
    url: '/basicinfo/queryCurveData',
    method: 'get',
    params: data
  })
}