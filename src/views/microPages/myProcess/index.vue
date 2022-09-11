<template>
  <el-container class="long-process aops-el-common" v-loading="listLoading" direction="vertical">
    <el-header class="aops-align-right" style="height:auto;">
      <h3 class="aops-page-title aops-float-left">我的流程</h3>
      <el-button :disabled="!selected.length" :loading="downloading" @click="handleDownload">导出</el-button>
      <el-button @click="toUpload">导入</el-button>
    </el-header>
    <el-container>
      <el-header class="aops-search-box" style="height:auto;padding-top:10px;">
        <el-form inline :model="query" label-suffix=":">
          <el-form-item label="流程名称">
            <el-input v-model="name" clearable placeholder="请输入" @change="handleSearch" />
          </el-form-item>
          <el-form-item label="流程ID">
            <el-input v-model="key" clearable placeholder="请输入" @change="handleSearch" />
          </el-form-item>
          <!-- <el-form-item label="集群">
            <ClusterSelect v-model="clusterId" clearable @change="handleSearch" />
          </el-form-item> -->
          <el-form-item label="最新版本">
            <el-switch v-model="latest" clearable @change="handleSearch" />
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="padding:0 20px;max-height:580px">
        <!-- <AopsTable :data="list" @selection-change="data => (selected = data)" @row-click="row => (currentProc = row)"> -->
        <AopsTable :data="list"  @selection-change="data => (selected = data)">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="流程名称" width="130" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="id" label="流程定义ID" width="300" show-overflow-tooltip>
            <CopyCtn slot-scope="{ row }" :value="row.id" />
          </el-table-column>
          <el-table-column prop="key" label="流程ID" width="130" show-overflow-tooltip>
            <CopyCtn slot-scope="{ row }" :value="row.key" />
          </el-table-column>
          <el-table-column label="集群名(ID)" width="160" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.clusterName + '(' + scope.row.clusterId + ')' }}</template>
          </el-table-column>
          <el-table-column prop="customVersion" label="版本" width="80">
            <template slot-scope="{ row }">
              <span>V {{ row.customVersion }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="部署状态" width="130px">
            <template slot-scope="scope">
              <StatusPoint :status="scope.row.suspended" :reverse="true" />
              <el-button @click.stop="handleSupended(scope.row)" :class="scope.row.suspended | filterSusBtn">{{
                scope.row.suspended ? '激活' : '挂起'
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="上架状态" min-width="130px">
            <template slot-scope="scope">
              <div v-if="statusLoading" class="el-icon-loading"></div>
              <div v-if="!statusLoading">
                <StatusPoint :status="scope.row.published" :config="['上架', '下架', '获取失败']" />
                <el-button
                  v-show="scope.row.published !== undefined"
                  @click.stop="handlePublish(scope.row)"
                  :class="!scope.row.published | filterSusBtn"
                  >{{ scope.row.published ? '下架' : '上架' }}</el-button
                >
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="description" label="描述" show-overflow-tooltip />
          <el-table-column label="操作" width="260" fixed="right">
            <template scope="{row}">
              <!-- <el-button type="text" class="opr-icon" @click.stop="toProcessDetails(row)">详情</el-button> -->
              <el-button type="text" class="opr-icon" @click.stop="toProcessDiagram(row)">查看流程图</el-button>
              <el-button type="text" class="opr-icon" @click.stop="getStartUpPage(row)">进入启动页面</el-button>
              <!-- <el-button type="text" class="opr-icon" @click.stop="toStartUp(row)" :disabled="row.suspended"
                >启动</el-button
              > -->
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
    <!-- <el-footer v-if="currentProc" class="proc-def-instances" style="height:50%">
      <el-button type="text" icon="el-icon-close" @click="currentProc = null" class="aops-close-btn" />
      <DefinitionSelectTabs :clusterId="currentProc.clusterId" :id="currentProc.id" />
    </el-footer> -->
  </el-container>
</template>

<script>
const moduleName = 'afoeAdminLpDefinition';
// import { exportFile } from '@/utils/fileSaver';
import { mapState, mapActions, mapMutations } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`
});
const {queryLpDefStartFormDef} = window.getAopsApi();
const {getInvokeResponse,exportFile} = window.aopsUtils;
import LpDefUpload from './components/afoe/lpDefinition/LpDefDiagram'
import LpDefDiagram from './components/afoe/lpDefinition/LpDefDiagram'
// import ClusterSelect from './components/lpCluster/ClusterSelect';
// import StatusPoint from '@/components/common/StatusPoint';
// import DefinitionSelectTabs from '@/views/afoeAdmin/lpDefinition/DefinitionSelectTabs';
// import CopyCtn from '@/components/common/CopyCtn';
// import AopsTable from '@/components/common/AopsTable';
// const {getMenu } = window.getAacApi();
export default {
  store:window.aopsStore,
  mixins:[window.codelessMixins.customDialog],
  name: 'Process',
  components: {
    // ClusterSelect,
    // StatusPoint,
    // DefinitionSelectTabs,
    // CopyCtn,
    // AopsTable
  },
  data() {
    return {
      currentProc: null,
      selected: [],
      statusLoading: false
    };
  },
  computed: {
    // clusterId: vm => vm.PageParams.clusterId,
    ...mapState(moduleName, ['list', 'listLoading','query','downloading']),
    // ...mapState(moduleName, ['list', 'listLoading', 'downloading', 'query', 'clusterList']),
    ...mapFields([
      'page.start',
      'page.size',
      'page.total',
      'query.name',
      'query.key',
      'query.latest',
      'query.clusterId'
    ])
  },
  created() {
    this.resetPage();
    this.loadList();
  },
  methods: {
    ...mapMutations(moduleName, ['resetQuery', 'resetPage', 'updatePublishStatus']),
    ...mapActions(moduleName, ['load']),
    ...mapActions('lpDefinition1', ['download']),
    // ...mapActions('lpContent', ['queryPublishStatus', 'takeOffFromCatalogue', 'pushSuspendStatusToContent']),
    // ...mapActions('lpDefinition', ['download', 'activateOrSuspend', 'loadClusters']),
    // ...mapActions('lpDefinition', ['loadClusters']),
    async loadList() {
      try {
        await this.load();
        let ids = [];
        for (let i = 0; i < this.list.length; i++) {
          let params = { clusterId: this.list[i].clusterId, procDefId: this.list[i].id };
          ids.push(params);
        }
        this.statusLoading = true;
        // const data = await this.queryPublishStatus(ids);
        // this.updatePublishStatus(data);
        this.statusLoading = false;
      } catch (err) {
        this.statusLoading = false;
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
      this.currentProc = null;
      this.loadList();
    },
    handleReset() {
      this.start = 0;
      this.resetQuery();
      this.loadList();
    },
    // async handleSupended(row) {
    //   // 先调用afoe的激活挂起，成功了再将状态推送到流程目录
    //   const actionName = row.suspended ? '激活' : '挂起';
    //   const isConfirm = await this.isConfirm(
    //     this.$confirm(`确认${actionName} 流程: ${row.name}?`, `${actionName}确认`, { type: 'warning' })
    //   );
    //   if (!isConfirm) {
    //     return;
    //   }
    //   try {
    //     const action = row.suspended ? 'activate' : 'suspend';
    //     await this.activateOrSuspend({ clusterId: row.clusterId, procDefId: row.id, action });
    //     this.loadList();
    //     // await this.pushSuspendStatusToContent({ clusterId: row.clusterId, procDefId: row.id, action });
    //     this.$message({ type: 'success', message: '操作成功' });
    //   } catch (err) {
    //     this.$message({ type: 'error', message: err });
    //   }
    // },
    // async handlePublish(row) {
    //   if (row.published) {
    //     const isConfirm = await this.isConfirm(
    //       this.$confirm(`确认将流程: ${row.name}从工作流下架？`, `下架确认`, { type: 'warning' })
    //     );
    //     if (!isConfirm) {
    //       return;
    //     }
    //     try {
    //       await this.takeOffFromCatalogue({ clusterId: row.clusterId, procDefId: row.id });
    //       this.$message({ message: '下架成功', type: 'success' });
    //       this.loadList();
    //     } catch (err) {
    //       this.$message({ message: '下架流程失败' + err, type: 'error' });
    //       return;
    //     }
    //   } else {
    //     this.open({
    //       title: '上架到工作流目录',
    //       path: 'lp-definition/publish',
    //       page: 'afoeAdmin/lpDefinition/LpDefPublish',
    //       type: 'SUB',
    //       hideFooter: true,
    //       width: '550px',
    //       params: {
    //         processDef: row
    //       },
    //       confirmCallback: params => {
    //         this.loadList();
    //       }
    //     });
    //   }
    // },
    // async toStartUp(row) {
    //   this.open({
    //     title: `启动流程-${row.name}`,
    //     path: '/InstanceAdd',
    //     page: 'afoe/lpInstance/LpInstAdd',
    //     width: row.startFormDefined ? '800px' : '600px',
    //     type: 'SUB',
    //     hideFooter: true,
    //     params: {
    //       clusterId: row.clusterId,
    //       processDefId: row.id,
    //       startFormDefined: row.startFormDefined
    //     }
    //   });
    // },
    async getStartFormDef({ clusterId, lpDefId }) {
        return await getInvokeResponse(queryLpDefStartFormDef(clusterId, lpDefId));
      },
    toProcessDiagram(row) {
      this.open({
        title: '流程定义流程图',
        path: '/ProcessDiagram',
        component: LpDefDiagram,
        class: 'aops-el-common',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        type: 'SUB',
        width: '800px',
        // height:'800px',
        params: {
          clusterId: row.clusterId,
          processDefinitionId: row.id
        }
      });
    },
    async getStartUpPage(data){
      let ctx = this;
      let res = await this.getStartFormDef({
        clusterId:data.clusterId,
        lpDefId:data.id
      })
       let {pageUrl} = res;
       let query = {
          pageId: pageUrl,
          prototypeId:pageUrl,
          // type: obj.codelessType,
          processDefinitionKey:data.key,
          runtime:true,
          hideCenter:true,
          hideRight:true,
          preview:true,
          showBack:true
          // pId: this.$route.query.pId,
        };
         ctx.openRenderPage({
          path:'/process/start',
          // layout:"backTop",
          params:query
        })
      
      // await getMenu(pageUrl)
      //     .then((res) => {
      //           // console.log("ctx.$store.state.codeless.pageContent res", res);
      //           let {content}= res;
      //           let pageContent = '';
      //           if (!content.pageContent || content.pageContent === "{}") {
      //             pageContent = ctx.workJson;
      //           } else {
      //             pageContent = JSON.parse(content.pageContent);
      //           }
      //            let query = {
      //               title: content.title,
      //               pageId: content.id,
      //               type: content.codelessType,
      //               processDefinitionKey:data.key
      //               // pId: this.$route.query.pId,
      //             };
      //             // this.$router.replace({
      //             //   path: "/app/render",
      //             //   query,
      //             // });
      //             console.log(query)
      //             ctx.open({
      //               path:'/process/start',
      //               component:'codeLess/index',
      //               layout:"backTop",
      //               params:query
      //             })
      //           // ctx.cancelLoading();
      //           // console.log("工作台内容", ctx.pageContent);
      //         })
      //         .catch((e) => {
      //           // ctx.cancelLoading();
      //         });
           
    },
    // toProcessDetails(row) {
    //   this.open({
    //     title: '流程定义详情',
    //     path: `/afoe-admin/${row.clusterId}/lp-definition/${row.id}`,
    //     page: 'afoeAdmin/lpDefinition/LpDefDetail',
    //     type: 'BLANK'
    //   });
    // },
    async handleDownload() {
      let cluId = this.selected[0].clusterId;
      for (let i = 0; i < this.selected.length; i++) {
        if (cluId !== this.selected[i].clusterId) {
          this.$message({ message: '请选择同一集群下的流程进行导出', type: 'warning' });
          return;
        }
      }
      try {
        const res = await this.download({ clusterId: cluId, ids: this.selected.map(item => item.id) });
        exportFile('deploy.zip', res);
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
    toUpload() {
      this.open({
        title: '导入',
        path: '/ProcessUpload',
        component:LpDefUpload,
        // page: 'microPages/myProcess/components/afoe/lpDefinition/LpDefUpload',
        class: 'aops-el-common',
        // hideFooter: true,
        hideCancelBtn:true,
        hideConfirmBtn:true,
        type: 'SUB',
        width: '600px',
        // params: { clusterId: this.clusterId },
        confirmCallback: () => this.loadList()
      });
    }
  },
  filters: {
    // filterSusBtn(suspended) {
    //   if (suspended) {
    //     return 'active-btn';
    //   } else {
    //     return 'suspended-btn';
    //   }
    // }
  }
};
</script>

<style lang="scss">

.long-process {
  height:100%;
  .el-header {
    line-height: 48px;
  }
  .suspended-btn {
    height: 20px;
    line-height: 14px;
    border-radius: 12px;
    width: 44px;
    padding: 2px 4px;
    background-color: white;
    margin-left: 16px;
    background: radial-gradient(circle at 10% 10%, #e3e3e350, white);
  }
  .suspended-btn:hover {
    color: #5f5f5f;
    background: radial-gradient(circle at 90% 90%, #e3e3e350, white);
  }
  .active-btn {
    height: 20px;
    border: none;
    line-height: 14px;
    width: 44px;
    border-radius: 12px;
    padding: 2px 4px;
    color: white;
    margin-left: 16px;
    transition: radial-gradient ease 0.5s;
    background: radial-gradient(
      circle at 10% 10%,
      rgba(0, 128, 128, 0.7),
      rgb(7, 182, 181) 40%,
      rgba(7, 182, 181, 0.5)
    );
  }
  .active-btn:hover {
    transition: radial-gradient ease 0.5s;
    background: radial-gradient(circle at 90% 90%, rgb(7, 182, 181), rgba(7, 182, 181, 0.5));
  }
  .proc-def-instances {
    padding: 0;
  }
}
</style>
