import request from '@/utils/request'

// 主机组管理列表
export function getHostList() {
  return request({
    url: '/v1/groups/tree-groups',
    method: 'get'
  })
}
