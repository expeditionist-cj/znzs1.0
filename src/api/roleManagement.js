import request from '@/utils/request'

// 查询所有角色(包含分页)
export function getRole(data) {
    return request({
        url: '/sys_role/page',
        method: 'get',
        params: data
    })
}
// 查询所有树
export function getAllRoleTree(data) {
    return request({
        url: '/sys_menu/tree',
        method: 'get',
        params: data
    })
}
// 查询某一个角色的树
export function getRoleTree(roleId) {
    return request({
        url: `sys_role/${roleId}`,
        method: 'get',
    })
}
// 查询角色数据权限，自定义下所有电厂
export function getRolePlants() {
    return request({
        url: '/sys_dept/plants',
        method: 'get',
    })
}
// 新增角色
export function addTree(data) {
    return request({
        url: '/sys_role/save',
        method: 'post',
        data
    })
}
// 编辑角色
export function updateTree(data) {
    return request({
        url: '/sys_role/update',
        method: 'post',
        data
    })
}
// 删除角色
export function deleteTree(id) {
    return request({
        url: `sys_role/${id}`,
        method: 'delete',
    })
} 
