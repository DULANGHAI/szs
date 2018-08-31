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

// 添加主机组
export function getAddGroups(params) {
  return request({
    url: '/v1/groups/',
    method: 'post',
    data: params
  })
}

// 编辑主机组获取信息
export function getEditGroups(id) {
  return request({
    url: '/v1/groups/' + id,
    method: 'get'
  })
}

// 获取主机信息
export function getHostView(id) {
  return request({
    url: '/v1/hosts/' + id,
    method: 'get'
  })
}

// 更新主机组
export function putGroups(id, params) {
  return request({
    url: '/v1/groups/' + id,
    method: 'put',
    data: params
  })
}

// 更新主机
export function putHosts(id, params) {
  return request({
    url: '/v1/hosts/' + id,
    method: 'put',
    data: params
  })
}

// 删除主机组
export function delGroups(id) {
  return request({
    url: '/v1/groups/' + id,
    method: 'delete'
  })
}

// cmdb
export function postCMDB() {
  return request({
    url: '/v1/hosts/cmdb',
    method: 'post'
  })
}

// Scheduler
export function postScheduler() {
  return request({
    url: '/v1/hosts/scheduler/',
    method: 'post'
  })
}

