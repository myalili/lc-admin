import { getField, updateField } from 'vuex-map-fields';
const { querySystemApis, deleteSystemApi } = window.getAopsApi();
const { getChoreResponse } = window.aopsUtils;
const getDefaultQuery = () => ({
  id: '',
  name: ''
});
const getDefaultPage = () => ({
  total: 0,
  start: 1,
  size: 10
});

export default {
  namespaced: true,
  state: {
    list: [],
    listLoading: false,
    query: getDefaultQuery(),
    page: getDefaultPage()
  },
  getters: {
    getField,
    queryParams(state) {
      let params = {
        id: state.query.id,
        name: state.query.name,
        page: state.page.start - 1,
        size: state.page.size
      };
      // 去掉前后空格
      Object.keys(params).forEach(key => {
        if (typeof params[key] === 'string') {
          params[key] = params[key].trim() || undefined;
        }
      });
      delete params['total'];
      return params;
    }
  },
  mutations: {
    updateField,
    resetQuery(state) {
      state.query = getDefaultQuery();
    },
    resetPage(state) {
      state.page = getDefaultPage();
    },
    setListLoading(state, loading) {
      state.listLoading = loading;
    },
    setSystemApis(state, items) {
      state.list = items;
    },
    setPageTotal(state, total) {
      state.page.total = total;
    }
  },
  actions: {
    async load({ getters, commit }) {
      commit('setListLoading', true);
      try {
        const res = await getChoreResponse(querySystemApis(getters.queryParams), '获取数据');
        commit('setSystemApis', res?.content ?? []);
        commit('setPageTotal', res?.totalElements ?? 0);
        commit('setListLoading', false);
      } catch (err) {
        commit('setSystemApis', []);
        commit('setPageTotal', 0);
        commit('setListLoading', false);
        throw err;
      }
    },
    async delete({ dispatch }, id) {
      await getChoreResponse(deleteSystemApi(id));
    }
  }
};
