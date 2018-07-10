import request from '@/utils/request'

export function getFileList(project_id, params) {
  return request({
    url: '/v1/repository/project/' + project_id,
    method: 'get',
    params
  })
}
