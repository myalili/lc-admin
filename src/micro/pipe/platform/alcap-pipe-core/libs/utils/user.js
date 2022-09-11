

export function setToken(token) {
  return window.localStorage.setItem('token', token)
}

export function removeToken() {
  return window.localStorage.removeItem('token')
}

export function getToken() {
  return window.localStorage.getItem('token')

}

export function getUser() {
  return window.localStorage.getItem('user')

}
export function setUser(user) {
  return window.localStorage.setItem('user', user)
}
export function removeUser() {
  return window.localStorage.removeItem('user')
}

export function getUserMenus() {
  return window.localStorage.getItem('menus') || [];

}
export function setUserMenus(menus) {
  return window.localStorage.setItem('menus', menus)
}
export function removeUserMenus() {
  return window.localStorage.removeItem('menus')
}


export function getUserInfo() {
  var infoObj = window.localStorage.getItem('userInfo');
  return infoObj ? JSON.parse(infoObj) : '';

}
export function setUserInfo(info) {
  var infoStr = info ? JSON.stringify(info) : '';

  return window.localStorage.setItem('userInfo', infoStr)
}
export function removeUserInfo() {
  return window.localStorage.removeItem('userInfo')
}

export function setAuth(auth) {
  var infoStr = auth ? JSON.stringify(auth) : '';

  window.localStorage.setItem('auth', infoStr)
}
export function getAuth() {
  var infoObj = window.localStorage.getItem('auth');
  return infoObj ? JSON.parse(infoObj) : '';

}
export function removeAuth() {
  window.localStorage.removeItem('auth')
}

export function setDepartmentId(id){
  window.localStorage.setItem('curDepartmentId', id)
}

export function getDepartmentId(){
 return  window.localStorage.getItem('curDepartmentId')
}

export function removeDepartmentId(){
  window.localStorage.removeItem('curDepartmentId')
}



// export function getCurrentRoute(path){
//   let routeConfig = localStorage.getItem("routeConfig");
//   routeConfig = (routeConfig && JSON.parse(routeConfig)) || {};


//   if (routeConfig[path]) {
//     return routeConfig[path]
//   }else{
//     return null
//   }
// }
// export function setTenantId(tenant) {
//   if(tenant && tenant.id){
//     return window.localStorage.setItem('tenantId',tenant.id)
//   }
  
// }
