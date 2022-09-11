let axios = window.axios;

//添加原型页面
export const addPage = (params)=>{
  return axios.post(`${axios.bff}/page/add`,params)
}

//删除页面
export const deletePage = (params)=>{
  return axios.post(`${axios.bff}/page/delete?id=${params.id}`)
}


//查询原型页面
export const getPageList = (params)=>{
  return axios.get(`${axios.bff}/page/list`,{params})
}

//修改原型页面
export const updatePage = (params)=>{
  return axios.post(`${axios.bff}/page/update`,params)
}

//查询原型页面相关版本
export const getPageVersions = (params)=>{
  return axios.get(`${axios.bff}/page/versions`,{params})
}

//创建/保存草稿
export const savePageDraft = (params)=>{
  return axios.post(`${axios.bff}/page/saveDraft`,params)
}

//发布
export const savePageAsNewVer = (params)=>{
  return axios.post(`${axios.bff}/page/publish`,params)
}

//上架
export const releasePage = (params)=>{
  return axios.post(`${axios.bff}/page/release?id=${params.id}`)
}

//下架
export const discardPage = (params)=>{
  return axios.post(`${axios.bff}/page/discard?id=${params.id}`)
}

//查询上架页面
export const getReleasePages = (params)=>{
  return axios.get(`${axios.bff}/page/releases`,{params})
}

//查询单个页面的详情
export const getPageDetails = (params)=>{
  return axios.get(`${axios.bff}/page/get/${params.id}`)
}