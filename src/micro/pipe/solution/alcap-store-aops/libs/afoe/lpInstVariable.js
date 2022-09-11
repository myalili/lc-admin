import { getField, updateField } from 'vuex-map-fields';
const { queryVariables } = window.getAopsApi();
const { getInvokeResponse } = window.aopsUtils;

export default {
  namespaced: true,
  state: {
    list: [],
    listLoading: false
  },
  getters: { getField },
  mutations: {
    updateField,
    setList(state, list) {
      state.list = list;
    },
    setListLoading(state, listLoading) {
      state.listLoading = listLoading;
    }
  },
  actions: {
    async load({ commit }, { clusterId, lpInstId }) {
      // 调用查询接口
      commit('setListLoading', true);
      try {
        const res = await getInvokeResponse(queryVariables(clusterId, lpInstId), '获取变量');
        commit('setList', res?.data ?? []);
        commit('setListLoading', false);
      } catch (err) {
        commit('setList', []);
        commit('setListLoading', false);
        throw err;
      }
    }
  }
};
