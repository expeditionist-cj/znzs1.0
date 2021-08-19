import request from '@/utils/request'

// 值班人员初始化查询全部人员
export function getAllPeopleList(data) {
  return request({
    url: '/dutyOfficer/iniMenber',
    method: 'get',
    params: data
  })
}

// 值班人员初始化查询已排好班的人员
export function getReadyPeopleList(data) {
  return request({
    url: '/dutyOfficer/ini',
    method: 'get',
    params: data
  })
}
//保存人员配置
export function savePeopleList(data) {
    return request({
      url: '/dutyOfficer/batchInsert',
      method: 'post',
      data: data
    })
}
//生成排班
export function saveSchedule(data) {
    return request({
      url: '/hd_duty_generate/save',
      method: 'post',
      data: data
    })
}
// 初始化页面相关排班信息
export function getBaseData(data) {
    return request({
      url: `/hd_duty_generate/view/${data}`,
      method: 'get', 
    })
  }