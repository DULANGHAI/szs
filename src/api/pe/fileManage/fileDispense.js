import request from '@/utils/request'

/**
 * 根据路径获取内容
 * @param {Object} params
 */
export function getFileListApi(params) {
  return request({
    url: '/v1/bucket',
    method: 'get',
    params: params
  })
}
