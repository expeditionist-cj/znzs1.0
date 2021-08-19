import request from '@/utils/request'

// 校验测点值的有效性接口
export function validateSinglePoint(query) {
    return request({
        url: '/model_instance_point/validate_single_point',
        method: 'get',
        params: query
    })
}

// 校验多测点计算公式有效性
export function validateMtpPoints(data) {
    return request({
        url: '/model_instance_point/validate_mtp_points',
        method: 'post',
        data
    })
}


// 算法绑定第三步总体校验
export function validatePointParamCode(data) {
    return request({
        url: '/model_instance_point_const/validate_point_param_code',
        method: 'post',
        data
    })
}

// 算法绑定第三步总体新增
export function batchSave(data) {
    return request({
        url: '/model_instance_point/batch_save',
        method: 'post',
        data
    })
}

// 查看第三步计算点
export function queryByInstanceId(query) {
    return request({
        url: '/model_instance_point/queryByInstanceId',
        method: 'get',
        params: query
    })
}
// 算法绑定第三步总体更新
export function update(data) {
    return request({
        url: '/model_instance_point/update',
        method: 'post',
        data
    })
}

/**
 *能耗物耗配置页面
 */

// 标准点查询
export function getSdtPoints(params) {
    return request({
        url: '/csp/getSdtPoints',
        method: 'get',
        params
    })
}
// 查询能耗物耗所用的标准点
export function getSelSdtPoints(istId) {
    return request({
        url: '/csp/getIstSdtPoints',
        method: 'get',
        params: {
            istId
        }
    })
}
//公式|组列表新增
export function epsSave(data) {
    return request({
        url: '/csp/epsSave',
        method: 'post',
        data
    })
}
// 公式|组列表更新
export function epsMdf(data) {
    return request({
        url: '/csp/epsMdf',
        method: 'post',
        data
    })
}
// 按实例查询相关组和公式
export function getIstEps(istId) {
    return request({
        url: '/csp/getIstEps',
        method: 'get',
        params: {
            istId
        }
    })
}