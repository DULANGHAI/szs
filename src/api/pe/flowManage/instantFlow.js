import request from '@/utils/request'

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
 *  获取流程列表
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
 *  获取即时流程列表
 * @param {Object} params
 */
export function getInstantListApi(params) {
  return request({
    url: `/v1/instant-processes/`,
    method: 'get',
    params: params
  })
}

/**
 *  创建即时流程
 * @param {Object} params
 */
export function createInstantApi(data) {
  return request({
    url: `/v1/instant-processes/`,
    method: 'post',
    data: data
  })
}

/**
 *  删除即时流程
 * @param {Object} data
 */
export function deleteInstantApi(data) {
  return request({
    url: `/v1/instant-processes/`,
    method: 'delete',
    data: data
  })
}

/**
 *  执行即时流程
 * @param {Object} data
 */
export function doFlowApi(data) {
  return request({
    url: `/v1/instant-processes/execution`,
    method: 'post',
    data: data
  })
}

/**
 * 执行记录的列表
 * @param {*} params
 */
export function getRecordListApi(params) {
  return request({
    url: '/v1/instant-processes/execution-records',
    method: 'get',
    params: params
  })
}

/**
 * 执行定时流程-记录中
 * @param {Object} data
 */
export function startFlowApi(data) {
  return request({
    url: '',
    method: 'post',
    data: data
  })
}

/**
 * 停止定时流程-记录中
 * @param {Object} data
 */
export function stopFlowApi(data) {
  return request({
    url: '',
    method: 'post',
    data: data
  })
}
