import request from '@/utils/request'

/**
 * 执行记录
 * @param {Object} params
 */
export function getExecutionListApi(params) {
  return request({
    url: '/v1/daily/execution-record/',
    method: 'get',
    params: params
  })
}

/**
 * 作业记录
 * @param {Object} params
 */
export function getJobListApi(params) {
  return request({
    url: '/v1/daily/job-record/',
    method: 'get',
    params: params
  })
}
