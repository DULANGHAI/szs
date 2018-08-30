import request from '@/utils/request'

/**
 * 获取作业执行数和成功率，作业top5
 */
export function getJobCardDataApi(params) {
  return request({
    url: '/v1/statistics/job-records',
    method: 'get',
    params: params
  })
}

/**
 * 获取流程执行数和成功率
 */
export function getFlowCardDataApi(params) {
  return request({
    url: '/v1/statistics/flow-records',
    method: 'get',
    params: params
  })
}

/**
 * 获取作业量统计chart data
 */
export function getJobChartDataApi(params) {
  return request({
    url: '/v1/statistics/job-numbers',
    method: 'get',
    params: params
  })
}

/**
 * 获取流程执行统计chart data
 */
export function getFlowChartDataApi(params) {
  return request({
    url: '/v1/statistics/flow-numbers',
    method: 'get',
    params: params
  })
}

/**
 * 获取异常主机chart data
 */
export function getHostChartDataApi(params) {
  return request({
    url: '/v1/statistics/hosts-top',
    method: 'get',
    params: params
  })
}
