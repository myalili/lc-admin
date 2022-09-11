// export const aopsName = 'AOPS_BETA';

export const defaultRule = {
  required: true,
  message: '请输入',
  trigger: 'blur'
};

// export const tenantOwnerRoleName = '租户所有者';

// export const superAdminMenus = [
//   {
//     id: 'aops_authCenter',
//     name: 'authCenter',
//     title: '认证中心',
//     parentId: null,
//     icon: '',
//     path: null,
//     order: 40,
//     status: null,
//     url: null,
//     type: aopsName
//   },
//   {
//     id: 'aops_tenant',
//     name: 'tenantAdmin',
//     title: '租户管理',
//     parentId: 'aops_authCenter',
//     icon: '',
//     path: null,
//     order: 1,
//     status: null,
//     url: null,
//     type: aopsName
//   },
//   {
//     id: 'aops_user',
//     name: 'user',
//     title: '用户管理',
//     parentId: 'aops_authCenter',
//     icon: '',
//     path: null,
//     order: 2,
//     status: null,
//     url: null,
//     type: aopsName
//   },
//   {
//     id: 'aops_role',
//     name: 'role',
//     title: '角色管理',
//     parentId: 'aops_authCenter',
//     icon: '',
//     path: null,
//     order: 3,
//     status: null,
//     url: null,
//     type: aopsName
//   }
// ];

export const taskListenerClass = {
  micro: 'cn.com.agree.aops.afoe.services.flowable.listener.HttpClientTaskListener',
  http: 'cn.com.agree.aops.afoe.services.flowable.listener.HttpClientDirectTaskListener',
  amq: 'cn.com.agree.aops.afoe.services.flowable.listener.AmqSendServiceTaskListener'
};

export const executionListenerClass = {
  micro: 'cn.com.agree.aops.afoe.services.flowable.listener.HttpClientExecutionListener',
  http: 'cn.com.agree.aops.afoe.services.flowable.listener.HttpClientDirectExecutionListener',
  amq: 'cn.com.agree.aops.afoe.services.flowable.listener.AmqSendServiceExecutionListener'
};

export const serviceTaskClass = {
  micro: 'cn.com.agree.aops.afoe.services.flowable.task.HttpClientServiceTaskDelegate',
  http: 'cn.com.agree.aops.afoe.services.flowable.task.HttpClientDirectServiceTaskDelegate',
  amq: 'cn.com.agree.aops.afoe.services.flowable.task.AmqSendServiceTaskDelegate'
};

// 短流程http服务任务
// export const asoeServiceTaskHttpClass = 'cn.com.agree.aops.asoe.services.engine.delegate.HttpClientServiceTaskDelegate';
// export const asoeServiceTaskAHttpClass = 'cn.com.agree.aops.asoe.services.engine.delegate.AhttpClientServiceTaskDelegate';