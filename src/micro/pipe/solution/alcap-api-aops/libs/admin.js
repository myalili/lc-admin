// import axios from 'axios';
import qs from 'qs';

const admin_base = '/server/aops-admin';
let axios = window.axios;

// 查询流程管理（定义）列表
export function queryLpDefinition(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/repository/process-definitions?${qs.stringify(params)}`);
}

//完成审批(包括通过和驳回)
export function completeTask(clusterId, taskId, params) {
    return axios.post(`${axios.aops}${admin_base}/${clusterId}/runtime/tasks/${taskId}/complete`, params);
}

// 启动流程实例
export function startLpInstance(body) {
return axios.post(`${axios.aops}${admin_base}/aops-afoe/runtime/process-instances`, body);
}

// 查询流程定义启动表单
export function queryLpDefStartFormDef(clusterId, lpDefId) {
    return axios.get(`${axios.aops}${admin_base}/${clusterId}/repository/process-definitions/${lpDefId}/todo`);
}

// 获取流程定义示图XML
export function queryLpDefModelXml({ clusterId, procDefId }) {
    return axios.get(`${axios.aops}${admin_base}/${clusterId}/process-definitions/${procDefId}/model-xml`);
}

// 我的待办任务
export function queryLpTodoTask(params) {
   return axios.get(`${axios.aops}${admin_base}/aops-admin/runtime/tasks/current?${qs.stringify(params)}`);
}


// 领取待办任务
export function claimTask(clusterId, taskId) {
    return axios.put(`${axios.aops}${admin_base}/${clusterId}/tasks/${taskId}/action/claim`);
  }
  
// 查询任务表单
export function queryTaskFormDef(clusterId, taskId) {
    return axios.get(`${axios.aops}${admin_base}/${clusterId}/runtime/tasks/${taskId}/detail`);
}

// 查询实例模型xml
export function queryLpInstModelXml(clusterId, id) {
    return axios.get(`${axios.aops}${admin_base}/${clusterId}/process-instances/${id}/model-xml`);
  }
// 查询实例模型json
export function queryLpInstModelJson(clusterId, id) {
 return axios.get(`${axios.aops}${admin_base}/${clusterId}/process-instances/${id}/model-json`);
}
// 查询流程实例任务
export function queryLpInstTasks(clusterId, id) {
 return axios.get(`${axios.aops}${admin_base}/${clusterId}/process-instances/${id}/tasks`);
}
// 查询流程实例调用日志
export function queryLpInstCallLog(clusterId, id) {
 return axios.get(`${axios.aops}${admin_base}/${clusterId}/process-instances/call-log/${id}`);
}

// 转办任务
export function turnTask(clusterId, taskId, params) {
 return axios.put(`${axios.aops}${admin_base}/${clusterId}/tasks/${taskId}/action/turn`, params);
}

// 跟踪-我发起的
export function queryLpRuInstStartedByMe(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/runtime/process-instances/started-by-me?${qs.stringify(params)}`);
}
  
// 跟踪-抄送给我的
export function queryLpRuInstInvolvedMe(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/runtime/process-instances/involved-me?${qs.stringify(params)}`);
}

// 我的已办任务
export function queryLpDoneTask(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/history/tasks/current?${qs.stringify(params)}`);
}
// 归档-我发起的
export function queryLpHiInstStartedByMe(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/history/historic-process-instances/started-by-me?${qs.stringify(params)}`);
}

// 归档-抄送给我的
export function queryLpHiInstInvolvedMe(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/history/historic-process-instances/involved-me?${qs.stringify(params)}`);
}

// 查询流程实例
export function queryLpInstance(params) {
  return axios.get(`${axios.aops}${admin_base}/aops-admin/history/historic-process-instances?${qs.stringify(params)}`);
}

// 根据id查询实例
export function queryLpInstById(clusterId, lpInstId) {
  return axios.get(`${axios.aops}${admin_base}/${clusterId}/history/historic-process-instances/${lpInstId}`);
}
// 停止流程实例
export function stopLpInstById(clusterId, lpInstId) {
  return axios.delete(`${axios.aops}${admin_base}/${clusterId}/runtime/process-instances/${lpInstId}`);
}

//查询流程实例的任务列表
export function queryTasks(clusterId, lpInstId) {
  return axios.get(`${axios.aops}${admin_base}/${clusterId}/query/tasks?processInstanceId=${lpInstId}`);
}
// 查询流程实例的参数列表
export function queryVariables(clusterId, lpInstId) {
  return axios.get(`${axios.aops}${admin_base}/${clusterId}/history/historic-variable-instances/${lpInstId}`);
}

// 查询执行链路
export function queryLpInstTrace(clusterId, id) {
  return axios.get(`${axios.aops}${admin_base}/${clusterId}/process-instances/${id}/trace`);
}

// 部署流程定义
export function deployLpDef(clusterId, file) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${axios.aops}${admin_base}/${clusterId}/repository/deployments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 下载流程定义
export function downloadLpDef(clusterId, ids) {
  return axios.get(`${axios.aops}${admin_base}/${clusterId}/repository/process-definitions/download`, {
    params: { ids: ids.join(',') },
    responseType: 'blob',
    timeout: 600000
  });
}



