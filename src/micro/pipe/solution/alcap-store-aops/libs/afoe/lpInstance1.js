// import { getField, updateField } from 'vuex-map-fields';
const {
    // queryLpInstance,
    queryLpInstModelXml,
    queryLpInstModelJson,
    queryLpInstTasks,
    queryLpInstCallLog,
    queryLpInstTrace,
    queryLpInstById,
    stopLpInstById,
    // addLpInst
  } = window.getAopsApi();
  const { getInvokeResponse } = window.aopsUtils;
  // import { trimQueryParams, getLikeStr, getDatetimeAfterStr, getDatetimeBeforeStr } from '@/utils';
  
  // const getDefaultQuery = () => ({
  //   processInstanceId: '',
  //   processDefinitionId: '',
  //   processInstanceNameLike: '',
  //   processInstanceStatus: '',
  //   processBusinessKeyLike: '',
  //   startUserId: '',
  //   startTime: []
  // });
  // const getDefaultPage = () => ({
  //   start: 0,
  //   size: 10,
  //   total: 0
  // });
  
  export default {
    namespaced: true,
    // state: {
    //   page: getDefaultPage(),
    //   query: getDefaultQuery(),
    //   list: [],
    //   listLoading: false
    // },
    // getters: { getField },
    mutations: {
      // updateField,
      // resetPage(state) {
      //   state.page = getDefaultPage();
      // },
      // resetQuery(state) {
      //   state.query = getDefaultQuery();
      // },
      // setList(state, list) {
      //   state.list = list;
      // },
      // setListLoading(state, listLoading) {
      //   state.listLoading = listLoading;
      // },
      // setPageTotal(state, total) {
      //   state.page.total = total;
      // }
    },
    actions: {
      // async load({ state, commit }, clusterId) {
      //   const {
      //     processInstanceId,
      //     processDefinitionId,
      //     processInstanceNameLike,
      //     processInstanceStatus,
      //     processBusinessKeyLike,
      //     startUserId,
      //     startTime
      //   } = state.query;
      //   const { start, size } = state.page;
      //   const queryParams = {
      //     start: start * size,
      //     size,
      //     startedAfter: getDatetimeAfterStr(startTime?.[0]),
      //     startedBefore: getDatetimeBeforeStr(startTime?.[1]),
      //     processInstanceId,
      //     processDefinitionId,
      //     processBusinessKeyLike: getLikeStr(processBusinessKeyLike),
      //     processInstanceNameLike: getLikeStr(processInstanceNameLike),
      //     startedBy: startUserId,
      //     order: 'desc',
      //     sort: 'startTime'
      //   };
      //   if (processInstanceStatus === 'finished') {
      //     queryParams.finished = true;
      //   } else if (processInstanceStatus === 'running') {
      //     queryParams.finished = false;
      //   }
      //   trimQueryParams(queryParams);
      //   // ??????????????????
      //   commit('setListLoading', true);
      //   try {
      //     const res = await getInvokeResponse(queryLpInstance(clusterId, queryParams), '??????????????????');
      //     commit('setList', res?.data ?? []);
      //     commit('setPageTotal', res?.total ?? 0);
      //     commit('setListLoading', false);
      //   } catch (err) {
      //     commit('setList', []);
      //     commit('setPageTotal', 0);
      //     commit('setListLoading', false);
      //     throw err;
      //   }
      // },
      async loadItem({ commit }, { clusterId, lpInstId }) {
        return await getInvokeResponse(queryLpInstById(clusterId, lpInstId), '????????????');
      },
      async stopItem({ commit }, { clusterId, lpInstId }) {
        return await getInvokeResponse(stopLpInstById(clusterId, lpInstId), '??????????????????');
      },
      async getModelXml(context, { clusterId, lpInstId }) {
        return await getInvokeResponse(queryLpInstModelXml(clusterId, lpInstId), '????????????xml');
      },
      async getModelJson(context, { clusterId, lpInstId }) {
        return await getInvokeResponse(queryLpInstModelJson(clusterId, lpInstId), '????????????JSON');
      },
      async getCallLogs(context, { clusterId, lpInstId }) {
        return await getInvokeResponse(queryLpInstCallLog(clusterId, lpInstId), '????????????????????????');
      },
      async getTrace(context, { clusterId, lpInstId }) {
        return await getInvokeResponse(queryLpInstTrace(clusterId, lpInstId), '????????????????????????');
      },
      // async add(context, { clusterId, lpDefId, variables, involvedUsers, businessKey }) {
      //   return await getInvokeResponse(addLpInst(clusterId, lpDefId, variables, involvedUsers, businessKey));
      // },
      async getTasks(context, { clusterId, lpInstId }) {
        return await getInvokeResponse(queryLpInstTasks(clusterId, lpInstId), '??????????????????');
      }
    }
  };
  