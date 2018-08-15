import request from '@/utils/request'

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
 *  获取定时流程列表
 * @param {Object} params
 */
export function getTimedListApi(params) {
  return request({
    url: `/v1/timed-processes/`,
    method: 'get',
    params: params
  })
}

/**
 *  创建定时流程
 * @param {Object} params
 */
export function createTimedApi(data) {
  return request({
    url: `/v1/timed-processes/`,
    method: 'post',
    data: data
  })
}

/**
 *  删除定时流程
 * @param {Object} data
 */
export function deleteTimedApi(data) {
  return request({
    url: `/v1/timed-processes/`,
    method: 'delete',
    data: data
  })
}

/**
 *  执行定时流程
 * @param {Object} data
 */
export function doFlowApi(data) {
  return request({
    url: `/v1/timed-processes/execution`,
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
    url: '/v1/timed-processes/execution-records',
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
