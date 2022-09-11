import { getField, updateField } from 'vuex-map-fields';
const { querySystems } = window.getAacApi();
const { getAuthResponse,trimQueryParams} = window.aopsUtils;

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
    async load({ state, commit }, { pageable }) {
      commit('setListLoading', true);
      // 查询条件
      const queryParams = trimQueryParams({
        name: state.query.name
      });
      if (pageable) {
        queryParams.pageNum = state.page.start + 1;
        queryParams.pageSize = state.page.size;
      }
      // 调用查询接口
      try {
        const res = await getAuthResponse(querySystems(queryParams));
        commit('setList', (pageable ? res?.pageData : res) ?? []);
        commit('setPageTotal', (pageable ? res?.total : res?.length) ?? 0);
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
