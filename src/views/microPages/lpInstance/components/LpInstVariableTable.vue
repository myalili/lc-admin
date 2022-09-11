<template>
  <el-table :data="list" v-loading="listLoading" style="width:100%">
    <el-table-column prop="name" label="名称" sortable show-overflow-tooltip />
    <el-table-column prop="type" label="类型" sortable show-overflow-tooltip />
    <el-table-column prop="value" label="值" sortable show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.value }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
const moduleName = 'lpInstVariable';
import { mapState, mapActions } from 'vuex';

export default {
  store:window.aopsStore,
  props: {
    lpInstId: {
      type: String,
      require: true
    },
    clusterId: {
      type: String,
      require: true
    }
  },
  computed: {
    ...mapState(moduleName, ['list', 'listLoading'])
  },
  created() {
    this.loadList();
  },
  methods: {
    ...mapActions(moduleName, ['load']),
    async loadList() {
      try {
        await this.load({ clusterId: this.clusterId, lpInstId: this.lpInstId });
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    }
  }
};
</script>
