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
 * 删除多个用户
 * @param {Object} params
 */
export function deleteUserApi(params) {
  return request({
    url: '/v1/users/',
    method: 'delete',
    data: data
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
export function updatepassUserApi(params, user_id) {
  return request({
    url: `/v1/users/${params.user_id}/user-password`,
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
 * 获取列表roles
 * @param {Object} params
 */
export function getrolesId(params) {
  return request({
    url: '/v1/roles/',
    method: 'get',
    params: params
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
