// import { getField, updateField } from 'vuex-map-fields';
// import {
//   downloadLpDef,
//   queryLpDefinition,
//   activateOrSuspend,
//   queryLpDefStartFormDef,
//   queryLpDefModelXml,
//   deployLpDef,
//   queryLpContentSuspended,
//   queryLpDefForms
// } from '@/api/workflowApi';
 const { getInvokeResponse } =window.aopsUtils;
// const getDefaultQuery = () => ({
//   name: '',
//   key: '',
//   latest: true
// });
// const getDefaultPage = () => ({
//   start: 0,
//   size: 10,
//   total: 0
// });
const {queryLpDefModelXml,deployLpDef,downloadLpDef} = window.getAopsApi()

export function getStore() {
  return {
    namespaced: true,
    state: {
      // page: getDefaultPage(),
      // query: getDefaultQuery(),
      // list: [],
      // listLoading: false,
      downloading: false
    },
    getters: {
      // getField,
      // queryNameLike(state) {
      //   let nameLike = state.query.name?.trim();
      //   if (nameLike) {
      //     return `%${nameLike}%`;
      //   }
      //   return undefined;
      // },
      // queryKeyLike(state) {
      //   let keyLike = state.query.key?.trim();
      //   if (keyLike) {
      //     return `%${keyLike}%`;
      //   }
      //   return undefined;
      // }
    },
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
      setDownloading(state, downloading) {
        state.downloading = downloading;
      },
      // setPageTotal(state, total) {
      //   state.page.total = total;
      // }
    },
    actions: {
      // async load({ state, getters, commit }, clusterId) {
      //   const queryParams = {
      //     start: state.page.size * state.page.start,
      //     size: state.page.size,
      //     nameLike: getters.queryNameLike,
      //     keyLike: getters.queryKeyLike,
      //     latest: state.query.latest,
      //     order: 'desc',
      //     sort: 'id'
      //   };
      //   trimQueryParams(queryParams);
      //   // 调用查询接口
      //   commit('setListLoading', true);
      //   try {
      //     const res = await getInvokeResponse(queryLpDefinition(clusterId, queryParams), '查询流程定义');
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
      async download({ commit }, { clusterId, ids }) {
        commit('setDownloading', true);
        const res = await downloadLpDef(clusterId, ids);
        commit('setDownloading', false);
        return res;
      },
      // async activateOrSuspend({ commit }, { clusterId, procDefId, action }) {
      //   // 激活、挂起
      //   return await getInvokeResponse(activateOrSuspend(clusterId, procDefId, action));
      // },
      async getModelXml(context, { clusterId, procDefId }) {
        // console.log(111111)
        return await getInvokeResponse(queryLpDefModelXml({ clusterId, procDefId }), '获取流程定义视图xml');
      },
      // async getStartFormDef(context, { clusterId, lpDefId }) {
      //   return await getInvokeResponse(queryLpDefStartFormDef(clusterId, lpDefId));
      // },
      async deploy(context, { clusterId, file }) {
        return await getInvokeResponse(deployLpDef(clusterId, file));
      },
      // async getLpDefSuspended(context, { ids, clusterIds }) {
      //   return await getInvokeResponse(queryLpContentSuspended(ids, clusterIds));
      // },
      // async getLpDefForms(context, { clusterId, procDefId }) {
      //   return await getInvokeResponse(queryLpDefForms(procDefId, clusterId));
      // }
    }
  };
}

const defaultStore = getStore();

export default defaultStore;
