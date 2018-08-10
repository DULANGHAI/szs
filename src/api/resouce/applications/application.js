import request from '@/utils/request'

// 应用管理列表
export function getApplicationList(params) {
  return request({
    url: '/v1/applications/',
    method: 'get',
    params
  })
}

// 获取应用详情
export function getApplicationDetail(id) {
  return request({
    url: '/v1/applications/' + id,
    method: 'get'
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

// 编辑应用
export function putApplication(id, params) {
  return request({
    url: '/v1/applications/' + id,
    method: 'put',
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
      app_ids: ids
    }
  })
}

