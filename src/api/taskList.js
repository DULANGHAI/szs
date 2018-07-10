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
    url: '/v1/tasks/task-creator',
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
export function getAllScriptApi() {
  return request({
    url: '/v1/tasks/script/',
    method: 'get'
  })
}
