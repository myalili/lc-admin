<template>
  <el-container class="record-handle" v-loading="listLoading">
    <el-header
      class="aops-search-box"
      style="height: auto; position: relative; padding-top: 0"
    >
      <el-form inline>
        <el-form-item label="流程实例ID">
          <el-input
            v-model="processInstanceId"
            clearable
            placeholder="请输入"
            @change="handleSearch"
          />
        </el-form-item>
        <el-form-item label="流程定义ID">
          <el-input
            v-model="processDefinitionId"
            clearable
            placeholder="请输入"
            @change="handleSearch"
          />
        </el-form-item>
        <!-- <el-form-item label="集群列表">
          <clusterSelect v-model="clusterId" clearable @change="handleSearch" />
        </el-form-item> -->
        <SpreadSearchCtn>
          <el-form-item label="流程定义名称">
            <el-input
              v-model="processInstanceNameLike"
              clearable
              placeholder="请输入"
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item label="发起时间">
            <AopsDatePicker
              v-model="startTime"
              clearable
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item label="处理时间">
            <AopsDatePicker
              v-model="handleTime"
              clearable
              @change="handleSearch"
            />
          </el-form-item>
        </SpreadSearchCtn>
      </el-form>
    </el-header>
    <el-main style="padding: 0 20px;max-height:580px">
      <AopsTable :data="list" tooltip-effect="dark" style="width: 100%">
        <el-table-column
          width="180"
          prop="id"
          label="任务ID"
          show-overflow-tooltip
        >
          <CopyCtn slot-scope="{ row }" :value="row.id" />
        </el-table-column>
        <el-table-column
          width="180"
          prop="processInstanceId"
          label="流程实例ID"
          show-overflow-tooltip
        >
          <CopyCtn slot-scope="{ row }" :value="row.processInstanceId" />
        </el-table-column>
        <el-table-column
          width="180"
          prop="processDefinitionId"
          label="流程定义ID"
          show-overflow-tooltip
        >
          <CopyCtn slot-scope="{ row }" :value="row.processDefinitionId" />
        </el-table-column>
        <el-table-column
          width="100"
          prop="processDefinitionName"
          label="流程定义名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="clusterName"
          label="集群名(ID)"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.clusterName + "(" + scope.row.clusterId + ")"
          }}</template>
        </el-table-column>
        <el-table-column
          width="140"
          show-overflow-tooltip
          prop="created"
          label="发起时间"
        >
          <template slot-scope="scope">{{ scope.row.created | date }}</template>
        </el-table-column>
        <el-table-column
          width="140"
          show-overflow-tooltip
          prop="endDate"
          label="处理时间"
        >
          <template slot-scope="scope">{{ scope.row.endDate | date }}</template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="opr-icon"
              @click="toFlowChart(scope.row)"
              >显示图</el-button
            >
            <!-- <el-button type="text" class="opr-icon" @click="toInstancesDetails(scope.row)">流程实例</el-button> -->
          </template>
        </el-table-column>
      </AopsTable>
      <!-- <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="size"
        :total="total"
        :current-page="start + 1"
      /> -->
    </el-main>
      <el-footer style="position:fixed;bottom:10px;height:30px,z-index:999">
         <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="size"
        :total="total"
        :current-page="start + 1"
      />
       </el-footer>
  </el-container>
</template>
<script>
const moduleName = "afoeAdminLpDoneTask";
import { mapState, mapActions, mapMutations } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`,
});
// import ClusterSelect from '@/components/lpCluster/ClusterSelect';
// import AopsTable from '@/components/common/AopsTable';
// import CopyCtn from '@/components/common/CopyCtn';
// import SpreadSearchCtn from '@/components/common/SpreadSearchCtn';
// import AopsDatePicker from '@/components/common/AopsDatePicker';

export default {
  store: window.aopsStore,
  name: "LpDoneTask",
  mixins: [window.V8.mixins],
  components: {
    // ClusterSelect,
    // AopsTable,
    // CopyCtn,
    // SpreadSearchCtn,
    // AopsDatePicker
  },
  computed: {
    ...mapState(moduleName, ["list", "listLoading"]),
    ...mapFields([
      "page.start",
      "page.size",
      "page.total",
      "query.processInstanceId",
      "query.processDefinitionId",
      "query.processInstanceNameLike",
      "query.startTime",
      "query.handleTime",
      "query.clusterId",
    ]),
  },
  created() {
    this.resetPage();
    this.loadList();
  },
  methods: {
    ...mapMutations(moduleName, ["resetQuery", "resetPage"]),
    ...mapActions(moduleName, ["load"]),
    async loadList() {
      try {
        await this.load();
      } catch (err) {
        this.$message({ message: err, type: "error" });
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
    handleReset() {
      this.start = 0;
      this.resetQuery();
      this.loadList();
    },
    toFlowChart(row) {
      this.open({
        path: "/LpInstDiagram" + row.id,
        type: "SUB",
        title: `显示图-${row.id}`,
        component: Vue.options.components.LpInstDiagram,
        customClass: "aops-el-common",
        width: "1000px",
        // height:'800px',
        // hideCancelBtn:true,
        hideConfirmBtn: true,
        hideCancelBtn: true,
        params: {
          clusterId: row.clusterId,
          id: row.processInstanceId,
        },
      });
    },
    // toInstancesDetails(row) {
    //   this.open({
    //     path: `/aops-afoe/${row.clusterId}/lp-instance/${row.processInstanceId}`,
    //     page: 'afoe/lpInstance/LpInstDetail',
    //     title: '实例详情',
    //     type: 'BLANK'
    //   });
    // }
  },
};
</script>
<style lang="scss">
.record-handle {
  height: 100%;
  .aops-search-box {
    padding-top: 10px;
  }
}
</style>
