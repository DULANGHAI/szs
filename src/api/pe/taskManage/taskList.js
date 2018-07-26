import request from '@/utils/request'

/**
 * 获取列表
 * @param {Object} params
 */
export function getListApi(params) {
  return request({
    url: '/v1/tasks/',
    method: 'get',
    params: params
  })
}

/**
 * 获取创建者
 * @param {Object} params
 */
export function getCreatorApi() {
  return request({
    url: '/v1/tasks/task-creator/',
    method: 'get'
  })
}

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
 * 启用或禁用多个任务
 */
export function changeTaskStatusApi(data) {
  return request({
    url: '/v1/tasks/',
    method: 'put',
    data: data
  })
}

/**
 * 删除多个任务
 */
export function deleteTaskApi(data) {
  return request({
    url: '/v1/tasks/',
    method: 'delete',
    data: data
  })
}

/**
 * 查询所有的脚本
 */
export function getAllScriptApi(params) {
  return request({
    url: '/v1/repository/script',
    method: 'get',
    params: params
  })
}

/**
 * 查询脚本版本
 */
export function getScriptVersionApi(id) {
  return request({
    url: `/v1/repository/script/${id}`,
    method: 'get'
  })
}

/**
 * 创建任务
 * @param {Object} data
 */
export function createTaskApi(data) {
  return request({
    url: '/v1/tasks/',
    method: 'post',
    data: data
  })
}

/**
 * 获取命令任务的风险等级和风险说明
 * @param {Object} data
 */
export function getTaskRiskApi(data) {
  return request({
    url: '/v1/tasks/task-risk/',
    method: 'post',
    data: data
  })
}

/**
 * 根据任务id获取任务数据
 */
export function getTaskApi(id) {
  return request({
    url: `/v1/tasks/${id}`,
    method: 'get'
  })
}

/**
 * 根据任务id更新任务数据
 */
export function upadateTaskApi(id, data) {
  return request({
    url: `/v1/tasks/${id}`,
    method: 'put',
    data: data
  })
}
