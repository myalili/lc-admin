

import qs from 'qs';
let axios=window.axios;
const { join } = window.codelessUtils;


let _request = (params = {})=>{
  return axios(params).then((res) => {
    const { msg, success, content, errorTips } = res;
    if (success) {
      return content
    } else {
      return Promise.reject(msg || errorTips || '接口异常')
    }
  })
};

let createBaseRequest = (baseUrl) => {
  return (params = {}) => {
    params.url = join(axios.aac, baseUrl, (params.url || ''))
    return _request(params)
  }
}

export const requestLogin = params => {
  var formData = new FormData();
  for (const key in params) {
    formData.append(key,params[key]);
  }
  return  axios.post(`${axios.aac}/login`,formData);

};
export const logout=params=>{
  return axios.post(`${axios.aac}/logout`);
}


export const getRoutersList = params=>{
  return axios.get(`${axios.aac}/current?platformTypes=${window.platform}`);
}



//修改密码
export const modifiedPassword = (params)=>{
  return axios.put(`${axios.aac}/current/password`,params);
}

//获取当前登录用户关联的租户列表（含相同根租户的且不在该用户下的租户）
export const getTenants = ()=>{
  return axios.get(`${axios.aac}/current/same-root-tenants`);
}

//切换当前用户选中的租户
export const setTenant = (params)=>{
  return axios.put(`${axios.aac}/current/tenant?tenantId=${params.tenantId}`)
}


//获取权限列表
export const requestAuths = params => {
  return axios.get(`${axios.aac}/authorities/query`, params)
  };

//新增权限
export const addAuth = params => {
  return axios.post(`${axios.aac}/authorities`, params.authPO)
  };

//编辑权限
export const editAuth = params => {
  return axios.put(`${axios.aac}/authorities/${params.id}`, params.authPO)
  };

//删除权限
export const deleteAuths = params => {
  return axios.delete(`${axios.aac}/authorities`, {data: params.ids})
  };

//权限关联菜单
export const relateMenu = params => {
  return axios.post(`${axios.aac}/authorities/${params.id}/menus`, params.menuIds)
  };

//根据权限获取关联菜单
export const requestRelatedMenu = params => {
  return axios.get(`${axios.aac}/authorities/${params.id}/menus`)
};

//添加菜单
export const addMenus=(params)=>{
  return axios.post(`${axios.aac}/menus`,params)
}
//批量添加菜单
export const addBatchMenus=(params)=>{
  return axios.post(`${axios.aac}/menus/batch`,params)
}

//批量删除菜单
export const deleteMenus=(data)=>{
  return axios.delete(`${axios.aac}/menus`,{data})
}

//获取菜单列表
export const requestMenus = (params)=>{
  let url = `${axios.aac}/menus/query`

  if(params && params.type){
      url = `${url}?type=${params.type}`
  }
 
  return axios.get(url)
}

//编辑菜单
export const editMenu = params => {
    return axios.put(`${axios.aac}/menus/${params.id}`, params.menuPO)
};

//批量编辑菜单
export const editMenus = params => {
  return axios.put(`${axios.aac}/menus/batch`, params)
};


//获取菜单
export const getMenu = id => {
  return axios.get(`${axios.aac}/menus/${id}`)
};
//查询部门
export const getDepartment = params => {
  return axios.get(`${axios.aac}/department`,params)
};
//添加部门 
export const addDepartment = params => {
  return axios.post(`${axios.aac}/department`,params)
};
//删除部门
export const deleteDepartment = params => {
  return axios.delete(`${axios.aac}/department`,{data:params})
};
//修改部门
export const eidtDepartment = params => {
  return axios.put(`${axios.aac}/department/${params.id}`,params)
};
//获取部门角色
export const getDepartmentroles = params => {
  return axios.get(`${axios.aac}/department/${params.id}/roles`,params)
};
// 获取全量角色
export const getAllRoles = params => {
  return axios.get(`${axios.aac}/roles`,params)
};
// 删除部门角色
export const DepartmentdeteleRoles = params => {
  return axios.delete(`${axios.aac}/roles`,{data:params});
};
// 添加部门角色
export const DeAddRoles = params => {
  return axios.post(`${axios.aac}/roles`,params)
};
// 获取部门用户
export const getDepartmentUser = params => {
  return axios.get(`${axios.aac}/department/${params.id}/users`,params.data)
};
// 批量删除部门用户
export const modifyDepartmentUser = params => {
  return axios.put(`${axios.aac}/department/${params.id}/users`,params.data)
};


const rolePrefix = '/roles'

const roleRequest = createBaseRequest(rolePrefix)

export const getRoleList = (isGlobal)=>{
  return isGlobal ? getNoTenantRoles() : getRoles()
}

let roleSort = (content = [])=> {
  content = content.map(item => {
    item.sortNum = 1
    if (item.type === '1') {
      item.sortNum = 2
    } else if (!item.tenantId) {
      item.sortNum = 0
    }
    return item
  })
  return content.sort((a, b) => b.sortNum - a.sortNum)
}

