import request from '@/utils/request'

// 应用管理列表
export function getApplicationList(params) {
  return request({
    url: '/v1/applications/',
    method: 'get',
    params
  })
}

// 添加应用
export function addApplication(params) {
  return request({
    url: '/v1/applications/',
    method: 'post',
    data: params
  })
}

// 模糊匹配
export function getApplicationSearch(params) {
  return request({
    url: '/v1/applications/search',
    method: 'get',
    params
  })
}

// 删除应用
export function deleteApp(ids) {
  return request({
    url: '/v1/repositories/risk',
    method: 'delete',
    data: {
      ids: ids
    }
  })
}

