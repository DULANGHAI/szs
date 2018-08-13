import request from '@/utils/request'

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

