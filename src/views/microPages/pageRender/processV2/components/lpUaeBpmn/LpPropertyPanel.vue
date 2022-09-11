<template>
  <div class="long-property-pane">
    <el-collapse>
      <!-- 基础信息 ok-->
      <Information :node="node" :readonly="readonly" />
      <!-- 消息定义 -->
      <MessageConfig v-if="isProcess" :list="definitions.messages" :readonly="readonly" />
      <!-- 信号定义 -->
      <SignalConfig v-if="isProcess" :list="definitions.signals" :readonly="readonly" />
      <!-- 升级定义 -->
      <EscalationConfig v-if="isProcess" :list="definitions.escalations" :readonly="readonly" />
      <!-- 数据对象 -->
      <DataObjectConfig v-if="isProcess" :list="node.dataObjects" :readonly="readonly" />
      <!-- 调用活动 -->
      <CallActivityConfig v-if="isCallActivity" :data="node" :readonly="readonly" />
      <!-- 监听器 有五类可能需要重写弹窗-->
      <ExecutionListener :node="node" :readonly="readonly" />
      <!-- 任务监听器 只有三类-->
      <TaskListener v-if="isUserTask" :node="node" :readonly="readonly" />
      <!-- 表单配置 -->
      <FormPanel v-if="formPanelShow" :node="node" :readonly="readonly" />
      <!-- 多实例配置 ok-->
      <MultiInstance v-if="node.tagName && node.tagName.includes('Task')" :node="node" :readonly="readonly" />
      <!-- 服务任务-服务配置 -->
      <ServiceConfig v-if="node.tagName && node.tagName === 'serviceTask'" :node="node" :readonly="readonly" />
      <!-- 条件配置 ok-->
      <ConditionConfig v-if="node.tagName && node.tagName === 'sequenceFlow'" :sequence="node" :readonly="readonly" />
      <!-- 会签信息 ok-->
      <CounterSignMsg v-if="node.tagName && node.tagName === 'userTask'" :node="node" :readonly="readonly" />
      <!-- 扩展属性 ok-->
      <ExetensionProperty :node="node" :readonly="readonly" />
    </el-collapse>
  </div>
</template>

<script>
import Process from '@uae/uae-bpmn-editor/definitions/definitionElements/process';
import UserTask from '@uae/uae-bpmn-editor/definitions/processElements/task/userTask';
import Information from './properties/Information';
import ExecutionListener from './properties/ExecutionListener';
import TaskListener from './properties/TaskListener';
import ExetensionProperty from './properties/ExetensionProperty';
import MultiInstance from './properties/MultiInstance';
import ConditionConfig from './properties/ConditionConfig';
import FormPanel from './properties/FormPanel';
import ServiceConfig from './properties/ServiceConfig';
import CounterSignMsg from './properties/CounterSignMsg';
import MessageConfig from './properties/MessageConfig';
import SignalConfig from './properties/SignalConfig';
import EscalationConfig from './properties/EscalationConfig';
import DataObjectConfig from './properties/DataObjectConfig';
import CallActivityConfig from './properties/CallActivityConfig';
import CallActivity from '@uae/uae-bpmn-editor/definitions/processElements/construction/callActivity';

export default {
  name: 'LpPropertyPanel',
  components: {
    Information,
    ExecutionListener,
    TaskListener,
    ExetensionProperty,
    MultiInstance,
    ConditionConfig,
    FormPanel,
    ServiceConfig,
    CounterSignMsg,
    MessageConfig,
    SignalConfig,
    EscalationConfig,
    DataObjectConfig,
    CallActivityConfig
  },
  props: {
    definitions: {
      type: Object,
      require: true
    },
    node: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      require: false
    }
  },
  computed: {
    isProcess() {
      return this.node instanceof Process;
    },
    isUserTask() {
      return this.node instanceof UserTask;
    },
    isCallActivity() {
      return this.node instanceof CallActivity;
    },
    formPanelShow() {
      if ('tagName' in this.node && (this.node.tagName === 'startEvent' || this.node.tagName === 'userTask')) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="less">
.long-property-pane {
  height: 100%;
  width: 100%;
  .panel-tab__title {
    font-weight: 600;
    padding: 0 8px;
    font-size: 1.1em;
    i {
      margin-right: 8px;
    }
  }
  .opr_bottom_button {
    margin-top: 16px;
    width: 100%;
    display: inline-flex;
    justify-content: space-around;
    > .el-button {
      width: 100%;
    }
  }
}
</style>
