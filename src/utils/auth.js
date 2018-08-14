import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const BussinessGroup = 'BussinessGroup'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getBussinessGroup() {
  return Cookies.get(BussinessGroup)
}

export function setBussinessGroup(val) {
  return Cookies.set(BussinessGroup, val)
}

export function removeBussinessGroup() {
  return Cookies.remove(BussinessGroup)
}
