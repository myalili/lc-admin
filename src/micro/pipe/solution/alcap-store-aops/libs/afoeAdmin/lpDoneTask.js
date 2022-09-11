import { getField, updateField } from 'vuex-map-fields';
const { queryLpDoneTask } = window.getAopsApi();
const { getInvokeResponse,trimQueryParams,getDatetimeAfterStr,getDatetimeBeforeStr } = window.aopsUtils;

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
    // 查询我办理的归档流程实例
    async load({
      state: {
        page: { start, size },
        query: { processInstanceId, processDefinitionId, processInstanceNameLike, startTime, handleTime, clusterId }
      },
      commit
    }) {
      const queryParams = {
        pageNum: start,
        pageSize: size,
        createdAfter: getDatetimeAfterStr(startTime?.[0]),
        createdBefore: getDatetimeBeforeStr(startTime?.[1]),
        completedAfter: getDatetimeAfterStr(handleTime?.[0]),
        completedBefore: getDatetimeBeforeStr(handleTime?.[1]),
        processInstanceId,
        processDefinitionId,
        processDefinitionNameLike: processInstanceNameLike,
        clusterId: clusterId
      };
      trimQueryParams(queryParams);
      // 调用查询接口
      commit('setListLoading', true);
      try {
        const res = await getInvokeResponse(queryLpDoneTask(queryParams), '查询已办任务');
        commit('setList', res?.content ?? []);
        commit('setPageTotal', res?.totalElements ?? 0);
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
