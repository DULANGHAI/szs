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

/**
 * 获取用户姓名、ID
 */
export function getUserApi() {
  return request({
    url: '/v1/users/names',
    method: 'get'
  })
}
