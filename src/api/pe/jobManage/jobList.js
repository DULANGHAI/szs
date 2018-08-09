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

/**
 * 创建作业
 * @param {Object} data
 */
export function createJobApi(data) {
  return request({
    url: '/v1/jobs/',
    method: 'post',
    data: data
  })
}

/**
 * 获取作业列表数据
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
 * 通过ID获取作业信息（查看、编辑用）
 * @param {Number} id
 */
export function getJobDataApi(id) {
  return request({
    url: `/v1/jobs/${id}`,
    method: 'get'
  })
}

/**
 * 更新作业
 * @param {Object} data
 */
export function updateJobApi(data) {
  return request({
    url: `/v1/jobs/${data.id}`,
    method: 'put',
    data: data
  })
}

/**
 * 启用或禁用多个作业
 * @param {Object} data
 */
export function changeJobStatusApi(data) {
  return request({
    url: '/v1/jobs/',
    method: 'put',
    data: data
  })
}

/**
 * 删除多个任务
 * @param {Object} data
 */
export function deleteJobApi(data) {
  return request({
    url: '/v1/jobs/',
    method: 'delete',
    data: data
  })
}
