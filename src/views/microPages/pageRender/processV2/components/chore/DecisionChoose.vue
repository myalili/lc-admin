<template>
  <el-container class="api-choose" v-loading="decisionsLoading">
    <el-main style="min-height:300px;max-height:400px">
      <el-table :data="decisions" :current-row-key="(selected || {}).id" @row-click="row => (selected = row)">
        <el-table-column label="" width="40" align="center">
          <template slot-scope="scope">
            <el-radio :value="(selected || {}).id" :label="scope.row.id" class="radio-table-column">{{ undefined }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="决策表ID"></el-table-column>
        <el-table-column prop="name" label="决策表名称"></el-table-column>
        <el-table-column prop="content" label="描述" width="130"></el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        :current-page="start + 1"
        :page-size="size"
        :total="total"
        @current-change="handleCurrentChange"
        style="float:right;margin-top:10px"
      ></el-pagination>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
const { queryDecision } = window.getAopsApi();


export default {
  name: 'DecisionChoose',
  mixins:[window.V8.mixins],
  data() {
    return {
      start: 0,
      size: 10,
      total: 0,
      decisions: [],
      decisionsLoading: false,
      selected: null
    };
  },
  methods: {
    async loadDecisions() {
      this.decisionsLoading = true;
      const res = await this.aopsChoreRequest(
        queryDecision({
          start: this.start,
          size: this.size
        }),
        '查询决策表'
      );
      this.decisions = res?.content ?? [];
      this.total = res?.totalElements ?? [];
      this.decisionsLoading = false;
    },
    // 改变 页码
    handleCurrentChange(start) {
      this.start = start - 1;
      this.loadDecisions();
    },
    handleConfirm() {
      if (!this.selected) {
        this.$message({ message: '请选择', type: 'warning' });
        return;
      }
      this.$root.confirm(this.selected)
      // this.$store.commit('callback', { name: 'confirm', arg: this.selected });
      // this.close();
    }
  },
  mounted() {
    this.loadDecisions();
  }
};
</script>