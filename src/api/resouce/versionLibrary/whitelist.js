import request from '@/utils/request'

// 命令白名单列表
export function getWhiteList(params) {
  return request({
    url: '/v1/repository/whitelist',
    method: 'get',
    params
  })
}

// 新建命令白名单
export function addWhite(params) {
  return request({
    url: '/v1/repository/whitelist',
    method: 'post',
    data: params
  })
}

// 更新命令白名单
export function putWhite(id, params) {
  return request({
    url: '/v1/repository/whitelist/' + id,
    method: 'put',
    data: params
  })
}

// 删除命令白名单
export function deleteWhite(ids) {
  return request({
    url: '/v1/repository/whitelist',
    method: 'delete',
    data: {
      ids: ids
    }
  })
}

// 白名单=》搜索 创建人 命令
export function searchWhite(params) {
  return request({
    url: '/v1/repository/whitelist/search',
    method: 'get',
    params
  })
}

