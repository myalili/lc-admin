<template>
  <el-container class="lp-def-choose" v-loading="listLoading">
    <el-main style="padding:10px 20px">
      <el-form inline>
        <el-form-item label="流程名称:">
          <el-input v-model="name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="流程ID:">
          <el-input v-model="id" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item style="margin-left:10px;">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableList"
        :current-row-key="(selected || {}).id"
        @row-click="row => (selected = row)"
        border
        row-key="id"
        lazy
        :load="loadHistory"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column width="80" align="left">
          <template slot-scope="scope">
            <el-radio :value="(selected || {}).id" :label="scope.row.id" class="radio-table-column" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="流程名称" width="150" show-overflow-tooltip />
        <el-table-column prop="id" label="流程ID" width="150" show-overflow-tooltip />
        <el-table-column prop="version" label="版本" width="80">
          <template slot-scope="scope">
            <span>V{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
      </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        :current-page="start + 1"
        :page-size="size"
        :total="total"
        @current-change="handleCurrentChange"
        style="float:right;margin-top:10px"
      />
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
const moduleName = 'longProcess';
import { mapState, mapActions, mapMutations } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`
});

export default {
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  data() {
    return {
      selected: null
    };
  },
  computed: {
    ...mapState(moduleName, ['list', 'listLoading']),
    ...mapFields(['page.start', 'page.size', 'page.total', 'query.name', 'query.id', 'query.idNot']),
    tableList() {
      return this.list?.map(item => ({
        ...item,
        hasChildren: this.AParams.showHistory && item.version !== '0.0.1'
      }));
    }
  },
  created() {
    this.resetPage();
    this.resetQuery();
    this.loadList();
  },
  methods: {
    ...mapMutations(moduleName, ['resetQuery', 'resetPage']),
    ...mapActions(moduleName, ['load', 'getHisitory']),
    handleConfirm() {
      if (!this.selected) {
        this.$message({ message: '请选择', type: 'warning' });
        return;
      }
      // this.$store.commit('callback', { name: 'confirm', arg: this.selected });
      this.$root.confirm(this.selected)
      // this.close();
    },
    async loadList() {
      try {
        this.idNot = this.AParams.lpId;
        await this.load();
        this.idNot = '';
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
    handleSizeChange(size) {
      this.start = 0;
      this.size = size;
      this.loadList();
    },
    handleCurrentChange(start) {
      this.start = start - 1;
      this.loadList();
    },
    handleSearch() {
      this.start = 0;
      this.loadList();
    },
    async loadHistory(row, treeNode, resolve) {
      const res = await this.getHisitory({ id: row.id, params: { size: 1000 } });
      resolve(res?.content ?? []);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog .lp-def-choose {
  min-height: 450px;
  max-height: 550px;
  padding-bottom: 0;
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
