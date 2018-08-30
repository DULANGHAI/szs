import request from '@/utils/request'
/**
 * 创建系统消息项
 * @param {Object} params
 */
export function createsystemMessage(params) {
  return request({
    url: '/v1/messages/',
    method: 'post',
    data: params
  })
}
/**
 * 获取系统消息项
 * @param {Object} params
 */
export function getsystemMessage(params) {
  return request({
    url: '/v1/messages/',
    method: 'get',
    params: params
  })
}
/**
 * 确认消息
 */
export function confirmMessage(id, params) {
  return request({
    url: `/v1/messages/${id}`,
    method: 'put',
    params: params
  })
}
/**
 * 用户
 * @param {Object} params
 */
export function UserSearch(params) {
  return request({
    url: '/v1/audit/users',
    method: 'get',
    params: params
  })
}
/**
 * 资源管理
 * @param {Object} params
 */
export function Resources(params) {
  return request({
    url: '/v1/audit/resources',
    method: 'get',
    params: params
  })
}
/**
 * 获取所有审核项目
 * @param {Object} params
 */
export function getAudit(params) {
  return request({
    url: '/v1/audit/',
    method: 'get',
    params: params
  })
}
/**
 * 通过搜索键获取所有审核项目
 * @param {Object} params
 */
export function getAuditSearch(params) {
  return request({
    url: '/v1/audit/search',
    method: 'get',
    params: params
  })
}
/**
 * 用户登录
 * @param {Object} params
 */
export function Userlogin(params) {
  return request({
    url: '/v1/auth/login',
    method: 'post',
    data: params
  })
}
/**
 * 创建用户
 * @param {Object} params
 */
export function createUserApi(params) {
  return request({
    url: '/v1/users/',
    method: 'post',
    data: params
  })
}
/**
 * 编辑用户
 * @param {Object} params
 */
export function editUserApi(id, params) {
  return request({
    url: '/v1/users/' + id,
    method: 'put',
    data: params
  })
}
/**
 * 删除多个用户
 * @param {Object} params
 */
export function deleteUserApi(params) {
  return request({
    url: '/v1/users/',
    method: 'delete',
    data: params
  })
}

/**
 * 列出具有分页和查询的所有用户
 * @param {Object} params
 */
export function queryUserApi(params) {
  return request({
    url: '/v1/users/',
    method: 'get',
    params: params
  })
}

/**
 * 给定标识符的用户更新
 * @param {Object} params
 */
export function updateidUserApi(data, identifier) {
  return request({
    url: `/v1/users/${data.identifier}`,
    method: 'put',
    data: data
  })
}
/**
 * 删除用户
 * @param {Object} params
 */
export function delUsers(parasm) {
  return request({
    url: '/v1/users/',
    method: 'delete',
    data: parasm
  })
}
/**
 * 获取用户所属业务
 * @param {Object} params
 */
export function getBusinessesList() {
  return request({
    url: '/v1/sysconfigs/businesses/',
    method: 'get'
  })
}
/**
 * 删除给定标识符的用户
 * @param {Object} params
 */
export function deleteidUserApi(params, identifier) {
  return request({
    url: `/v1/users/${params.identifier}`,
    method: 'delete',
    params: params
  })
}
/**
 * 获取用户详情
 * @param {Object} params
 */
export function getUserInfo(id) {
  return request({
    url: `/v1/users/${id}`,
    method: 'get'
  })
}
/**
 * 状态搜索
 * @param {Object} params
 */
export function searchStatus(params) {
  return request({
    url: `/v1/audit/search`,
    method: 'get',
    params
  })
}
/**
 * 获取具有标识符的给定用户
 * @param {Object} params
 */
export function getidUserApi(params, identifier) {
  return request({
    url: `/v1/users/${params.identifier}`,
    method: 'get',
    params: params
  })
}

/**
 * 更新用户密码
 * @param {Object} params
 */
export function updatepassUserApi(id, params) {
  return request({
    url: `/v1/users/${id}/user-password`,
    method: 'post',
    data: params
  })
}

/**
 * 直接到密码编辑页面
 * @param {Object} params
 */
export function jumppassUserApi(params) {
  return request({
    url: '/v1/users/{user_id}/user-password',
    method: 'get',
    params: params
  })
}

/**
 * 向用户添加角色
 * @param {Object} params
 */
export function getAdduserApi(params, user_id) {
  return request({
    url: `/v1/users/${params.user_id}/user-role`,
    method: 'post',
    data: params
  })
}

/**
 * 删除用户的角色
 * @param {Object} params
 */
export function deleteAdduserApi(params, user_id) {
  return request({
    url: `/v1/users/${params.user_id}/user-role`,
    method: 'delete',
    params: params
  })
}

