import request from '@/utils/request'

/**
 * 获取系统和语言
 * @param {Object} params
 */
export function getLanguageApi() {
  return request({
    url: '/v1/repository/system/language',
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
 * 作业列表
 * @param {Object} params
 */
export function getJobListApi(params) {
  return request({
    url: '/v1/jobs/',
    method: 'get',
    params: params
  })
}

/**
 * 即使作业列表
 * @param {Object} params
 */
export function getInstantListApi(params) {
  return request({
    url: '/v1/jobs/instant/',
    method: 'get',
    params: params
  })
}

/**
 * 创建即时作业
 * @param {Object} data
 */
export function createInstantApi(data) {
  return request({
    url: '/v1/jobs/instant/',
    method: 'post',
    data: data
  })
}

/**
 * 删除即时作业
 * @param {Object} data
 */
export function deleteInstantApi(data) {
  return request({
    url: '/v1/jobs/instant/',
    method: 'delete',
    data: data
  })
}

/**
 * 更新即时作业
 * @param {Object} data
 */
export function updateJobApi(id, data) {
  return request({
    url: `/v1/jobs/instant/${id}`,
    method: 'put',
    data: data
  })
}

/**
 * 执行作业
 * @param {Object} data
 */
export function doTaskApi(data) {
  return request({
    url: '/v1/jobs/instant/carry-out',
    method: 'post',
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
 * 执行即时作业
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
 * 停止即时作业
 * @param {Object} data
 */
export function stopJobApi(data) {
  return request({
    url: '/v1/jobs/instant/stop/',
    method: 'post',
    data: data
  })
}

/**
 * 删除即时作业
 * @param {Object} data
 */
export function deleteJobApi(data) {
  return request({
    url: '',
    method: 'post',
    data: data
  })
}
