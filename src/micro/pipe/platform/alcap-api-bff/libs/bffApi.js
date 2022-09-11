let axios = window.axios;
const { join } = window.codelessUtils
import userLoggerApis from "./userLoggerApi"


let _request=(params = {})=>{
  return axios(params).then((res) => {
    if (typeof res === 'string') return res
    const { msg, success, obj, errorTips } = res;
    if (success) {
      return obj
    } else {
      return Promise.reject(new Error(msg || errorTips || '接口异常'))
    }
  })
}

let createBaseRequest = (baseUrl)=>{
  return (params = {}) => {
    params.url = join(axios.bff,baseUrl, (params.url || ''))
    return _request(params)
  }
}



//根据schema名称筛选实体
export const getEntityListBySchema=(name, tenantId)=>{
    return axios.get(`${axios.bff}/entity/schema-entity?name=${name}&tenantId=${tenantId}`)
  }


//刷新用户信息缓存
export const refreshUserInfo=()=>{
    return axios.post(`${axios.bff}/auth/refresh-user-info`);
}

//添加schema
export const addSchema = (params)=>{
  return axios.post(`${axios.bff}/entity/schema/add`,params);
}

//修改schema
export const updateSchema = (params)=>{
  return axios.post(`${axios.bff}/entity/schema/update`,params);
}

//获取单个租户下的实体列表
export const getSchemaList = (params)=>{
  return axios.get(`${axios.bff}/entity/schema/list-page`,{
    params
  });
}

//获取单个租户下的实体列表
export const getSchemaListNoPage = (params)=>{
  return axios.get(`${axios.bff}/entity/schema/list`,{
    params
  });
}

//删除schema
export const deleteSchema = (id)=>{
  return axios.post(`${axios.bff}/entity/schema/delete?id=${id}`);
}

//根据schemaJson生成示例json
export const getExampleJson = (params)=>{
  return axios.post(`${axios.bff}/entity/schema/exampleJson`,params);
}


const prefix = '/entity'

const request = createBaseRequest(prefix)

export const getEntityList = (params)=>{
  return request({
    url: 'list',
    method: 'GET',
    params
  })
}

export const deleteEntity = (params) =>{
  return request({
    url: 'delete',
    method: 'POST',
    params
  })
}

export const getEntity = (params)=>{
  return request({
    url: 'get/' + params.id,
    method: 'GET',
  })
}

export const addEntity = (params)=>{
  return request({
    url: 'add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data:params
  })
}

export const updateEntity = (params)=>{
  return request({
    url: 'update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data:params
  })
}

const aupPrefix = "/aup"
const aupRequest = createBaseRequest(aupPrefix)

export const tree = (type)=>{
  return aupRequest({
    url: 'categories/tree',
    params: {
      type
    }
  })
}

export const codeList = (params)=>{
  return aupRequest({
    url: 'code/get',
    params
  })
}

export const query = (params) =>{
  return aupRequest({
    url: 'dictionary/items/query',
    params
  })
}

const filePrefix = "/file"
const fileRequest = createBaseRequest(filePrefix)

export const download = (params) =>{
  return fileRequest({
    url: '/download',
    method: 'GET',
    params
  })
}

export const upload = (params) =>{
  // return fileRequest({
  //   url: '/upload',
  //   formData
  // })
  var formData = new FormData();
  formData.append('module',params.module);
  
  if (Array.isArray(params.file)) {
    params.file.forEach(f => {
      formData.append('file',f);
    });
  }else {
    formData.append('file',params.file);
  }
  

  return axios.post(`${axios.bff}/file/upload`,formData)
}

export const fileAdd = (params) =>{
  var formData = new FormData();
  formData.append('tenantId',params.tenantId);
  
  if (Array.isArray(params.file)) {
    params.file.forEach(f => {
      formData.append('file',f);
    });
  }else {
    formData.append('file',params.file);
  }
  

  return axios.post(`${axios.bff}/resource/file/add`,formData)
}

export const userLoggerApi = userLoggerApis


export const uploadIcon = (params)=>{
  return axios.post(`${axios.bff}/resource/icon/add`,params)
}

export const deleteIcon = (id)=>{
  return axios.post(`${axios.bff}/resource/icon/delete?id=${id}`)
}

export const getIconList = (tenantId) =>{
  return axios.get(`${axios.bff}/resource/icon/list`,{
    params:{
      tenantId
    }
  })
}
export const getIconJson = (url)=>{
  return axios.get(`${axios.bff}${url}`)
}

export const uploadPicture = (params)=>{
  let formData = new FormData();
  formData.append('tenantId',params.tenantId);
  if (Array.isArray(params.file)) {
    params.file.forEach(f => {
      formData.append('file',f);
    });
  }else {
    formData.append('file',params.file);
  }
  return axios.post(`${axios.bff}/resource/picture/add`, formData)
}

export const deletePicture = (id)=>{
  return axios.post(`${axios.bff}/resource/picture/delete?id=${id}`)
}

export const getPictureList = (params) =>{
  return axios.get(`${axios.bff}/resource/picture/list`,{
    params
  })
}

// db类型实体接口
const dbPrefix = "/db/entity"
const dbRequest = createBaseRequest(dbPrefix)

