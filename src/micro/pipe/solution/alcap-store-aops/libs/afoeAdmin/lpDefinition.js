import { getField, updateField } from 'vuex-map-fields';
const { queryLpDefinition } = window.getAopsApi();
const { getInvokeResponse,trimQueryParams } = window.aopsUtils;

const getDefaultQuery = () => ({
  name: '',
  key: '',
  latest: true,
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
    listLoading: false,
    downloading: false
  },
  getters: {
    getField,
    queryNameLike(state) {
      let nameLike = state.query.name?.trim();
      if (nameLike) {
        return `%${nameLike}%`;
      }
      return undefined;
    },
    queryKeyLike(state) {
      let keyLike = state.query.key?.trim();
      if (keyLike) {
        return `%${keyLike}%`;
      }
      return undefined;
    }
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
    setDownloading(state, downloading) {
      state.downloading = downloading;
    },
    setPageTotal(state, total) {
      state.page.total = total;
    },
    updatePublishStatus(state, data) {
      for(let i = 0; i < state.list.length; i++) {
        state.list[i].published = false;
        for(let item of data) {
          if(item.procDefId === state.list[i].id && item.clusterId === state.list[i].clusterId) {
            state.list[i].published = true;
          }
        }
      }    
    }
  },
  actions: {
    async load({ state, getters, commit }) {
      const queryParams = {
        start: state.page.start,
        size: state.page.size,
        nameLike: getters.queryNameLike,
        keyLike: getters.queryKeyLike,
        latest: state.query.latest,
        clusterId: state.query.clusterId,
        order: 'desc',
        sort: 'id'
      };
      trimQueryParams(queryParams);
      // 调用查询接口
      commit('setListLoading', true);
      try {
        const res = await getInvokeResponse(queryLpDefinition(queryParams), '查询流程管理列表');
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
