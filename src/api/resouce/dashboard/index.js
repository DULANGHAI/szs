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

/**
 * 获取执行节点监控的数据
 */
export function getHealthDataApi() {
  return request({
    url: '/v1/workers/health',
    method: 'get'
  })
}
