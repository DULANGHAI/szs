import request from '@/utils/request'

// 风险命令库列表
export function getRiskList(params) {
  return request({
    url: '/v1/repository/risk',
    method: 'get',
    params
  })
}

// 新建风险命令
export function addRisk(params) {
  return request({
    url: '/v1/repository/risk',
    method: 'post',
    data: params
  })
}

// 更新风险命令
export function putRisk(id, params) {
  return request({
    url: '/v1/repository/risk/' + id,
    method: 'put',
    data: params
  })
}

// 删除风险命令
export function deleteRisk(ids) {
  return request({
    url: '/v1/repository/risk',
    method: 'delete',
    data: {
      ids: ids
    }
  })
}

// 风险=》搜索 创建人 命令
export function searchRisk(params) {
  return request({
    url: '/v1/repository/risk/search',
    method: 'get',
    params
  })
}
