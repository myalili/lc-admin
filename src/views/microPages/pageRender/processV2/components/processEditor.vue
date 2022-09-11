<template>
  <el-container class="LongProcessDetail" v-loading="longProcessLoading">
    <!-- <el-header style="height:auto;margin:0;">
      <el-button v-if="!readonly" :loading="updating" @click="handleSave">保存</el-button>
      <el-button v-if="!readonly" :loading="updating" @click="handleSaveAsVersion">保存为版本</el-button>
      <el-button :loading="publishing" @click="handlePublish">部署</el-button>
      <el-button @click="handlePreview">预览</el-button>
      <el-button @click="handleDownloadXml">下载XML</el-button>
      <el-button v-if="!readonly" icon="el-icon-folder-opened" @click="importXml">打开文件</el-button>
      <el-upload action="" :before-upload="openBpmn" style="display: none">
        <el-button ref="importBtn" size="mini" icon="el-icon-folder-opened" />
      </el-upload>
    </el-header> -->
     <el-upload action="" :before-upload="openBpmn" style="display: none">
        <el-button ref="importBtn" size="mini" icon="el-icon-folder-opened" />
      </el-upload>
      
    <el-container  style="padding:0;height:100%">
      <el-aside :style="collapsedLeft ? 'width:12px;' : 'width:250px'" class="left-catalog-box">
        <CollapsedBar v-model="collapsedLeft" position="right" />
        <el-tabs v-model="tabName" type="card" :style="collapsedLeft ? 'left:-238px;' : ''">
          <!-- <el-tab-pane label="基础元素" name="baseElementsTab">
            <LpBpmnElements @dragstart="handleAddBaseEl" />
          </el-tab-pane> -->
          <el-tab-pane label="服务目录" name="serverCatalogTab">
            <ServerCatalogElements @dragstart="handleAddServerCatalogEl" />
          </el-tab-pane>
          <!-- <el-tab-pane label="全局子流程" name="lpDefElementsTab">
            <LpDefElements @dragstart="handleAddBaseEl" />
          </el-tab-pane> -->
        </el-tabs>
      </el-aside>
      <el-main class="middle-canvas-box">
        <!-- 图纸区域 -->
        <UaeBpmnEditor ref="bpmnEditor" @click="handleElementClick" @inited="bpmnInited" :value="xmlStr" />
      </el-main>
      <el-aside v-if="currentBpmnEl" class="right-property-box" :style="collapsedRight ? 'width:12px;' : 'width:350px'">
        <CollapsedBar v-model="collapsedRight" />
        <!-- 属性面板 -->
        <LpPropertyPanel
          class="property-comp"
          style="width:338px;height:100%;overflow:auto;"
          v-if="currentBpmnEl"
          :definitions="definitions"
          :node="currentBpmnEl"
          :readonly="readonly"
        />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>


