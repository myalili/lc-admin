<template>
  <div class="bpmn-elements-catalog">
    <el-tree :data="treeData" :props="defaultProps" default-expand-all>
      <span class="custom-tree-node" slot-scope="{ data }">
        <span @dragstart.prevent="$emit('dragstart', data, $event)" draggable>
          <i :class="data.icon" style="font-size:14px;"></i>
          {{ data.name }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import StartEventType from '@uae/uae-bpmn-editor/definitions/enums/startEventType';
import EndEventType from '@uae/uae-bpmn-editor/definitions/enums/endEventType';
import IntermediateCatchEventType from '@uae/uae-bpmn-editor/definitions/enums/intermediateCatchEventType';
import IntermediateThrowEventType from '@uae/uae-bpmn-editor/definitions/enums/intermediateThrowEventType';
import BoundaryEventType from '@uae/uae-bpmn-editor/definitions/enums/boundaryEventType';

export default {
  name: 'LpBpmnElements',
  computed: {
    defaultProps: () => ({
      children: 'children',
      label: 'name',
      icon: 'icon'
    }),
    startEvent: () => [
      {
        name: '空启动事件',
        icon: 'bpmn-icon-start-event-none',
        model: 'startEvent',
        props: { type: StartEventType.EMPTY }
      },
      {
        name: '定时启动事件',
        icon: 'bpmn-icon-start-event-timer',
        model: 'startEvent',
        props: { type: StartEventType.TIMER }
      },
      {
        name: '信号启动事件',
        icon: 'bpmn-icon-start-event-signal',
        model: 'startEvent',
        props: { type: StartEventType.SIGNAL }
      },
      {
        name: '消息启动事件',
        icon: 'bpmn-icon-start-event-message',
        model: 'startEvent',
        props: { type: StartEventType.MESSAGE }
      },
      {
        name: '异常启动事件',
        icon: 'bpmn-icon-start-event-error',
        model: 'startEvent',
        props: { type: StartEventType.ERROR }
      },
      // { name: '注册启动事件', icon: 'bpmn-icon-start-event-registry', model: 'startEvent', props: { type: StartEventType.REGISTRY } },
      {
        name: '升级启动事件',
        icon: 'bpmn-icon-start-event-escalation',
        model: 'startEvent',
        props: { type: StartEventType.ESCALATION }
      },
      {
        name: '条件启动事件',
        icon: 'bpmn-icon-start-event-condition',
        model: 'startEvent',
        props: { type: StartEventType.CONDITIONAL }
      }
    ],
    task: () => [
      { name: '用户任务', icon: 'bpmn-icon-user-task', model: 'userTask' },
      { name: '服务任务', icon: 'bpmn-icon-service-task', model: 'serviceTask' },
      { name: '脚本任务', icon: 'bpmn-icon-script-task', model: 'scriptTask' },
      { name: '业务任务', icon: 'bpmn-icon-business-rule-task', model: 'businessRuleTask' },
      { name: '接收任务', icon: 'bpmn-icon-receive-task', model: 'receiveTask' },
      { name: '手动任务', icon: 'bpmn-icon-manual-task', model: 'manualTask' }
      // { name: '邮件任务', icon: 'bpmn-icon-mail-task' },
      // { name: '驼峰任务', icon: 'bpmn-icon-user-task' },
      // { name: 'http任务', icon: 'bpmn-icon-user-task' },
      // { name: 'Mule任务', icon: 'bpmn-icon-user-task' }
    ],
    construction: () => [
      { name: '子流程', icon: 'bpmn-icon-subprocess-expanded', model: 'subProcess' },
      {
        name: '折叠子流程',
        icon: 'bpmn-icon-subprocess-collapsed',
        model: 'subProcess',
        shapeProps: { isExpanded: false, bounds: { width: 100, height: 80 } }
      },
      {
        name: '事件子流程',
        icon: 'bpmn-icon-event-subprocess-expanded',
        model: 'subProcess',
        props: { triggeredByEvent: true }
      },
      { name: '事务子流程', icon: 'bpmn-icon-transaction', model: 'transaction' },
      { name: '调用活动', icon: 'bpmn-icon-call-activity', model: 'callActivity' }
    ],
    gateway: () => [
      { name: '排他网关', icon: 'bpmn-icon-gateway-xor', model: 'exclusiveGateway' },
      { name: '并行网关', icon: 'bpmn-icon-gateway-parallel', model: 'parallelGateway' },
      { name: '包容网关', icon: 'bpmn-icon-gateway-or', model: 'inclusiveGateway' },
      { name: '事件网关', icon: 'bpmn-icon-gateway-eventbased', model: 'eventBasedGateway' }
    ],
    boundaryEvent: () => [
      {
        name: '边界错误事件',
        icon: 'bpmn-icon-intermediate-event-catch-error',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.ERROR }
      },
      {
        name: '边界升级事件',
        icon: 'bpmn-icon-intermediate-event-catch-escalation',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.ESCALATION }
      },
      {
        name: '边界计时事件',
        icon: 'bpmn-icon-intermediate-event-catch-timer',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.TIMER }
      },
      {
        name: '边界信号事件',
        icon: 'bpmn-icon-intermediate-event-catch-signal',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.SIGNAL }
      },
      {
        name: '边界消息事件',
        icon: 'bpmn-icon-intermediate-event-catch-message',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.MESSAGE }
      },
      {
        name: '边界取消事件',
        icon: 'bpmn-icon-intermediate-event-catch-cancel',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.CANCEL }
      },
      {
        name: '边界注册事件',
        icon: 'bpmn-icon-intermediate-event-none',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.REGISTRY }
      },
      {
        name: '边界条件事件',
        icon: 'bpmn-icon-intermediate-event-catch-condition',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.CONDITIONAL }
      },
      {
        name: '边界补偿事件',
        icon: 'bpmn-icon-intermediate-event-catch-compensation',
        model: 'boundaryEvent',
        props: { type: BoundaryEventType.COMPENSATE }
      }
    ],
    intermediateCatchEvent: () => [
      {
        name: '中间计时捕获事件',
        icon: 'bpmn-icon-intermediate-event-catch-timer',
        model: 'intermediateCatchEvent',
        props: { type: IntermediateCatchEventType.TIMER }
      },
      {
        name: '中间信号捕获事件',
        icon: 'bpmn-icon-intermediate-event-catch-signal',
        model: 'intermediateCatchEvent',
        props: { type: IntermediateCatchEventType.SIGNAL }
      },
      {
        name: '中间消息捕获事件',
        icon: 'bpmn-icon-intermediate-event-catch-message',
        model: 'intermediateCatchEvent',
        props: { type: IntermediateCatchEventType.MESSAGE }
      },
      {
        name: '中间条件捕获事件',
        icon: 'bpmn-icon-intermediate-event-catch-condition',
        model: 'intermediateCatchEvent',
        props: { type: IntermediateCatchEventType.CONDITIONAL }
      }
    ],
    intermediateThrowEvent: () => [
      {
        name: '中间无抛出事件',
        icon: 'bpmn-icon-intermediate-event-none',
        model: 'intermediateThrowEvent',
        props: { type: IntermediateThrowEventType.EMPTY }
      },
      {
        name: '中间信号抛出事件',
        icon: 'bpmn-icon-intermediate-event-throw-signal',
        model: 'intermediateThrowEvent',
        props: { type: IntermediateThrowEventType.SIGNAL }
      },
      {
        name: '中间升级抛出事件',
        icon: 'bpmn-icon-intermediate-event-throw-escalation',
        model: 'intermediateThrowEvent',
        props: { type: IntermediateThrowEventType.ESCALATION }
      }
    ],
    endEvent: () => [
      { name: '空结束事件', icon: 'bpmn-icon-end-event-none', model: 'endEvent', props: { type: EndEventType.EMPTY } },
      {
        name: '错误结束事件',
        icon: 'bpmn-icon-end-event-error',
        model: 'endEvent',
        props: { type: EndEventType.ERROR }
      },
      {
        name: '升级结束事件',
        icon: 'bpmn-icon-end-event-escalation',
        model: 'endEvent',
        props: { type: EndEventType.ESCALATION }
      },
      {
        name: '取消结束事件',
        icon: 'bpmn-icon-end-event-cancel',
        model: 'endEvent',
        props: { type: EndEventType.CANCEL }
      },
      {
        name: '结束终止事件',
        icon: 'bpmn-icon-end-event-terminate',
        model: 'endEvent',
        props: { type: EndEventType.TERMINATE }
      }
    ],
    lane: () => [{ name: '泳池', icon: 'bpmn-icon-lane', model: 'laneSet' }],
    tools: () => [{ name: '文本', icon: 'bpmn-icon-text-annotation' }],
    treeData() {
      return [
        { id: 'startEvent', name: '启动事件', children: this.startEvent },
        { id: 'task', name: '任务', children: this.task },
        { id: 'construction', name: '结构', children: this.construction },
        { id: 'gateway', name: '网关', children: this.gateway },
        { id: 'boundaryEvent', name: '边界事件', children: this.boundaryEvent },
        { id: 'intermediateCatchEvent', name: '中间捕捉事件', children: this.intermediateCatchEvent },
        { id: 'intermediateThrowEvent', name: '中间抛出事件', children: this.intermediateThrowEvent },
        { id: 'endEvent', name: '结束事件', children: this.endEvent },
        { id: 'lane', name: '泳道', children: this.lane }
        // { id: 'tools', name: '工件', children: this.tools }
      ];
    }
  }
};
</script>

<style lang="less">
.bpmn-elements-catalog {
  height: 100%;
  overflow: overlay;
  .el-tree {
    width: 100%;
    .custom-tree-node {
      width: 100%;
      display: block;
      height: 100%;
      line-height: 30px;
      > span {
        display: block;
        .icon-jiaoben-copy,
        .icon-danfuwu {
          font-size: 12px;
          color: #457ce2;
        }
      }
    }
  }
}
</style>
