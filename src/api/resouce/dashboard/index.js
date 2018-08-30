import request from '@/utils/request'

/**
 * 获取主机数
 */
export function getHostsDataApi(params) {
  return request({
    url: '/v1/statistics/hosts',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用实例数
 * @param {*} params
 */
export function getApplicationDataApi(params) {
  return request({
    url: '/v1/statistics/applications',
    method: 'get',
    params: params
  })
}

/**
 * 获取版本库card数据
 * @param {*} params
 */
export function getRepositoriesDataApi(params) {
  return request({
    url: '/v1/statistics/repositories',
    method: 'get',
    params: params
  })
}

/**
 * 获取黑白名单 card数据
 * @param {*} params
 */
export function getWhiteBlackDataApi(params) {
  return request({
    url: '/v1/statistics/risk_commands',
    method: 'get',
    params: params
  })
}

/**
 * 获取文件提交统计
 * @param {*} params
 */
export function getFileChartDataApi(params) {
  return request({
    url: '/v1/statistics/file-commits',
    method: 'get',
    params: params
  })
}

/**
 * 获取主机作业执行次数 chart data
 * @param {*} params
 */
export function getJobChartDataApi(params) {
  return request({
    url: '/v1/statistics/jobs-top',
    method: 'get',
    params: params
  })
}

/**
 * 获取作业队列监控的数据
 */
export function getWorkersDataApi() {
  return request({
    url: '/v1/workers/statistic',
    method: 'get'
  })
}

/**
 * 获取执行节点监控的数据
 */
export function getHealthDataApi() {
  return request({
    url: '/v1/workers/health',
    method: 'get'
  })
}
