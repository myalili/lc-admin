<template>
  <el-container class="instance-diagram" v-loading="loading">
    <div class="canvas" ref="canvas"></div>
    <div style="width: 30%" v-if="serviceOption.length">
      选择:
      <el-select v-model="serviceType">
        <el-option v-for="item in serviceOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <CodeEditor :value="logContent" :options="editorOptions" style="height: 400px"></CodeEditor>
    </div>
  </el-container>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/Viewer';
// import CodeEditor from '@/components/common/CodeEditor';
import { mapActions } from 'vuex';

export default {
  store:window.aopsStore,
  name: 'LpInstDiagram',
  mixins:[window.V8.mixins],
  components: {
    // CodeEditor
  },
  mounted() {
    console.log(this.AParams)
    this.$nextTick(() => {
      this.init();
    });
  },
  data() {
    return {
      xmlStr: '',
      xmlStrLoading: false,
      jsonList: null,
      jsonListLoading: false,
      serviceOption: [],
      tasksList: null,
      tasksListLoading: false,
      logList: null,
      logListLoading: false,
      editorOptions: {
        lineNumbers: false,
        readOnly: true
      },
      serviceType: ''
    };
  },
  computed: {
    loading() {
      return this.xmlStrLoading || this.jsonListLoading || this.tasksListLoading || this.logListLoading;
    },
    logContent() {
      let serviceLog = null;
      this.logList.forEach(item => {
        if (this.serviceType === item.id) {
          serviceLog = this.logContentFormat(item.response);
        }
      });
      return serviceLog;
    }
  },
  methods: {
    ...mapActions('lpInstance1', ['getModelXml', 'getModelJson', 'getTasks', 'getCallLogs']),
    async init() {
      await this.loadInstanceXML();
      await this.loadInstanceJson();
      await this.loadQueryTasks();
      await this.loadQueryLog();
      await this.createNewDiagram();
      await this.$nextTick();
      this.bindEvent();
    },
    async loadInstanceXML() {
      this.xmlStrLoading = true;
      try {
        this.xmlStr = await this.getModelXml({ clusterId: this.AParams.clusterId, lpInstId: this.AParams.id });
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
      this.xmlStrLoading = false;
    },
    async loadInstanceJson() {
      this.jsonListLoading = true;
      try {
        const res = await this.getModelJson({ clusterId: this.AParams.clusterId, lpInstId: this.AParams.id });
        this.jsonList = res?.elements ?? [];
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
      this.jsonListLoading = false;
    },
    async loadQueryTasks() {
      this.tasksListLoading = true;
      try {
        this.tasksList = await this.getTasks({ clusterId: this.AParams.clusterId, lpInstId: this.AParams.id });
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
      this.tasksListLoading = false;
    },
    async loadQueryLog() {
      this.logListLoading = true;
      try {
        this.logList = await this.getCallLogs({ clusterId: this.AParams.clusterId, lpInstId: this.AParams.id });
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
      this.logListLoading = false;
    },
    async createNewDiagram() {
      this.bpmnViewer = new BpmnViewer({
        container: this.$refs.canvas
      });
      await this.bpmnViewer.importXML(this.xmlStr);
      // 屏幕自适应
      const canvas = this.bpmnViewer.get('canvas');
      canvas.zoom('fit-viewport', 'auto');
      //循环节点添加颜色
      this.jsonList.forEach(item => {
        if (item.current) {
          canvas.addMarker(item.id, 'highlight');
          return;
        }
        if (item.completed && !item.current) {
          canvas.addMarker(item.id, 'highlight-1');
          return;
        }
        if (!item.completed && !item.current) {
          canvas.addMarker(item.id, 'highlight-0');
          return;
        }
      });
    },
    bindEvent() {
      //注册鼠标悬浮事件
      const eventBus = this.bpmnViewer.get('eventBus');
      const overlays = this.bpmnViewer.get('overlays');
      eventBus.on('element.hover', e => {
        if (!e || e.element.type === 'bpmn:ServiceTask' || e.element.type === 'bpmn:UserTask') {
          overlays.clear();
          let str = '';
          this.jsonList.forEach(item => {
            if (item.id === e.element.id) {
              if (!item.properties.length) return;
              str += item.type + ' ' + item.id + '\n';
              item.properties.forEach(item1 => {
                if (item1.type === 'list') {
                  str += item1.name + ':' + item1.value.join(',') + '\n';
                } else {
                  str += item1.name + ':' + item1.value + '\n';
                }
              });
            }
          });
          this.tasksList.forEach(item => {
            if (item.taskDefinitionKey === e.element.id) {
              str += '<hr/>';
              str += item.name + ' ' + item.id + '\n';
              str += new Date(item.created) + ' --- ' + new Date(item.endDate) ?? '' + '\n';
            }
          });
          let overlayHtml = '';
          if (str) {
            overlayHtml = `<div class="highlight-overlay">${str}</div>`;
          } else {
            overlayHtml = `<div>${str}</div>`;
          }
          overlays.add(e.element.id, {
            position: { top: e.element.height, left: -e.element.width / 2 },
            html: overlayHtml
          });
        }
      });
      //鼠标点击事件
      eventBus.on('element.click', e => {
        overlays.clear();
        this.serviceOption = [];
        this.logList.forEach(item => {
          if (e.element.id === item.activityId) {
            this.serviceType = item.id;
            this.serviceOption.push({
              label: item.eventType ? '监听器' + '---' + item.eventType : '微服务',
              value: item.id
            });
          }
        });
      });
      eventBus.on('element.out', () => {
        // overlays.clear();
      });
    },
    logContentFormat(log) {
      try {
        log = JSON.parse(log);
        log = JSON.stringify(log, undefined, 4);
        return log;
      } catch (err) {
        return log;
      }
    }
  }
};
</script>

<style lang="scss">
.instance-diagram {
  .bjs-powered-by {
    display: none;
  }
  .bjs-breadcrumbs{
    display:none
  }
  .canvas {
    position: relative;
    height: 400px;
    // width: 70%;
    flex: 1;
    z-index: 9;
  }
  .highlight-overlay {
    margin-top: 5px;
    height: auto;
    width: 500px;
    position: relative;
    z-index: 9999;
    font-size: 13px;
    padding: 5px;
    border: solid 1px #000;
    background-color: #f6f6f6;
    white-space: pre-line;
  }
  .djs-container {
    overflow: visible !important;
  }
  .highlight .djs-visual > :nth-child(1) {
    stroke: green !important;
    stroke-width: 5px !important;
    fill: white !important;
  }
  .highlight-0 .djs-visual > :nth-child(1) {
    stroke: gray !important;
    stroke-width: 5px !important;
    fill: white !important;
  }
  .highlight-1 .djs-visual > :nth-child(1) {
    stroke: #333333 !important;
    fill: #f8f8f8 !important;
  }
}
.invoke-process-long-InstanceDiagram-SUB .el-dialog__body {
  overflow: visible;
}
</style>
