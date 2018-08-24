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
 * 获取创建者的接口
 */
export function getCreatorApi() {
  return request({
    url: '/v1/jobs/timed/creator/',
    method: 'get'
  })
}

/**
 * 获取定时作业列表
 * @param {Object} params
 */
export function getJobListApi(params) {
  return request({
    url: '/v1/jobs/enable/',
    method: 'get',
    params: {
      name: params.name,
      system_type: params.system_type,
      job_type: params.job_type,
      target_ip: '',
      creator: params.creator,
      start_time: params.start_time,
      end_time: params.end_time,
      page: params.page,
      per_page: params.per_page
    }
  })
}

/**
 * 创建定时作业
 * @param {Object} data
 */
export function createJobApi(data) {
  return request({
    url: '/v1/jobs/timed/',
    method: 'post',
    data: data
  })
}

/**
 * 更新定时作业
 * @param {Object} data
 */
export function updateJobApi(id, data) {
  return request({
    url: `/v1/jobs/timed/${id}`,
    method: 'put',
    data: data
  })
}

/**
 * 删除定时作业
 * @param {Object} data
 */
export function deleteJobApi(data) {
  return request({
    url: `/v1/jobs/timed/`,
    method: 'delete',
    data: data
  })
}

/**
 * 获取记录列表数据
 * @param {Object} params
 */
export function getRecordListApi(params) {
  return request({
    url: '/v1/jobs/execution-record/',
    method: 'get',
    params: params
  })
}

/**
 * 执行定时作业-记录中
 * @param {Object} data
 */
export function startJobApi(data) {
  return request({
    url: '/v1/jobs/carry-out/again/',
    method: 'post',
    data: data
  })
}

/**
 * 停止定时作业-记录中
 * @param {Object} data
 */
export function stopJobApi(id) {
  return request({
    url: `/v1/jobs/${id}/stop/`,
    method: 'post'
  })
}

/**
 * 删除定时作业-记录中
 * @param {Object} data
 */
export function deleteJobRecordApi(data) {
  return request({
    url: '',
    method: 'post',
    data: data
  })
}

/**
 * 执行/启用 定时作业
 * @param {Object} data
 */
export function doJobApi(data) {
  return request({
    url: '/v1/jobs/timed/enable/',
    method: 'put',
    data: data
  })
}

/**
 * 执行/启用 定时作业
 * @param {Object} data
 */
export function stopTimedJobApi(data) {
  return request({
    url: '/v1/jobs/timed/disable/',
    method: 'put',
    data: data
  })
}
