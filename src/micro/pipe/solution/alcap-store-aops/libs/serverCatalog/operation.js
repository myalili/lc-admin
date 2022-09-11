import { getField, updateField } from 'vuex-map-fields';
const { queryOperationOnlineSummary, queryOperationDetailByDetailId } = window.getAopsApi();
const { getScResponse,trimQueryParams } = window.aopsUtils;

const getDefaultQuery = () => ({
  name: ''
});
const getDefaultPage = () => ({
  start: 0,
  size: 10,
  total: 0
});

export default {
  namespaced: true,
  state: {
    list: [],
    listLoading: false,
    page: getDefaultPage(),
    query: getDefaultQuery()
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    resetQuery(state) {
      state.query = getDefaultQuery();
    },
    resetPage(state) {
      state.page = getDefaultPage();
    },
    setList(state, list) {
      state.list = list;
    },
    setListLoading(state, loading) {
      state.listLoading = loading;
    },
    setPageTotal(state, total) {
      state.page.total = total;
    }
  },
  actions: {
    async load({ state, commit }) {
      commit('setListLoading', true);
      // 查询条件
      const queryParams = trimQueryParams({
        name: state.query.name,
        page: state.page.start,
        size: state.page.size
      });
      // 调用查询接口
      try {
        const res = await getScResponse(queryOperationOnlineSummary(queryParams));
        commit('setList', res?.pageData ?? []);
        commit('setPageTotal', res?.total ?? 0);
        commit('setListLoading', false);
      } catch (err) {
        commit('setList', []);
        commit('setPageTotal', 0);
        commit('setListLoading', false);
        throw err;
      }
    },
    async getList(state, { serviceId }) {
      return await getScResponse(queryOperationOnlineSummary(serviceId));
    },
    async getDetail(state, { detailId }) {
      return await getScResponse(queryOperationDetailByDetailId(detailId));
    }
  }
};
