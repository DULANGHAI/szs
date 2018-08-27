/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 验证邮箱
export const validateEmail = (rule, value, callback) => {
  switch (true) {
    case value === '':
      callback(new Error('邮箱地址不能为空'))
      break
    case !/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value):
      callback(new Error('邮箱地址不正确'))
      break
    default:
      callback()
  }
}

// 验证手机
export const validatePhone = (rule, value, callback) => {
  switch (true) {
    case value === '':
      callback(new Error('手机号码不能为空'))
      break
    case !/^1\d{10}$/.test(value):
      callback(new Error('手机号码格式不正确'))
      break
    default:
      callback()
  }
}

// 字母大小写+数字+符号
export const validatePwdZf = (rule, value, callback) => {
  switch (true) {
    case value === '':
      callback(new Error('密码不能为空'))
      break
    case !/^[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,30}$/.test(value):
      callback(new Error('密码格式不正确(包含字母大小写、数字、符号)'))
      break
    default:
      callback()
  }
}
