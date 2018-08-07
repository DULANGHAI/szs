import request from '@/utils/request'

// 应用管理列表
export function getApplicationList(params) {
  return request({
    url: '/v1/applications',
    method: 'get',
    params
  })
}

