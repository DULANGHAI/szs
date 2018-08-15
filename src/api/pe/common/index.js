import request from '@/utils/request'

/**
 * 获取目标IP
 */
export function getIpApi() {
  return request({
    url: '/v1/groups/tree-ips',
    method: 'get'
  })
}
