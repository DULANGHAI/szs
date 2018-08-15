import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const BussinessGroup = 'BussinessGroup'
const UserInit = 'UserInit'
const UserName = 'UserName'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(UserName)
}

export function setUserName(name) {
  return Cookies.set(UserName, name)
}

export function removeUserName() {
  return Cookies.remove(UserName)
}

export function getUserInit() {
  return Cookies.get(UserInit)
}

export function setUserInit(bool) {
  return Cookies.set(UserInit, bool)
}

export function removeUserInit() {
  return Cookies.remove(UserInit)
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
