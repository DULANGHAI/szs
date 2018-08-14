import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const BUSSINESS_GROUP = ''

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getBussiness_group() {
  return Cookies.get(BUSSINESS_GROUP)
}

export function setBussiness_group() {
  return Cookies.set(BUSSINESS_GROUP)
}

export function removeBussiness_group() {
  return Cookies.remove(BUSSINESS_GROUP)
}
