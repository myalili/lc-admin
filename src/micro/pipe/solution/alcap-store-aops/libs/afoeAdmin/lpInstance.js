import { getField, updateField } from 'vuex-map-fields';
const { queryLpInstance } = window.getAopsApi();
const { getInvokeResponse,trimQueryParams, getLikeStr, getDatetimeAfterStr, getDatetimeBeforeStr } = window.aopsUtils;
// import { trimQueryParams, getLikeStr, getDatetimeAfterStr, getDatetimeBeforeStr } from '@/utils';

const getDefaultQuery = () => ({
  processInstanceId: '',
  processDefinitionId: '',
  processInstanceNameLike: '',
  processInstanceStatus: '',
  processBusinessKeyLike: '',
  startUserId: '',
  startTime: [],
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
  getters: { getField },
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
    async load({ state, commit }) {
      const {
        processInstanceId,
        processDefinitionId,
        processInstanceNameLike,
        processInstanceStatus,
        processBusinessKeyLike,
        startUserId,
        startTime,
        clusterId
      } = state.query;
      const { start, size } = state.page;
      const queryParams = {
        start: start * size,
        size: size,
        startedAfter: getDatetimeAfterStr(startTime?.[0]),
        startedBefore: getDatetimeBeforeStr(startTime?.[1]),
        processInstanceId,
        processDefinitionId,
        processBusinessKeyLike: getLikeStr(processBusinessKeyLike),
        processInstanceNameLike: getLikeStr(processInstanceNameLike),
        clusterId,
        startedBy: startUserId,
        order: 'desc',
        sort: 'startTime'
      };
      if (processInstanceStatus === 'finished') {
        queryParams.finished = true;
      } else if (processInstanceStatus === 'running') {
        queryParams.finished = false;
      }
      trimQueryParams(queryParams);
      // 调用查询接口
      commit('setListLoading', true);
      try {
        const res = await getInvokeResponse(queryLpInstance(queryParams), '查询流程实例');
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
