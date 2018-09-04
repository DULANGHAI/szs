import request from '@/utils/request'

/**
 * 获取系统和语言
 * @param {Object} params
 */
export function getLanguageApi() {
  return request({
    url: '/v1/repositories/system',
    method: 'get'
  })
}

/**
 * 获取执行者
 */
export function getCreatorApi() {
  return request({
    url: '/v1/jobs/job-record/creator/',
    method: 'get'
  })
}

/**
 * 获取记录列表
 * @param {*} params
 */
export function getListApi(params) {
  return request({
    url: '/v1/jobs/job-record/',
    method: 'get',
    params: {
      execution_id: params.execution_id,
      job_type: params.job_type,
      system_type: params.system_type,
      name: params.name,
      execution_type: params.execution_type,
      // target_ip: JSON.stringify({ host: params.target_ip }),
      target_ip: '',
      creator: params.creator,
      start_time: params.start_time,
      end_time: params.end_time,
      page: params.page,
      per_page: 10
    }
  })
}

/**
 * 根据ID获取记录信息
 * @param {*} params
 */
export function getDetailApi(id) {
  return request({
    url: '/v1/jobs/job-record/',
    method: 'get',
    params: {
      id: id,
      page: 1,
      per_page: 10
    }
  })
}

//
export function getLogDetailApi(execution_id, target_ip) {
  return request({
    url: '/v1/jobs/job-record/log/',
    method: 'get',
    params: {
      execution_id: execution_id,
      target_ip: target_ip
    }
  })
}
