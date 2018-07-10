import request from '@/utils/request'

export function getFileList() {
  return request({
    url: '/v1/repository/system/language',
    method: 'get'
  })
}
