import request from '@/utils/request'

/**
 * 获取列表
 * @param {Object} params
 */
export function getListApi(params) {
  return request({
    url: '/v1/tasks/review/',
    method: 'get',
    params: params
  })
}

/**
 * 获取创建者
 * @param {Object} params
 */
export function getCreatorApi() {
  return request({
    url: '/v1/tasks/task-creator/',
    method: 'get'
  })
}

/**
 * 获取审批者
 * @param {Object} params
 */
export function getApproverApi() {
  return request({
    url: '/v1/tasks/task-approver/',
    method: 'get'
  })
}

/**
 * 获取系统和语言
 * @param {Object} params
 */
export function getLanguageApi() {
  return request({
    url: '/v1/repositories/system',
    method: 'get'
  })
}

/**
 * 查询所有的脚本
 */
export function getAllScriptApi(params) {
  return request({
    url: '/v1/repositories/script',
    method: 'get',
    params: params
  })
}

/**
 * 根据任务ID获取数据
 * @param {Object} params
 */
export function getTaskDataApi(id) {
  return request({
    url: `/v1/tasks/review/${id}`,
    method: 'get'
  })
}

/**
 * 提交审批
 * @param {Object} params
 */
export function submitApproveApi(id, data) {
  return request({
    url: `/v1/tasks/review/${id}`,
    method: 'post',
    data: data
  })
}
