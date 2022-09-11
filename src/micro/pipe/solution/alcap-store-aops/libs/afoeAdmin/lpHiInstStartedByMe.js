import { getField, updateField } from 'vuex-map-fields';
const { queryLpHiInstStartedByMe } = window.getAopsApi();
// import { queryLpHiInstStartedByMe } from '@/api/workflowApi';
const { getInvokeResponse, trimQueryParams,getDatetimeAfterStr, getDatetimeBeforeStr } = window.aopsUtils;

const getDefaultQuery = () => ({
  processInstanceId: '',
  processDefinitionId: '',
  processInstanceNameLike: '',
  startTime: [],
  handleTime: [],
  clusterId: ''
});
const getDefaultPage = () => ({
  start: 0,
  size: 10,
  total: 0
});

export default {
  namespaced: true,
  state: {
    page: getDefaultPage(),
    query: getDefaultQuery(),
    list: [],
    listLoading: false
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    resetPage(state) {
      state.page = getDefaultPage();
    },
    resetQuery(state) {
      state.query = getDefaultQuery();
    },
    setList(state, list) {
      state.list = list;
    },
    setListLoading(state, listLoading) {
      state.listLoading = listLoading;
    },
    setPageTotal(state, total) {
      state.page.total = total;
    }
  },
  actions: {
    // 查询我发起的归档流程实例
    async load({
      state: {
        page: { start, size },
        query: { processInstanceId, processDefinitionId, processInstanceNameLike, startTime, handleTime, clusterId }
      },
      getters,
      commit
    }) {
      // 初始查询
      const queryParams = {
        start: start * size,
        size: size,
        startedAfter: getDatetimeAfterStr(startTime?.[0]),
        startedBefore: getDatetimeBeforeStr(startTime?.[1]),
        finishedAfter: getDatetimeAfterStr(handleTime?.[0]),
        finishedBefore: getDatetimeBeforeStr(handleTime?.[1]),
        processInstanceId: processInstanceId,
        processDefinitionId: processDefinitionId,
        processInstanceNameLike: processInstanceNameLike,
        clusterId: clusterId,
        order: 'desc',
        sort: 'startTime'
      };
      trimQueryParams(queryParams);
      // 调用查询接口
      commit('setListLoading', true);
      try {
        const res = await getInvokeResponse(queryLpHiInstStartedByMe(queryParams), '查询我发起的流程实例');
        commit('setList', res?.data ?? []);
        commit('setPageTotal', res?.total ?? 0);
        commit('setListLoading', false);
      } catch (err) {
        commit('setList', []);
        commit('setPageTotal', 0);
        commit('setListLoading', false);
        throw err;
      }
    }
  }
};
