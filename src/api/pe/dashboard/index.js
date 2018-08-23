import request from '@/utils/request'
import dayjs from 'dayjs'

/**
 * 获取作业执行数和成功率
 */
export function getJobCardDataApi(params) {
  return request({
    url: '/v1/statistics/job-records',
    method: 'get',
    params: {
      start_time: dayjs(params.start_time).toJSON(),
      end_time: dayjs(params.end_time).toJSON()
    }
  })
}

/**
 * 获取流程执行数和成功率
 */
export function getFlowCardDataApi(params) {
  return request({
    url: '/v1/statistics/flow-records',
    method: 'get',
    params: {
      start_time: dayjs(params.start_time).toJSON(),
      end_time: dayjs(params.end_time).toJSON()
    }
  })
}

/**
 * 获取作业量统计chart data
 */
export function getJobChartDataApi(params) {
  return request({
    url: '/v1/statistics/job-numbers',
    method: 'get',
    params: {
      start_time: dayjs(params.start_time).toJSON(),
      end_time: dayjs(params.end_time).toJSON()
    }
  })
}

/**
 * 获取流程执行统计chart data
 */
export function getFlowChartDataApi(params) {
  return request({
    url: '/v1/statistics/flow-numbers',
    method: 'get',
    params: {
      start_time: dayjs(params.start_time).toJSON(),
      end_time: dayjs(params.end_time).toJSON()
    }
  })
}
