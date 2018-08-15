import request from '@/utils/request'

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

/**
 * 获取下载历史列表
 * @param {*} id
 */
export function downloadListApi(params) {
  return request({
    url: `/v1/buckets/mul-download`,
    method: 'get',
    params: params
  })
}
