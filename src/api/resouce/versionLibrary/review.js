import request from '@/utils/request'

// 文件审批列表
export function getReviewList(params) {
  return request({
    url: '/v1/repositories/review/',
    method: 'get',
    params
  })
}

// 撤销审批
export function getReviewRevoke(id) {
  return request({
    url: '/v1/repositories/review/' + id,
    method: 'put'
  })
}

// 文件审批详情
export function getReviewDetail(id) {
  return request({
    url: '/v1/repositories/review/' + id,
    method: 'get'
  })
}

// 文件diff
export function getReviewDiff(id, commit_sha, params) {
  return request({
    url: '/v1/repositories/project/' + id + '/diff/' + commit_sha,
    method: 'get',
    params
  })
}

// 文件审批提交
export function postReview(id, params) {
  return request({
    url: '/v1/repositories/review/' + id,
    method: 'post',
    data: params
  })
}

