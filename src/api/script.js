import request from '@/utils/request'

// 文件列表
export function getFileList(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id,
    method: 'get'
  })
}

// 版本历史
export function getVersionHistory(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/commit',
    method: 'get',
    params
  })
}

// 业务组
export function getRepository() {
  return request({
    url: '/v1/repository/',
    method: 'get'
  })
}

// 子组
export function getRepositoryZizu(id, type) {
  return request({
    url: '/v1/repository/' + id + '/' + type,
    method: 'get'
  })
}

// 语言
export function getRepositoryYuyan(params) {
  return request({
    url: '/v1/repository/project',
    method: 'get',
    params
  })
}
// 添加语言(项目)
export function postRepositoryYuyan(project_name, group_id) {
  return request({
    url: '/v1/repository/project',
    method: 'post',
    data: {
      project_name,
      group_id
    }
  })
}
// 删除语言(项目)
export function deleteRepositoryYuyan(project_id) {
  return request({
    url: '/v1/repository/project/' + project_id,
    method: 'delete'
  })
}

// 创建文件
export function postAppFile(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/file',
    method: 'post',
    data: params
  })
}

// 修改文件
export function putAppFile(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/file',
    method: 'put',
    data: params
  })
}

