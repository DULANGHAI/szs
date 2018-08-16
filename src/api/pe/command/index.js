import request from '@/utils/request'

/**
 * 创建一个即时命令
 * @param {Object} data
 */
export function createApi(data) {
  return request({
    url: '/v1/command/',
    method: 'post',
    data: data
  })
}

/**
 * 执行记录
 * @param {Object} params
 */
export function getListApi(params) {
  return request({
    url: '/v1/command/',
    method: 'get',
    params: params
  })
}

/**
 * 获取即时命令结果
 * @param {Object} data
 */
export function getResultApi(params) {
  return request({
    url: '/v1/jobs/job-record/log/',
    method: 'get',
    params: params
  })
}
