import request from '@/utils/request'

/**
 * 根据路径获取内容
 * @param {Object} params
 */
export function getFileListApi(params) {
  return request({
    url: '/v1/buckets/',
    method: 'get',
    params: params
  })
}

/**
 * 创建目录（文件夹）
 * @param {*} id
 * @param {*} data
 */
export function createFolderApi(id, data) {
  return request({
    url: `/v1/repositories/project/${id}/file`,
    method: 'post',
    data: data
  })
}

/**
 * 上传文件和备注信息
 * @param {*} id
 * @param {*} data
 */
export function uploadFileApi(id, data) {
  return request({
    url: `/v1/repositories/project/${id}/files`,
    method: 'post',
    data: data
  })
}

/**
 * 下载文件
 * @param {*} id
 */
export function downloadFileApi(id) {
  return request({
    url: `/v1/repositories/project/${id}/files/download`,
    method: 'get'
  })
}

/**
 * 删除文件
 * @param {*} id
 * @param {*} data
 */
export function deleteFilesApi(id, data) {
  return request({
    url: `/v1/repositories/project/${id}/files`,
    method: 'delete',
    data: data
  })
}

/**
 * 创建文件分发
 * @param {*} data
 */
export function createDistributionApi(data) {
  return request({
    url: '/v1/buckets/distributions',
    method: 'post',
    data: data
  })
}

/**
 * 获取文件分发记录
 * @param {*} params
 */
export function getDistributionListApi(params) {
  return request({
    url: '/v1/buckets/distributions',
    method: 'get',
    params: params
  })
}
