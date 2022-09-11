import { getField, updateField } from 'vuex-map-fields';
const {
  queryLongProcess,
  batchDeleteLongProcess,
  publishLongProcess,
  batchPublishLongProcess,
  queryLongProcessHistory
} = window.getAopsApi();
const { getChoreResponse,trimQueryParams,getDefaultPage } = window.aopsUtils;

const getDefaultQuery = () => ({
  id: '',
  idNot: '',
  name: '',
  updateUserName: '',
  timeRange: [],
  idOrNameLike: ''
});

export function getStore() {
  return {
    namespaced: true,
    state: {
      list: [],
      listLoading: false,
      query: getDefaultQuery(),
      page: getDefaultPage(),
      sortConfig: null
    },
    getters: {
      getField,
      startTime(state) {
        let start = state.query.timeRange?.[0];
        if (start) {
          start = Number(start);
        }
        return start;
      },
      endTime(state) {
        let end = state.query.timeRange?.[1];
        if (end) {
          end = Number(end);
        }
        return end;
      },
      sorts(state) {
        const config = state.sortConfig;
        if (!config || !config.order) {
          return undefined;
        }
        const sorts = {};
        if (config.order.includes('asc')) {
          sorts[config.prop] = 'asc';
        } else {
          sorts[config.prop] = 'desc';
        }
        return sorts;
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
      // 查询长流程
      async load({ state, getters, commit }) {
        const { id, idNot, name, idOrNameLike, updateUserName } = state.query;
        const { start, size } = state.page;
        const { sorts, startTime, endTime } = getters;
        const queryParams = { start, size, sorts, id, idNot, name, idOrNameLike, updateUserName, startTime, endTime };
        trimQueryParams(queryParams);
        commit('setListLoading', true);
        try {
          const res = await getChoreResponse(queryLongProcess(queryParams), '查询长流程');
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
      // 批量删除
      async batchDelete(context, ids) {
        return await getChoreResponse(batchDeleteLongProcess(ids), '批量删除');
      },
      // 发布
      async publish(context, { clusterId, id ,catalogId}) {
        return await getChoreResponse(publishLongProcess(clusterId, id,catalogId));
      },
      // 批量发布
      async batchPublish(context, { clusterId, ids }) {
        return await getChoreResponse(batchPublishLongProcess(clusterId, ids.join(',')), '批量发布');
      },
      async getHisitory(context, { id, params }) {
        return await getChoreResponse(queryLongProcessHistory(id, params));
      }
    }
  };
}

export default getStore();
