import { getField, updateField } from 'vuex-map-fields';
const {
  getTenantList,
  addTenant,
  createOwner,
  relateOwner,
  modifyTenant,
  deleteTenant,
  relateUser,
  getRelatedUser,
  getRoleListByTenantId
} = window.getAacApi();
// import {
//   queryTenants,
//   addTenant,
//   addTenantOwner,
//   relateTenantOwner,
//   updateTenant,
//   deleteTenant,
//   tenantRelateUser,
//   queryTenantUsers,
//   queryTenantRoles
// } from '@/api/authApi';
// import { getAuthResponse } from '@/utils/response';
const { trimQueryParams } = window.aopsUtils;

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
        // const res = await getAuthResponse(queryTenants(queryParams));
        const res = await getTenantList(queryParams)
        console.log(res);
        commit('setList', (pageable ? res?.pageData : res) ?? []);
        commit('setPageTotal', (pageable ? res?.total : res?.length) ?? 0);
        commit('setListLoading', false);
      } catch (err) {
        commit('setList', []);
        commit('setPageTotal', 0);
        commit('setListLoading', false);
        throw err;
      }
    },
    async add(context, tenant) {
      // await getAuthResponse(addTenant(tenant), '新增');
      await addTenant(tenant);
    },
    async addOwner(context, { id, user }) {
      // await getAuthResponse(addTenantOwner(id, user), '新增所有者');
      await createOwner(id, user);
    },
    async relateOwner(context, { id, userId }) {
      // await getAuthResponse(relateTenantOwner(id, userId), '关联所有者');
      await relateOwner(id, userId);
    },
    async update(context, { id, tenant }) {
      // await getAuthResponse(updateTenant(id, tenant), '修改');
      await modifyTenant({
        id,
        ...tenant
      });
    },
    async delete(context, id) {
      // await getAuthResponse(deleteTenant(id), '删除');
      await deleteTenant(id);
    },
    async relateUser(context, { id, userIds }) {
      // await getAuthResponse(tenantRelateUser(id, userIds), '关联用户');
      await relateUser(id, userIds);
    },
    async getTenantUsers(context, { id, params }) {
      // return await getAuthResponse(queryTenantUsers(id, trimQueryParams(params)));
      return await getRelatedUser(id, params);
    },
    async getTenantRoles(context, { id, params }) {
      // return await getAuthResponse(queryTenantRoles(id, trimQueryParams(params)));
      return await getRoleListByTenantId(id, params);
    }
  }
};
