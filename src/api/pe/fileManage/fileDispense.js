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

export function uploadFileApi(id, data) {
  return request({
    url: `/v1/repositories/project/${id}/files/upload`,
    method: 'post',
    data: data
  })
}
