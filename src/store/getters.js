const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  routeKey: state => state.app.routeKey,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  moduleName: state => state.modules.moduleName,
  repository: state => state.user.repository,
  userinit: state => state.user.userinit
}
export default getters