// 建表并删除已存在的表
export const dbCreateExistsTable = (entityId) =>{
  return axios.post(`${axios.bff}/db/entity/create-exists-table?entityId=${entityId}`);
  // return dbRequest({
  //   url: `/create-exists-table?entityId=${entityId}`,
  //   method: 'POST',
  // })
}
// 建表
export const dbCreateTable = (entityId) =>{
  return axios.post(`${axios.bff}/db/entity/create-table?entityId=${entityId}`);
  // return dbRequest({
  //   url: `/create-table?entityId=${entityId}`,
  //   method: 'POST',
  // })
}
// 添加记录
export const dbCreateRecord = (params) =>{
  return dbRequest({
    url: '/create-record',
    method: 'POST',
    data:params
  })
}
// 删除记录
export const dbDeleteRecord = (params) =>{
  return dbRequest({
    url: `/delete-record${params}`,
    method: 'POST',
  })
}
// 导出记录（excel）
export const dbExportExcel = (params) =>{
  // return dbRequest({
  //   url: `/export/excel`,
  //   method: 'POST',
  //   data:params,
  // })

  return axios.post(`${axios.bff}/db/entity/export/excel`,
    params, { responseType: "blob" })
}
// 导入模板（excel）
export const dbExportTemplate = (params) =>{
  // return dbRequest({
  //   url: `/export/template?entityId=${params.entityId}`,
  //   method: 'POST',
  // })

  return axios.post(`${axios.bff}/db/entity/export/template?entityId=${params.entityId}`,
  params, { responseType: "blob" })
}
// 导入记录（excel）
export const dbExportUpload = (params) =>{
  var formData = new FormData();
  formData.append('entityId',params.entityId);
  params.file.forEach(f => {
    formData.append('file',f);
  });
  // return dbRequest({
  //   url: `/export/upload`,
  //   method: 'POST',
  //   formData
  // })
  return  axios.post(`${axios.bff}/db/entity/export/upload`,formData);
}
// 查询记录
export const dbRetrieveRecord = (params) =>{
  return dbRequest({
    url: `/retrieve-record`,
    method: 'POST',
    data:params
  })
}
// 修改记录
export const dbUpdateRecord = (params) =>{
  return dbRequest({
    url: `/update-record`,
    method: 'POST',
    data:params
  })
}

// 三方类型实体接口
const dataSourcePrefix = "/data-source/entity"
const dataSourceRequest = createBaseRequest(dataSourcePrefix)

// 添加记录
export const dataSourceCreateRecord = (params) =>{
  return dataSourceRequest({
    url: '/create',
    method: 'POST',
    data:params
  })
}
// 删除记录
export const dataSourceDeleteRecord = (params) =>{
  return dataSourceRequest({
    url: `/delete`,
    method: 'POST',
    data:params
  })
}
// 导出记录（excel）
export const dataSourceExportExcel = (params) =>{
  // return dataSourceRequest({
  //   url: `/export/excel?entityId=${entityId}`,
  //   method: 'POST',
    
  // })

  return axios.post(`${axios.bff}/data-source/entity/export/excel?entityId=${params.entityId}`,
  {entityId: params.params}, { responseType: "blob" })
}
// 导入模板（excel）
export const dataSourceExportTemplate = (entityId) =>{
  // return dataSourceRequest({
  //   url: `/export/template?entityId=${entityId}`,
  //   method: 'POST',
  // })

  return axios.post(`${axios.bff}/data-source/entity/export/template?entityId=${entityId}`,
  entityId, { responseType: "blob" })
}
// 导入记录（excel）
export const dataSourceExportUpload = (params) =>{
  var formData = new FormData();
  formData.append('entityId',params.entityId);
  params.file.map((i) => {
    formData.append("file", i);
  });
  // return dataSourceRequest({
  //   url: `/export/upload`,
  //   method: 'POST',
  //   formData
  // })
  return  axios.post(`${axios.bff}/data-source/entity/export/upload`,formData);
}
// 查询记录
export const dataSourceRetrieveRecord = (params) =>{
  return dataSourceRequest({
    url: `/retrieve`,
    method: 'POST',
    data:params
  })
}
// 修改记录
export const dataSourceUpdateRecord = (params) =>{
  return dataSourceRequest({
    url: `/update`,
    method: 'POST',
    data:params
  })
}

// 数据工厂实体接口
const dataFactoryPrefix = "/data-factory/entity"
const dataFactoryRequest = createBaseRequest(dataFactoryPrefix)

// 根据实体计算结果
export const dataFactoryRetrieveRecord = (params) =>{
  // return dataFactoryRequest({
  //   url: `/retrieve`,
  //   method: 'POST',
  //   data:params
  // })
  return axios.post(`${axios.bff}/data-factory/entity/retrieve${params}&deptId=${1}`);
}

// 脚本类型数据预览
export const getScriptPreData = (json) => {
  return axios.post(`${axios.bff}/data-factory/entity/script/preview?deptId=`, { json });
}

// db类型实体接口
const domainPrefix = "/domain"
const domainRequest = createBaseRequest(domainPrefix)

export const domainAdd = (params) =>{
  return domainRequest({
    url: `/add`,
    method: 'POST',
    data: params
  })
}

export const domainDel = (id) =>{
  return domainRequest({
    url: `/delete?id=${id}`,
    method: 'POST',
  })
}
export const domainList = () =>{
  return domainRequest({
    url: `/list`
  })
}
export const domainUpdate = (params) =>{
  return domainRequest({
    url: `/update`,
    method: 'POST',
    data: params
  })
}




