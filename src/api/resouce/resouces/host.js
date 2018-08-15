import request from '@/utils/request'

// 主机组管理列表
export function getHostList() {
  return request({
    url: '/v1/groups/tree-groups',
    method: 'get'
  })
}

// 获取主机列表
export function getAppHostList(business) {
  return request({
    url: '/v1/hosts/ips/' + business,
    method: 'get'
  })
}
