// import axios from 'axios';
import qs from 'qs';

const portal_long = '/server/aops-portal-long';

let axios = window.axios;
// 新增流程
export function addLongProcess(params) {
 return axios.post(`${axios.aops}${portal_long}/long-process`, params);
}

// 查询流程列表
export function queryLongProcess(params) {
    if(params){
      return axios.get(`${axios.aops}${portal_long}/long-process/list?${qs.stringify(params)}`);
    }else{
      return axios.get(`${axios.aops}${portal_long}/long-process/list`);
    }
  }

// 根据id和version查询, version不传时查询最新版本
export function queryLongProcessByIdAndVersion(id, version) {
    return axios.get(`${axios.aops}${portal_long}/long-process/${id}${version ? '/' + version : ''}`);
  }
  
  // 修改流程
  export function updateLongProcess(id, params) {
    return axios.put(`${axios.aops}${portal_long}/long-process/${id}`, params);
  }
  
  // 更新流程为新版本
  export function updateLongProcessAsNewVersion(id, params) {
    return axios.put(`${axios.aops}${portal_long}/long-process/update-as-new-version/${id}`, params);
  }
  
// 批量删除
export function batchDeleteLongProcess(ids) {
    return axios['delete'](`${axios.aops}${portal_long}/long-process?ids=${ids.join(',')}`);
  }
  
  // 批量发布流程
  export function batchPublishLongProcess(clusterId, ids) {
      
    return axios.post(`${axios.aops}${portal_long}/long-process/publish`, qs.stringify({ clusterId, ids }));
  }
  
  // 发布流程
  export function publishLongProcess(clusterId,id,catalogId) {
    return axios.post(`${axios.aops}${portal_long}/long-process/publish/${id}`, qs.stringify({ clusterId,catalogId }));
  }
  
  // 查询流程历史
  export async function queryLongProcessHistory(id, params) {
    return axios.get(`${axios.aops}${portal_long}/long-process/${id}/history?${qs.stringify(params)}`);
  }

  export function querySystemApis(params) {
    return axios.get(`${axios.aops}${portal_long}/external/system-api?${qs.stringify(params)}`);
  }
  
  // export function addSystemApi(api) {
  //   return axios.post(`${portal_long}/external/system-api`, api);
  // }
  
  // export function updateSystemApi(api) {
  //   return axios.put(`${portal_long}/external/system-api`, api);
  // }
  
  export function deleteSystemApi(id) {
    return axios['delete'](`${axios.aops}${portal_long}/external/system-api/${id}`);
  }
  
  export function querySystemApiResp(id, params) {
    return axios.post(`${axios.aops}${portal_long}/external/system-api/execute-api/${id}`, params);
  }
  
 
  // 查询
  export function queryDecision(params) {
    return axios.get(`${axios.aops}${portal_long}/decisions?${qs.stringify(params)}`);
  }