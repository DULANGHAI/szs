import { login, logout, getInfo } from '@/api/login'
import { getRepositoryHd } from '@/api/script'
import { getToken, setToken, getUserName, setUserName, removeUserName, getUserInit, setUserInit, removeToken, removeUserInit, getBussinessGroup, setBussinessGroup, removeBussinessGroup } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: getUserName(),
    avatar: '',
    roles: [],
    repository: getBussinessGroup(),
    bussinessList: [],
    userid: '',
    userinit: getUserInit()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_REPOSITORY: (state, repository) => {
      state.repository = repository
    },
    SET_BUSSINESS: (state, bussiness) => {
      state.bussinessList = bussiness
    },
    SET_USERID: (state, id) => {
      state.userid = id
    },
    SET_USERINIT: (state, init) => {
      state.userinit = init
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response
          setToken(data.id)
          setUserInit(data.init_login)
          setUserName(data.username)
          commit('SET_TOKEN', data.id)
          commit('SET_USERID', data.id)
          commit('SET_NAME', data.username)
          commit('SET_USERINIT', data.init_login)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_USERID', getToken())
          commit('SET_NAME', getUserName())
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取业务组
    GetBussiness({ commit, state }) {
      return new Promise((resolve, reject) => {
        getRepositoryHd(state.token).then(response => {
          const data = response
          getBussinessGroup() || setBussinessGroup(data[0].name)
          getBussinessGroup() || commit('SET_REPOSITORY', data[0].name)
          commit('SET_BUSSINESS', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USERID', '')
          commit('SET_USERINIT', '')
          removeToken()
          removeUserInit()
          removeUserName()
          removeBussinessGroup()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        commit('SET_USERINIT', '')
        removeToken()
        removeUserInit()
        removeUserName()
        removeBussinessGroup()
        resolve()
      })
    }
  }
}

export default user
