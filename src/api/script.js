import request from '@/utils/request'

// 文件列表
export function getFileList(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id,
    method: 'get',
    params
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

// 查看文件
export function getAppFile(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/file',
    method: 'get',
    params
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

// 删除文件
export function deleteAppFile(project_id, ids) {
  return request({
    url: '/v1/repository/project/' + project_id + '/file',
    method: 'delete',
    data: {
      ids: ids
    }
  })
}

// 下载文件
export function DownAppFile(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/files/download',
    method: 'get',
    params
  })
}

// 上传文件action
export function uploadFileAction(project_id) {
  return request({
    url: '/v1/repository/project/' + project_id + '/files/upload',
    method: 'post'
  })
}

// 提交上传
export function uploadAppFile(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/files',
    method: 'post',
    data: params
  })
}

// 获取版本列表
export function getBranchList(project_id) {
  return request({
    url: '/v1/repository/project/' + project_id + '/branches',
    method: 'get'
  })
}

// 新建版本
export function postBranch(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id + '/branches',
    method: 'post',
    data: params
  })
}
