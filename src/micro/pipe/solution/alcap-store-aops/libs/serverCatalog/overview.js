import { getField, updateField } from 'vuex-map-fields';
const { queryOverviewOnlinePage, queryOverviewById } = window.getAopsApi();
const { getScResponse,trimQueryParams } = window.aopsUtils;

const getDefaultQuery = () => ({
  name: '',
  systemName: ''
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
      const query = trimQueryParams({
        page: state.page.start,
        size: state.page.size
      });
      const reqBody = trimQueryParams({
        name: state.query.name,
        cnName: state.query.name,
        systemName: state.query.systemName
      });
      // 调用查询接口
      try {
        const res = await getScResponse(queryOverviewOnlinePage(query, reqBody));
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
    async getItem(state, { id }) {
      return await getScResponse(queryOverviewById(id));
    }
  }
};
