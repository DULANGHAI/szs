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
 * 即使作业列表
 * @param {Object} params
 */
export function getInstantListApi(params) {
  return request({
    url: '/v1/jobs/instant/',
    method: 'get',
    params: params
  })
}
