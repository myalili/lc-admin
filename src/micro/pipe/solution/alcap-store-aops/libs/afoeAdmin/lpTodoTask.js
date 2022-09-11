import { getField, updateField } from 'vuex-map-fields';
const { queryLpTodoTask,claimTask,queryTaskFormDef,completeTask,turnTask} = window.getAopsApi();
const { getInvokeResponse,trimQueryParams, getDatetimeAfterStr, getDatetimeBeforeStr } = window.aopsUtils;

const getDefaultQuery = () => ({
  insID: '',
  defID: '',
  startman: '',
  startTime: '',
  clusterId: undefined,
  processDefinitionNameLike:''
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
    // updateField,
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
    },
    setProcessDefinitionNameLike(state, str){
      state.query.processDefinitionNameLike = str
    }
  },
  actions: {
    async load({
      state: {
        page: { start, size },
        query: { insID, defID, startman, startTime, clusterId,processDefinitionNameLike}
      },
      commit
    }) {
      let queryParams = {
        pageNum: start,
        pageSize: size,
        processInstanceId: insID,
        processDefinitionId: defID,
        startUserId: startman,
        clusterId: clusterId,
        processDefinitionNameLike:processDefinitionNameLike,
        createdAfter: getDatetimeAfterStr(startTime?.[0]),
        createdBefore: getDatetimeBeforeStr(startTime?.[1])
      };
      trimQueryParams(queryParams);
      // 调用查询接口
      commit('setListLoading', true);
      try {
        const res = await getInvokeResponse(queryLpTodoTask(queryParams));
        commit('setList', res?.content ?? []);
        commit('setPageTotal', res?.totalElements ?? 0);
        commit('setListLoading', false);
      } catch (err) {
        commit('setList', []);
        commit('setPageTotal', 0);
        commit('setListLoading', false);
        throw err;
      }
    },
    async claim(context, { clusterId, taskId }) {
      return await getInvokeResponse(claimTask(clusterId, taskId));
    },
    async getFormDef(context, { clusterId, taskId }) {
      return await getInvokeResponse(queryTaskFormDef(clusterId, taskId));
    },
    async complete(context, { clusterId, taskId, params }) {
      return await getInvokeResponse(completeTask(clusterId, taskId, params));
    },
    async turn(context, { clusterId, taskId, params }) {
      return await getInvokeResponse(turnTask(clusterId, taskId, params));
    }
  }
};
