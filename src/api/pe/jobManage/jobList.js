import request from '@/utils/request'

/**
 * 远程搜索作业接口，就是任务列表获取列表的接口
 * @param {Object} params
 */
export function getJobItemApi(params) {
  return request({
    url: '/v1/tasks/enable/',
    method: 'get',
    params: params
  })
}
