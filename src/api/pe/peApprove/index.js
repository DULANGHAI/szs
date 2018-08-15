import request from '@/utils/request'

/**
 * 获取记录列表
 * @param {Object} params
 */
export function getListApi(params) {
  return request({
    url: '/v1/approvals/',
    method: 'get',
    params: {
      task_name: params.task_name || null,
      operation_type: params.operation_type || null,
      status: params.status || null,
      operator: params.operator || null,
      approver: params.approver || null,
      start_time: params.start_time || null,
      end_time: params.end_time || null,
      page: params.page,
      per_page: params.per_page
    }
  })
}

/**
 * 通过/拒绝
 * @param {Object} data
 */
export function approveApi(id, data) {
  return request({
    url: `/v1/approvals/${id}`,
    method: 'put',
    data: data
  })
}

/**
 * 获取执行人/审批人,用的同一份数据 1000个
 * @param {Object} data
 */
export function getUserListApi() {
  return request({
    url: '/v1/users/',
    method: 'get',
    params: {
      page: 1,
      per_page: 1000
    }
  })
}
