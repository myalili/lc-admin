// const { queryOnlineSummary } = window.getAopsApi();
// const { getScResponse } = window.aopsUtils;

export default {
  namespaced: true,
  state: {
    list: [],
    listLoading: false
  },
  mutations: {
    setList(state, list) {
      state.list = list;
    },
    setListLoading(state, loading) {
      state.listLoading = loading;
    }
  },
  actions: {
    async load({ commit }) {
      commit('setListLoading', true);
      try {
        // const res = await getScResponse(queryOnlineSummary());
        // commit('setList', res ?? []);
        commit('setList', []);
        commit('setListLoading', false);
      } catch (err) {
        commit('setList', []);
        commit('setListLoading', false);
        throw err;
      }
    }
  }
};
