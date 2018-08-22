import request from '@/utils/request'

/**
 * 获取作业队列监控的数据
 */
export function getWorkersDataApi() {
  return request({
    url: '/v1/workers/statistic',
    method: 'get'
  })
}
