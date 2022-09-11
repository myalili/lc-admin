<template>
  <el-container class="aops-el-common lp-instance" v-loading="listLoading">
    <el-header style="height:auto;position:relative">
      <el-form class="aops-search-box aops-serach-ctn" inline>
        <h3 class="aops-page-title" style="display:inline-block;margin-right:20px">流程实例</h3>
        <el-form-item label="流程实例名称">
          <el-input v-model="processInstanceNameLike" clearable placeholder="请输入" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="业务Key">
          <el-input v-model="processBusinessKeyLike" clearable placeholder="请输入" @change="handleSearch" />
        </el-form-item>
        <!-- <el-form-item label="集群">
          <ClusterSelect v-model="clusterId" @change="handleSearch" />
        </el-form-item> -->
        <SpreadSearchCtn>
          <el-form-item label="流程实例ID">
            <el-input v-model="processInstanceId" clearable placeholder="请输入" @change="handleSearch" />
          </el-form-item>
          <el-form-item label="实例状态">
            <el-select v-model="processInstanceStatus" placeholder="请选择" clearable @change="handleSearch">
              <el-option label="已结束" value="finished" />
              <el-option label="进行中" value="running" />
            </el-select>
          </el-form-item>
          <el-form-item label="发起人">
            <el-input v-model="startUserId" clearable placeholder="请输入" @change="handleSearch" />
          </el-form-item>
          <el-form-item label="发起时间">
            <AopsDatePicker v-model="startTime" @change="handleSearch" />
          </el-form-item>
        </SpreadSearchCtn>
      </el-form>
    </el-header>
    <el-main style="padding:0 20px;max-height:580px">
      <AopsTable :data="list" highlight-current-row fit row-key="id" style="width: 100%;">
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div class="status-desc-box">
              <span :class="scope.row.endTime | filterStatusIcon"></span
              ><span style="margin-left: 10px;">{{ scope.row.endTime ? '已结束' : '运行中' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="流程实例ID" width="250" show-overflow-tooltip>
          <CopyCtn slot-scope="{ row }" :value="row.id" />
        </el-table-column>
        <el-table-column prop="name" label="流程实例名称" width="135" show-overflow-tooltip />
        <el-table-column label="流程定义ID(名称)" width="135" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.processDefinitionId + row.processDefinitionName }}</template>
        </el-table-column>
        <el-table-column prop="businessKey" label="业务Key" show-overflow-tooltip />
        <el-table-column prop="clusterName" label="集群名(ID)" show-overflow-tooltip width="100">
          <template slot-scope="scope">{{ scope.row.clusterName + '(' + scope.row.clusterId + ')' }}</template>
        </el-table-column>
        <el-table-column prop="startUserId" label="发起人" show-overflow-tooltip />
        <el-table-column prop="startTime" label="创建时间" width="135" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startTime | date }}</template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="135" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.endTime | date }}</template>
        </el-table-column>
        <el-table-column prop="processDefinitionDescription" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="220px" fixed="right">
          <template scope="scope">
            <el-button type="text" class="opr-icon" @click="toDetails(scope.row)">详情</el-button>
            <el-button type="text" class="opr-icon" @click="toFlowChart(scope.row)">显示图</el-button>
            <el-button type="text" class="opr-icon" @click="toTrace(scope.row)">执行链路</el-button>
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
        class="aops-el-pagination"
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
          class="aops-el-pagination"
        />
      </el-footer>
  </el-container>
</template>
<script>
const moduleName = 'afoeAdminLpInstance';
import { mapState, mapActions, mapMutations } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`
});
import LpInstTrace from "./components/LpInstTrace"
// import ClusterSelect from '@/components/lpCluster/ClusterSelect';
// import SpreadSearchCtn from '@/components/common/SpreadSearchCtn';
// import AopsTable from '@/components/common/AopsTable';
// import CopyCtn from '@/components/common/CopyCtn';
// import AopsDatePicker from '@/components/common/AopsDatePicker';

export default {
  store:window.aopsStore,
  name: 'Instances',
  mixins:[window.V8.mixins],
  components: {
    // ClusterSelect,
    // SpreadSearchCtn,
    // AopsTable,
    // CopyCtn,
    // AopsDatePicker
  },
  computed: {
    // clusterId: vm => vm.PageParams.clusterId,
    ...mapState(moduleName, ['list', 'listLoading', 'query']),
    ...mapFields([
      'page.start',
      'page.size',
      'page.total',
      'query.processInstanceId',
      'query.processInstanceNameLike',
      'query.processDefinitionId',
      'query.processInstanceStatus',
      'query.startUserId',
      'query.startTime',
      'query.processBusinessKeyLike',
      'query.clusterId'
    ])
  },
  created() {
    this.loadList();
  },
  methods: {
    ...mapMutations(moduleName, ['resetQuery', 'resetPage']),
    ...mapActions(moduleName, ['load']),
    // 加载流程实例列表
    async loadList() {
      try {
        await this.load();
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
    toDetails(row) {
      this.open({
        // status: true,
        path: `/aops-afoe/${row.clusterId}/lp-instance/${row.id}`,
        page: 'microPages/lpInstance/components/LpInstDetail',
        title: '实例详情',
        type: 'BLANK',
        params:{
          clusterId:row.clusterId,
          processInstanceId:row.id
        }
      });
    },
    toFlowChart(row) {
      this.open({
        path: '/LpInstDiagram/' + row.id,
        type: 'SUB',
        title: `流程图-${row.id}`,
        component: Vue.options.components.LpInstDiagram,
        customClass: 'aops-el-common',
        width: '1000px',
        // height:'800px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        params: {
          clusterId: row.clusterId,
          id: row.id
        },
        // confirmCallback: this.queryData
      });
    },
    toTrace(row) {
      this.open({
        path: `/LpInstTrace/${row.id}`,
        type: 'SUB',
        title: '流程执行链路',
        component:LpInstTrace,
        // page: 'microPages/lpInstance/components/LpInstTrace',
        width: '800px',
        customClass: 'aops-el-common',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        params: {
          clusterId: row.clusterId,
          id: row.id
        }
      });
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
    handleCurrentChange(start) {
      this.start = start - 1;
      this.loadList();
    },
    handleSizeChange(size) {
      this.start = 0;
      this.size = size;
      this.loadList();
    }
  },
  filters: {
    filterStatusIcon(endTime) {
      if (!endTime) {
        return 'el-icon-loading';
      }
      return 'el-icon-success';
    }
  }
};
</script>
<style lang="scss">
.lp-instance {
  .status-desc-box {
    height: 24px;
    line-height: 24px;
    display: inline-block;
    vertical-align: center;
  }
  .el-icon-success {
    position: relative;
    top: 2px;
    color: rgb(103, 194, 58);
    font-size: 20px;
  }
  .el-icon-loading {
    position: relative;
    top: 2px;
    font-size: 20px;
  }
  > .el-header > .el-form > .el-form-item {
    margin-bottom: 10px !important;
    // .el-input {
    //   width: 160px;
    // }
  }
}
</style>
