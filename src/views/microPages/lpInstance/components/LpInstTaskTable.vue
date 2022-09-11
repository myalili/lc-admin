<template>
  <el-table :data="list" v-loading="listLoading" style="width:100%">
    <el-table-column prop="id" label="任务ID" sortable show-overflow-tooltip />
    <el-table-column prop="name" label="名称" sortable show-overflow-tooltip />
    <el-table-column prop="assignee" label="处理人" sortable show-overflow-tooltip />
    <el-table-column prop="created" label="创建时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.created | date }}</template>
    </el-table-column>
    <el-table-column prop="endDate" label="结束时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.endDate | date }}</template>
    </el-table-column>
    <el-table-column prop="description" label="描述" sortable show-overflow-tooltip />

  </el-table>
</template>

<script>
const moduleName = 'lpInstTask';
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
