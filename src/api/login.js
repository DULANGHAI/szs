import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/v1/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
  // return Promise.resolve({
  //   data: {
  //     roles: ['admin'],
  //     token: 'admin',
  //     introduction: '我是超级管理员',
  //     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //     name: 'Super Admin'
  //   }
  // })
}

export function getInfo(token) {
  // return request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  return Promise.resolve({
    data: {
      roles: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'xxx.gif',
      name: 'Super Admin'
    }
  })
}

export function logout() {
  return request({
    url: '/v1/auth/logout',
    method: 'get'
  })
}
