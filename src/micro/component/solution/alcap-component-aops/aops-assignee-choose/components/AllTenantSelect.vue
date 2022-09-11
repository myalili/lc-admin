<template>
  <el-select v-model="id" v-bind="$attrs">
    <div v-loading="listLoading">
      <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.name + '(' + item.id + ')'" />
      <el-pagination
        small
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="start + 1"
        :page-size="size"
        :total="total"
      />
    </div>
  </el-select>
</template>

<script>
const moduleName = 'tenant';

import { mapState, mapActions, mapMutations } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`
});
export default {
  store:window.aopsStore,
  props: {
    value: String
  },
  data() {
    return {
      id: this.value
    };
  },
  computed: {
    ...mapState(moduleName, ['list', 'listLoading', 'query', 'page']),
    ...mapFields(['query.name', 'page.start', 'page.size', 'page.total']),
    currTenant() {
      const tenant = this.list.filter(item => item.id === this.id)[0];
      if (tenant) {
        return { id: tenant.id, name: tenant.name };
      }
      return undefined;
    }
  },
  created() {
    this.resetQuery();
    this.resetPage();
    this.loadList();
  },
  watch: {
    value(val) {
      this.id = val;
    },
    id(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    ...mapMutations(moduleName, ['resetQuery', 'resetPage']),
    ...mapActions(moduleName, ['load', 'delete']),
    async loadList() {
      try {
        await this.load({ pageable: true });
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
    },
    handleSearch() {
      this.start = 0;
      this.loadList();
    },
    handleSizeChange(size) {
      this.start = 0;
      this.size = size;
      this.loadList();
    },
    handleCurrentChange(start) {
      this.start = start - 1;
      this.loadList();
    }
  }
};
</script>
