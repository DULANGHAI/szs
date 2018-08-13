import request from '@/utils/request'

export function getListApi(params) {
  return request({
    url: '/v1/buckets/hosts',
    method: 'get',
    params: params
  })
}

/**
 * 触发一个下载任务
 * @param {*} id
 */
export function postDownloadApi(data) {
  return request({
    url: `/v1/buckets/mul-download`,
    method: 'post',
    data: data
  })
}

