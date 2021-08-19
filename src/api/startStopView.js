import request from '@/utils/request';

// 分页查询
export function getStartStopData(data) {
  return request({
    url: '/unit_run_status/all',
    method: 'get',
    params: data
  })
}
// 分页查询
export function getStartStopRecord(data) {
  return request({
    url: '/unit_run_status/unit',
    method: 'get',
    params: data
  })
}