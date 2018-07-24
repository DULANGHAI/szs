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
