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

// 获取应用类型
export function getAppTypeList() {
  return request({
    url: '/v1/applications/types',
    method: 'get'
  })
}

// 获取应用语言
export function getAppLanguageList() {
  return request({
    url: '/v1/applications/languages',
    method: 'get'
  })
}

// 通过业务名称 获取组id
export function getAppRepository(name, type) {
  return request({
    url: '/v1/repositories/' + name + '/' + type,
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
export function deleteApp(params) {
  return request({
    url: '/v1/applications/',
    method: 'delete',
    params
  })
}