// import LpBpmnElements from './lpUaeBpmn/LpBpmnElements';
import ServerCatalogElements from './lpUaeBpmn/ServerCatalogElements';
// import LpDefElements from './lpUaeBpmn/LpDefElements';
import LpPropertyPanel from './lpUaeBpmn/LpPropertyPanel';
import CollapsedBar from './common/CollapsedBar';
// const { queryLongProcessByIdAndVersion, updateLongProcess, updateLongProcessAsNewVersion } = window.getAopsApi();
const { getDefaultXml,serviceTaskClass,getRequestBody,jsonParse} = window.aopsUtils;
import UaeBpmnEditor from '@uae/uae-bpmn-editor';
import { mapActions } from 'vuex';
import PreviewXml from './chore/PreviewXml'
export default {
  store:window.aopsStore,
  name: 'ProcessDetails',
  components: {
    UaeBpmnEditor,
    // LpBpmnElements,
    LpPropertyPanel,
    ServerCatalogElements,
    // LpDefElements,
    CollapsedBar,
  },
  props:["pageDef","edit","params"],
  mixins: [ window.V8.mixins ],
  data() {
    return {
      updating: false,
      longProcess: null,
      longProcessLoading: false,
      publishing: false,
      // tabName: 'baseElementsTab',
      tabName: 'serverCatalogTab',
      definitions: null,
      currentBpmnEl: null,
      xmlStr: '',
      collapsedRight: false,
      collapsedLeft: false,
      verison:''
    };
  },
  computed: {
    // readonly() {

    //   return !!this.version;
    // }
    readonly(){
      return this.$route.query.status==='published'
    }
  },
  watch:{
    updating(val){
      window.msgHub.$emit('process_updating',val)
    }
  },
  created() {
    if(this.pageDef){
      this.PageParams = this.pageDef;
      this.verison =  this.PageParams.veriosn
    }
    let self = this;
    this.loadLongProcess();
    document.addEventListener('keydown', this.handleKeydownEvent);
    //  window.msgHub.$on('process_save_as_version',()=>{
    //    self.handleSaveAsVersion()
    //  })
     window.msgHub.$on('process_preview',()=>{
       self.handlePreview()
     })
     window.msgHub.$on('process_download_xml',()=>{
       self.handleDownloadXml()
     })
     window.msgHub.$on('process_import_xml',()=>{
       self.importXml()
     })
    //   window.msgHub.$on('process_save',()=>{
    //     self.handleSave()
    //   })
  },
  beforeDestroy() {
     document.removeEventListener('keydown', this.handleKeydownEvent);
     window.msgHub.$off('process_save_as_version')
     window.msgHub.$off('process_preview')
     window.msgHub.$off('process_download_xml')
     window.msgHub.$off('process_import_xml')
     window.msgHub.$off('process_save')
  },
  methods: {
    ...mapActions('overview', { getOverviewItem: 'getItem' }),
    ...mapActions('operation', { getOperationDetail: 'getDetail' }),
    // 编辑器初始化完成回调
    bpmnInited(definitions) {
      console.log(definitions)
      this.definitions = definitions;
      this.currentBpmnEl = this.definitions.processes[0];
      console.log(this.currentBpmnEl)
    },
    // 预览
    handlePreview() {
      // console.log(this.$refs.bpmnEditor.getXml(true));
      this.open({
        title: 'XML预览',
        path: '/preview-xml',
        component: PreviewXml,
        type: 'SUB',
        customClass: 'aops-el-common',
        hideCancelBtn: true,
        hideConfirmBtn:true,
        params: {
          xml: this.$refs.bpmnEditor.getXml(true)
        }
      });
    },
    // 监听流程图的点击事件
    handleElementClick(value) {
      if (value) {
        this.currentBpmnEl = value;
      } else {
        this.currentBpmnEl = this.definitions.processes[0];
      }
    },
    // ctrl+s保存
    handleKeydownEvent(event) {
      event = window.event || event;
      if (this.updating) {
        event.preventDefault();
        return false;
      }
      if (event.keyCode === 83 && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();
        this.handleSave();
        return false;
      }
    },
    // 加载长流程流程
    async loadLongProcess() {
      // console.log(this.PageParams.id);
      this.longProcessLoading = true;
      // const res = await this.aopsChoreRequest(
      //   queryLongProcessByIdAndVersion(this.PageParams.id, this.PageParams.version),
      //   '查询长流程'
      // );
 
    let {pageId,title} = this.params;
    if(!this.pageDef.content){
        this.longProcess={
        id:pageId,
        name:title,
        description:title,
        content:"",
      }

      this.xmlStr=getDefaultXml(this.longProcess);
    }else{
       this.xmlStr = this.pageDef.content
    }
    
      
      console.log(this.longProcess);
      console.log(this.xmlStr)
      this.longProcessLoading = false;
    },
    
    // 保存
    // async handleSave() {
    //   this.updating = true;
    //   const process = this.getUpdateProcess();
    //   if (await this.aopsChoreRequest(updateLongProcess(this.longProcess.id, process), '保存')) {
    //     this.longProcess.content = process.content;
    //     this.$message({ message: '保存成功!', type: 'success' });
    //   }
    //   this.updating = false;
    //   //  window.msgHub.$emit('codeless_tree_refresh')
    // },
    // 保存为新版本
    // handleSaveAsVersion() {
    //   this.$confirm('确认保存为新版本吗？', '提示', {
    //     type: 'warning'
    //   }).then(async () => {
    //     this.updating = true;
    //     const process = this.getUpdateProcess();
    //     if (await this.aopsChoreRequest(updateLongProcessAsNewVersion(this.longProcess.id, process), '保存为新版本')) {
    //       this.longProcess.content = process.content;
    //       this.$message({ message: '保存成功!', type: 'success' });
    //     }
    //     this.updating = false;
    //   });
    // },
    // 获取待保存的长流程
    getUpdateProcess() {
      const xml = this.$refs.bpmnEditor.getXml();
      console.log(xml);
      // this.longProcess.content = xml;
      const process = this.definitions.processes[0];
      if (process?.id !== this.params.pageId) {
        this.$message({ message: '流程id与XML中流程id不一致', type: 'warn' });
      }
      return xml
      // return {
      //   ...this.longProcess,
      //   id: process?.id,
      //   name: process.name,
      //   tag: process?.versionTag,
      //   content: xml,
      //   version: undefined
      // };
    },
    // 部署流程
    // handlePublish() {
    //   if (!this.longProcess.content) {
    //     this.$message({ message: '请完善流程后再部署', type: 'warning' });
    //     return;
    //   }
    //   this.toProcessDeploy();
    // },
    // 添加元素
    // handleAddBaseEl(data) {
    //   this.$refs.bpmnEditor.createNode(data.model, data.props, data.shapeProps);
    // },
    async handleAddServerCatalogEl(data, detailId, overview, operation) {
      let props = {
        class: serviceTaskClass.micro,
        fields: [{ name: 'microService', type: 'string', string: '' }]
      };
      try {
        const data = await this.$refs.bpmnEditor.createNode('serviceTask', props);
        // 正向接口
        const httpInfo = await this.getHttpInfo(operation, null, overview);
        data.fields[0].string = JSON.stringify({ api: httpInfo });
      } catch (err) {
        console.log(err);
      }
    },
    // 获取HttpInfo
    async getHttpInfo(operation, operationDetail, overview) {
      if (!operation) return null;
      try {
        operationDetail = operationDetail ?? (await this.getOperationDetail({ detailId: operation.detailId }));
      } catch (err) {
        this.$message.error(err);
      }
      try {
        overview = overview ?? (await this.getOverviewItem({ id: operation.serviceId }));
      } catch (err) {
        this.$message.error(err);
      }
      const params = jsonParse(operationDetail?.params, []).map(item => ({ ...item, value: '' }));
      const requestBody = getRequestBody(operationDetail);
      if (requestBody.mediaType) {
        params.push({
          name: 'Content-Type',
          in: 'header',
          value: requestBody.mediaType
        });
        params.push({
          name: 'body',
          in: 'body',
          value: requestBody.mediaValue
        });
      }
      return {
        name: operation.cnName,
        httpMethod: operation.method,
        protocol: operation.protocol,
        url: '',
        appName: overview.code,
        treePath: operation.url,
        timeout: 0,
        params,
        sc: { overview, operation, operationDetail }
      };
    },
    // 下载XML
    handleDownloadXml() {
      const data = this.$refs.bpmnEditor.getXml(true);
      const dataTrack = 'bpmn';
      const a = document.createElement('a');
      const name = `${this.longProcess.name}.bpmn20.xml`;
      a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
      a.setAttribute('target', '_blank');
      a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
      a.setAttribute('download', name);
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href); // 释放URL 对象
      document.body.removeChild(a);
    },
    // 导入
    importXml() {
      this.$refs.importBtn.$el.click();
    },
    // 导入文件选择完成
    openBpmn(file) {
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = () => {
        const xml = reader.result.replace(/process id="(.*?)"/, 'process id="' + this.longProcess.id + '"');
        this.longProcess.content = xml;
        this.xmlStr = xml;
      };
      return false;
    },
    // toProcessDeploy() {
    //   this.open({
    //     title: '部署流程',
    //     path: '/ProcessDeploy',
    //     page: 'chore/longProcess/ProcessDeploy',
    //     type: 'SUB',
    //     width: '550px',
    //     class: 'aops-el-common',
    //     hideFooter: true,
    //     params: { ids: [this.longProcess.id] },
    //     success: () => {}
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
.LongProcessDetail {
  height:100%;
  .left-catalog-box {
    height: 100%;
    overflow: hidden;
    position: relative;
    transition: all ease 0.3s;
    &::v-deep .el-tabs {
      width: 250px;
      height: 100%;
      position: relative;
      left: 0;
      transition: all ease 0.3s;
      .el-tabs__header {
        .el-tabs__item {
          padding: 0 10px;
        }
        .el-tabs__item:last-child {
          border-right: none;
        }
      }
      .el-tabs__content {
        height: calc(100% - 56px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
  .middle-canvas-box {
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')
      repeat !important;
    padding: 0;
    overflow: hidden;
  }
  .right-property-box {
    padding-left: 12px;
    height: 100%;
    position: relative;
    transition: all ease 0.3s;
    overflow: hidden;
    .property-comp {
      &::v-deep .el-collapse-item__header {
        padding-right: 10px;
      }
      &::v-deep .el-collapse-item__content {
        padding: 0 10px 10px 0 !important;
      }
    }
  }
}
</style>
<style lang = 'scss'>
</style>