/**
 * 获取用户的所有角色
 * @param {Object} params
 */
export function getAlluserApi(params, user_id) {
  return request({
    url: `/v1/users/${params.user_id}/user-role`,
    method: 'get',
    params: params
  })
}
/**
 * 权限列表 - 分页
 * @param {Object} params
 */
export function getPermission(params) {
  return request({
    url: '/v1/permissions/pagination',
    method: 'get',
    params
  })
}
/**
 * 权限列表 - id的权限
 * @param {Object} params
 */
export function getPermissionList(params) {
  return request({
    url: '/v1/permissions/',
    method: 'get',
    params
  })
}
/**
 * 角色权限列表
 * @param {Object} params
 */
export function getRolePermission(id, params) {
  return request({
    url: '/v1/roles/role-permission/' + id,
    method: 'get',
    params
  })
}
/**
 * 角色列表
 * @param {Object} params
 */
export function getRoles(params) {
  return request({
    url: '/v1/roles/',
    method: 'get',
    params
  })
}
/**
 * 所有角色列表
 * @param {Object} params
 */
export function getRolesAll() {
  return request({
    url: '/v1/roles/no-pagination',
    method: 'get'
  })
}
/**
 * 创建角色
 * @param {Object} params
 */
export function createRoles(parasm) {
  return request({
    url: '/v1/roles/',
    method: 'post',
    data: parasm
  })
}
/**
 * 创建角色权限
 * @param {Object} params
 */
export function createRolePermission(id, parasm) {
  return request({
    url: '/v1/roles/role-permission/' + id,
    method: 'post',
    data: parasm
  })
}
/**
 * 删除角色权限
 * @param {Object} params
 */
export function delRolePermission(id, parasm) {
  return request({
    url: '/v1/roles/role-permission/' + id,
    method: 'delete',
    data: parasm
  })
}
/**
 * 更新角色
 * @param {Object} params
 */
export function putRoles(id, parasm) {
  return request({
    url: '/v1/roles/' + id,
    method: 'put',
    data: parasm
  })
}
/**
 * 删除角色
 * @param {Object} params
 */
export function deleteRoles(id) {
  return request({
    url: '/v1/roles/' + id,
    method: 'delete'
  })
}
/**
 * 创建列表roles
 * @param {Object} params
 */
export function createdrolesId(params) {
  return request({
    url: '/v1/roles/',
    method: 'post',
    data: params
  })
}
/**
 * 删除列表roles
 * @param {Object} params
 */
export function deleterolesId(params, identifier) {
  return request({
    url: `/v1/roles/${params.identifier}`,
    method: 'delete',
    params: params
  })
}

/**
 * 获取消息数
 * @param {Object} params
 */
export function getNum(params) {
  return request({
    url: '/v1/messages/user-count',
    method: 'get',
    params: params
  })
}
/**
 * 创建系统配置
 * @param {Object} params
 */
export function cpostsysconfigs(params) {
  return request({
    url: '/v1/sysconfigs/',
    method: 'post',
    data: params
  })
}

/**
 * 获取系统配置
 * @param {Object} params
 */
export function getsysconfigs(params) {
  return request({
    url: '/v1/sysconfigs/',
    method: 'get',
    params: params
  })
}

/**
 * 获取系统配置
 * @param {Object} params
 */
export function getpermissions() {
  return request({
    url: '/v1/permissions/',
    method: 'get'
  })
}

/**
 * 查看单个用户权限
 * @param {Object} params
 */
export function getonepermissions(params) {
  return request({
    url: `/v1/roles/role-permission/${params.role_id}`,
    method: 'get'
    // params: params
  })
}
/**
 * 查看单个用户权限
 * @param {Object} params
 */
export function getOnepermissions(params) {
  return request({
    url: `/v1/roles/role-permission/${params.role_id}`,
    method: 'post',
    data: params
  })
}

/**
 * 获取用户名字
 * @param {Object} params
 */
export function getusername() {
  return request({
    url: '/v1/users/names',
    method: 'get'
    // params: params
  })
}

/**
 * 获取启用停用接口
 * @param {Object} params
 */
export function openclose(params) {
  return request({
    url: `/v1/users/${params.identifier}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除用户
 * @param {Object} params
 */
export function deleteuser(params) {
  return request({
    url: `/v1/users/${params.identifier}`,
    method: 'delete',
    params: params
  })
}

/**
 * 删除角色
 * @param {Object} params
 */
export function deleterole(params) {
  return request({
    url: `/v1/roles/${params.identifier}`,
    method: 'delete',
    params: params
  })
}

/**
 * 获取所有角色信息
 * @param {Object} params
 */
export function getalluse() {
  return request({
    url: '/v1/roles/',
    method: 'get'
  })
}
