import request from '@/utils/request'

/**
 * 获取系统和语言
 * @param {Object} params
 */
export function getLanguageApi() {
  return request({
    url: '/v1/repository/system/language',
    method: 'get'
  })
}

/**
 * 作业列表
 * @param {Object} params
 */
export function getJobListApi(params) {
  return request({
    url: '/v1/jobs/',
    method: 'get',
    params: params
  })
}

/**
 * 创建一个流程
 * @param {Object} data
 */
export function createFlowApi(data) {
  return request({
    url: '/v1/processes/',
    method: 'post',
    data: data
  })
}

/**
 * 获取一个流程所有信息
 * @param {Object} data
 */
export function getFlowApi(id) {
  return request({
    url: `/v1/processes/${id}`,
    method: 'get'
  })
}

/**
 * 更新一个流程
 * @param {Object} data
 */
export function updateFlowApi(id, data) {
  return request({
    url: `/v1/processes/${id}`,
    method: 'put',
    data: data
  })
}

/**
 * 流程列表
 * @param {Object} params
 */
export function getFlowListApi(params) {
  return request({
    url: `/v1/processes/`,
    method: 'get',
    params: params
  })
}

/**
 * 启用/禁用 流程
 * @param {Object} data
 */
export function changeFlowStatusApi(data) {
  return request({
    url: '/v1/processes/',
    method: 'put',
    data: data
  })
}

/**
 * 删除 流程
 * @param {Object} data
 */
export function deleteFlowApi(data) {
  return request({
    url: '/v1/processes/',
    method: 'delete',
    data: data
  })
}