let getRoles = ()=>{
  return roleRequest().then(roleSort)
}


export const getNoTenantRoles = ()=>{
  return roleRequest({
    url: 'no_tenant'
  }).then(roleSort)
}

export const deleteRole = (id) =>{
  return roleRequest({
    url: id,
    method: 'DELETE',
  })
}
// 查询角色下的用户列表
export function queryRoleUsers(roleId) {
 return  roleRequest({
    url:join(roleId, 'users')
  })
}

let randomCode = ()=>{
  var str = '';
  for (var i = 0; i < 4; i++) {
    var ranNum = Math.ceil(Math.random() * 25);
    str += String.fromCharCode(65 + ranNum);
  }
  return str;
}

export const addRole=(role)=> {
  return roleRequest({
    method: 'POST',
    data: {
      ...role
    }
  })
}



export const getAuthoritiesList = (id)=>{
  return roleRequest({
    url: join(id, 'authorities'),
  })
}

export const saveAuthorities = (id, platform, list)=>{
  if (Array.isArray(platform)) {
    platform = platform.join(',')
  }
  return roleRequest({
    url: join(id, 'authorities'),
    method: 'PUT',
    data: JSON.stringify(list),
    params: {
      type: platform
    },
    headers: {
      "Content-type": "application/json",
    },
  })
}

const tenantsPrefix = '/tenants'
const tenantsRequest = createBaseRequest(tenantsPrefix)


export function getTenantList(params) {
  return tenantsRequest({ params })
}

export function getTenantInfo(id) {
  return tenantsRequest({ url: id })
}


export const addTenant = (data)=>{
  return tenantsRequest({
    method: 'POST',
    data
  })
}


export const modifyTenant = (data)=>{
  return tenantsRequest({ url: data.id, method: 'PUT', data })
}

export const deleteTenant = (ids) =>{
  if (Array.isArray(ids)) {
    return tenantsRequest({
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(ids)
    })
  }
  return tenantsRequest({
    url: ids,
    method: 'DELETE',
  })

}

export const getRelatedUser = (tenantId,params)=>{
  return tenantsRequest({
    url: join(tenantId, 'users'),
    params
  })
}

export const addTenantUser = (tenantId, data)=>{
  return tenantsRequest({
    url: join(tenantId, 'user'),
    method: 'POST',
    data
  })
}

export const relateUser = (tenantId, userIds)=>{
  if (!Array.isArray(userIds)) {
    userIds = [userIds]
  }
  return tenantsRequest({
    url: join(tenantId, 'users'),
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(userIds)
  })
}

export const createOwner = (tenantId, data)=>{
  return tenantsRequest({
    url: join(tenantId, 'owner'),
    method: 'POST',
    data
  })
}

export const relateOwner = (tenantId, userId)=>{
  return tenantsRequest({
    url: join(tenantId, 'owner'),
    method: 'PUT',
    params: { userId }
  })
}

export const deleteOwner = (tenantId)=>{
  return tenantsRequest({
    url: join(tenantId, 'owner'),
    method: 'DELETE',
  })
}

export const getRoleListByTenantId = (tenantId,params)=>{
  return tenantsRequest({
    url: join(tenantId, 'roles'),
    params
  })
}

export const deleteTenantUser = (data)=>{
  return axios.delete(`${axios.aac}/tenants/${data.id}/users`,{data:data.ids})
}

export const getAllUser = (params)=>{
  return axios.get(`${axios.aac}/users`, {params})
}

export const requestUser = ({params})=>{
  return axios.get(`${axios.aac}/current/tenant/users`, {params})
}

export const addUser = params => {
  return axios.post(`${axios.aac}/users`, params);
};

export const updateUser = params => {
  return axios.put(`${axios.aac}/users/${params.id}`, params)
};

export const deleteUser = params => {
  return axios.delete(`${axios.aac}/users`,{data:params.ids})
};

export const enableUser = (ids, enabled) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }
  return axios({
    url: `${axios.aac}/users/enable`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    params: { enabled },
    data: JSON.stringify(ids)
  })
};

export const resetPassword = params =>{
  return axios.put(`${axios.aac}/users/${params.id}/reset_passwd`)
}

export const getUserReRole = params => {
  let url = `${axios.aac}/users/${params.id}/roles`;
  if(params.tenantId){
    url+=`?tenantId=${params.tenantId}`
  }
  return axios.get(url);
};
export const userReRole = params => {
  let url = `${axios.aac}/users/${params.id}/roles`;
  if(params.tenantId){
    url+=`?tenantId=${params.tenantId}`
  }
  return axios.put(url, params.ids);
};

// 系统
export function querySystems(query) {
  return axios.get(`${axios.aac}/systems?${qs.stringify(query)}`);
}
