import request from '@/utils/request'

/**
 * 获取列表
 * @param {Object} params
 */
export function getListApi(params) {
  return request({
    url: '/v1/tasks',
    method: 'get',
    params: params
  })
}

/**
 * 获取列表
 * @param {Object} params
 */
export function getCreatorApi() {
  return request({
    url: '/v1/tasks/task-creator',
    method: 'get'
  })
}
