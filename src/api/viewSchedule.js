import request from '@/utils/request'

// 查看排班表
export function getScheduleList(query) {
  return request({
    url: '/dutyRecord/ini',
    method: 'get',
    params: query
  })
}

// 导出排班表
export function exportScheduleList(query) {
  return request({
    url: '/dutyRecord/export',
    method: 'get',
    params: query
  })
}