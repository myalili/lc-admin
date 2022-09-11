import { getField, updateField } from 'vuex-map-fields';
const { queryLpRuInstInvolvedMe } = window.getAopsApi();
const { getInvokeResponse,trimQueryParams, getLikeStr, getDatetimeAfterStr, getDatetimeBeforeStr } =window.aopsUtils;

const getDefaultQuery = () => ({
  id: '',
  processDefinitionId: '',
  name: '',
  timeRange: [],
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
    // 查询我发起的跟踪流程实例
    async load({
      state: {
        page: { start, size },
        query: { id, processDefinitionId, name, timeRange, clusterId }
      },
      commit
    }) {
      const queryParams = {
        start: start * size,
        size: size,
        processInstanceId: id,
        processDefinitionId: processDefinitionId,
        processInstanceNameLike: getLikeStr(name),
        clusterId: clusterId,
        startedAfter: getDatetimeAfterStr(timeRange?.[0]),
        startedBefore: getDatetimeBeforeStr(timeRange?.[1])
      };
      trimQueryParams(queryParams);
      // 调用查询接口
      commit('setListLoading', true);
      try {
        
        const res = await getInvokeResponse(queryLpRuInstInvolvedMe(queryParams), '查询抄送给我的流程实例');
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
