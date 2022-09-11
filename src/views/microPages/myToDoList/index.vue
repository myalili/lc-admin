<template>
  <el-container class="todo-list aops-el-common" v-loading="listLoading" >
    <!-- 待办 -->
    <el-header class="aops-search-box aops-serach-ctn" style="height:auto;position:relative">
      <el-form inline>
        <h3 class="aops-page-title" style="display:inline-block;margin-right:20px">待办任务</h3>
        <el-form-item label="流程实例ID" prop="insID">
          <el-input v-model="insID" clearable placeholder="请输入" @change="handleSearch" />
        </el-form-item>
        <!-- <el-form-item label="集群列表">
          <ClusterSelect v-model="clusterId" clearable @change="handleSearch" />
        </el-form-item> -->
        <SpreadSearchCtn>
          <el-form-item label="流程定义ID" prop="defID">
            <el-input v-model="defID" clearable placeholder="请输入" @change="handleSearch" />
          </el-form-item>
          <el-form-item label="发起人" prop="startman">
            <el-input v-model="startman" clearable placeholder="请输入" @change="handleSearch" />
          </el-form-item>
          <el-form-item label="发起时间" prop="startTime">
            <AopsDatePicker v-model="startTime" clearable @change="handleSearch" />
          </el-form-item>
        </SpreadSearchCtn>
      </el-form>
    </el-header>
    <el-main style="padding: 0 20px;max-height:580px">
      <AopsTable :data="list" :hideLabels='hideLabels'>
        <el-table-column prop="name" label="任务名称" width="130" show-overflow-tooltip />
        <el-table-column prop="id" label="任务ID" width="200" show-overflow-tooltip>
          <CopyCtn slot-scope="{ row }" :value="row.id" />
        </el-table-column>
        <el-table-column prop="processInstanceId" label="流程实例ID" width="200" show-overflow-tooltip>
          <CopyCtn slot-scope="{ row }" :value="row.processInstanceId" />
        </el-table-column>
        <el-table-column prop="clusterName" label="集群名(ID)" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.clusterName + '(' + scope.row.clusterId + ')' }}</template>
        </el-table-column>
        <el-table-column prop="processDefinitionName" label="流程定义名称" width="130" show-overflow-tooltip />
        <el-table-column prop="processInstanceStartUserId" label="发起人" width="130" show-overflow-tooltip />
        <el-table-column prop="created" label="发起时间" width="140" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.created | date }}</template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="name" label="操作" width="180px" fixed="right">
          <template slot-scope="{ row }">
            <el-button v-if="row.assignee" type="text" class="opr-icon" @click.stop="handleDo(row)">办理</el-button>
            <el-button v-else type="text" class="opr-icon" @click.stop="handleClaim(row)">领取</el-button>
            <el-button type="text" class="opr-icon" @click="toFlowChart(row)">显示图</el-button>
            <!-- <el-button type="text" class="opr-icon" @click="toInstancesDetails(row)">流程实例</el-button> -->
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
const moduleName = 'afoeAdminLpTodoTask';
// let titleMap = {
//   '理财审批':'理财',
//   '转账审批':'转账'
// }
// import ClusterSelect from '@/components/lpCluster/ClusterSelect';
import { mapState, mapActions, mapMutations } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`
});
const {queryVariables} = window.getAopsApi();
const {getInvokeResponse} = window.aopsUtils;
// import AopsTable from '@/components/common/AopsTable';
// import CopyCtn from '@/components/common/CopyCtn';
// import SpreadSearchCtn from '@/components/common/SpreadSearchCtn';
// import AopsDatePicker from '@/components/common/AopsDatePicker';
import completeTask from "./components/afoe/userTask/CompleteTask.vue"
window.Vue && window.Vue.component("completeTask",completeTask)
export default {
  // components: {
  //   ClusterSelect,
  //   AopsTable,
  //   CopyCtn,
  //   SpreadSearchCtn,
  //   AopsDatePicker
  // },
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  computed: {
  
    // clusterId: vm => vm.PageParams.clusterId,
    ...mapState(moduleName, ['list', 'listLoading', 'query', 'page']),
    ...mapFields([
      'query.insID',
      'query.defID',
      'query.startman',
      'query.startTime',
      // 'query.clusterId',
      'page.start',
      'page.size',
      'page.total'
    ]),
    title(){
      return this.AParams.title
    },
  },
  data(){
    
    return {
      hideLabels:[]
    }
  },
  // activated(){
  //     if(this.AParams.title){
  //      let filterText = titleMap[this.AParams.title]||'';
  //      this.setProcessDefinitionNameLike(filterText)
  //   }
   
  //   this.loadList();

  // },
  created() {
    // if(this.AParams.title){
    //    let filterText = titleMap[this.AParams.title]||'';
    //    this.setProcessDefinitionNameLike(filterText);
    //    this.hideLabels = ['任务ID','流程实例ID','集群名(ID)']
    // }
   
    this.loadList();
  },
  methods: {
    ...mapMutations(moduleName, ['resetQuery', 'resetPage','setProcessDefinitionNameLike']),
    ...mapActions(moduleName, ['load', 'claim']),
    async loadList() {
      try {
        await this.load();
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
    async handleClaim(row) {
      const isConfirm = await this.isConfirm(
        this.$confirm(`确定领取任务 [${row.name || row.id}]?`, '领取任务', {
          type: 'info'
        })
      );
      if (!isConfirm) return;
      try {
        await this.claim({ clusterId:row.clusterId, taskId: row.id });
        this.$message({ message: '操作成功', type: 'success' });
        this.loadList();
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
    async isConfirm (promise) {
      try {
        return (await promise) === 'confirm';
      } catch (err) {
        return false;
      }
    },
    async handleDo(row) {
      let res = await getInvokeResponse(queryVariables(row.clusterId, row.processInstanceId), '获取变量');
      let {data} = res;
      // let c =await getSource("@micro-page/myToDoList",{
      //     inSpaOpen:true
      // })
      this.open({
        path:'/aopsDeal',
        pageType:"component",
        component: 'completeTask',
        params:{
          id:row.id,
          clusterId:row.clusterId,
          variables:data
        }
      });
    },
    toFlowChart(row) {
      this.open({
        path: '/LpInstDiagram/' + row.id,
        type: 'SUB',
        title: `显示图-${row.id}`,
        component:Vue.options.components.LpInstDiagram,
        customClass: 'aops-el-common',
        width: '1000px',
        // height:'800px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        params: {
          clusterId:row.clusterId,
          id: row.processInstanceId
        }
      });
    },
    // toInstancesDetails(row) {
    //   this.open({
    //     path: `/aops-afoe/${row.clusterId}/lp-instance/${row.processInstanceId}`,
    //     page: 'afoe/lpInstance/LpInstDetail',
    //     title: '实例详情',
    //     type: 'BLANK'
    //   });
    // },
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
    }
  },
  // watch:{
  //   '$route':{
  //     handler(val){
  //       console.log(val);
  //     //   let filterText = titleMap[val.title]||'';
  //     //  this.setProcessDefinitionNameLike(filterText)
  //     },
  //     deep:true
  //   }
  // }
};
</script>

