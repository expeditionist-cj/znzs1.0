import request from '@/utils/request'

// 查询页面初始化数据 - old
// export function getExcelReader(data) {
//   return request({
//     url: '/catalystLife/ExcelReader',
//     method: 'get',
//     params: data
//   })
// }
// 查询页面table的侧数和层数
export function getBaseInfo(data) {
  return request({
    url: '/ctlst_report/getReactorCtlstBaseInfo',
    method: 'get',
    params: data
  })
}
// 查询页面table的数据
export function getTableData(data) {
  return request({
    url: '/ctlst_report/getCtlstReport',
    method: 'get',
    params: data
  })
}
//初始化推送建议及模型输出参数
export function getSuggestData(data) {
  return request({
    url: '/catalyst_life_mode/pageInitialData',
    method: 'get',
    params: data
  })
}
//初始化页面曲线数据
export function getDiagramData(data) {
  return request({
    url: '/catalyst_life_mode/curveData',
    method: 'get',
    params: data
  })
}
// 导出excel
export const excel = (url,query)=>{
  return request({
    url,
    method: 'get',
    params: query,
    responseType: 'arraybuffer'
  })
}
