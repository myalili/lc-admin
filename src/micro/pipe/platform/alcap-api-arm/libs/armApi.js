let axios = window.axios;

export const getArmUnpkg=()=>{
  return axios.unpkg
}

export const getUnkgData=(scope)=>{
  return axios.get(`${axios.unpkg}/${scope}`)

}
//根据schema名称筛选实体
export const saveTemplate = (params) => {

  return axios.post(`${axios.arm}/alcap/template`, params)

}
export const getScopeInfo = (scope,params={}) => {
  return axios.get(`${axios.arm}/material/aweb/scope/${scope}`, {params})

  // /material/aweb/menu
}

export const getNpmLibs = (params) => {
  return axios.get(`${axios.arm}/material/npm`, {params})
}
