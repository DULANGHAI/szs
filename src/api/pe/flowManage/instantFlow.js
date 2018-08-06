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
 *  获取流程列表
 * @param {Object} params
 */
export function getFlowListApi(params) {
  return request({
    url: '/v1/repository/system/language',
    method: 'get',
    params: params
  })
}
