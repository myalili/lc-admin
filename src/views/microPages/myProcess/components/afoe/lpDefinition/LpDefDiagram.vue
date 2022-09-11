<template>
  <el-container class="PreviewDiagram" v-loading="xmlStrLoading">
    <el-main>
      <div class="canvas" ref="canvas"></div>
    </el-main>
    <!-- <el-footer style="text-align: right; height: auto !important; padding: 10px 20px 20px;">
      <el-button type="primary" @click="close()">确定</el-button>
    </el-footer> -->
  </el-container>
</template>
<script>
import BpmnViewer from 'bpmn-js/lib/Viewer';
// import { mapActions } from 'vuex';
const { getInvokeResponse} =window.aopsUtils;
const {queryLpDefModelXml} = window.getAopsApi();
export default {
  
  mixins:[window.V8.mixins],
  name: 'ProcessDiagram',
  data() {
    return {
      xmlStr: '',
      xmlStrLoading: false
    };
  },
  methods: {
    // ...mapActions('lpDefinition', ['getModelXml']),
    async loadModelXml() {
      this.xmlStrLoading = true;
      try {
        const res = await this.getModelXml({
          clusterId: this.AParams.clusterId,
          procDefId: this.AParams.processDefinitionId
        });
        this.xmlStr = res;
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
      this.xmlStrLoading = false;
    },
    async createNewDiagram() {
      this.bpmnViewer = new BpmnViewer({
        container: this.$refs.canvas
      });
      await this.bpmnViewer.importXML(this.xmlStr);
      const canvas = this.bpmnViewer.get('canvas');
      canvas.zoom('fit-viewport', 'auto');
    },
    async getModelXml({ clusterId, procDefId }) {
        // console.log(111111)
        return await getInvokeResponse(queryLpDefModelXml({ clusterId, procDefId }), '获取流程定义视图xml');
      },
  },
  async mounted() {
    await this.loadModelXml();
    this.createNewDiagram();
  }
};
</script>
<style lang="scss">
.aweb-dialog {
    .PreviewDiagram {
      .el-main {
        height: 400px;
        padding: 20px;
        .canvas {
          height: 100%;
        }
        .bjs-powered-by {
          display: none;
        }
      }
    }
}
</style>
