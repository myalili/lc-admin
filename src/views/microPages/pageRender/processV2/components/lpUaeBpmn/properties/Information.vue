<template>
  <el-collapse-item class="property-information">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-info"></i> 常规</div>
    <el-form size="mini" :model="node" label-width="80px">
      <el-form-item label="ID">
        <el-input v-model="node.id" :disabled="readonly || isProcess" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="node.name" :disabled="readonly" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="版本标签" v-if="'versionTag' in node">
        <el-input v-model="node.versionTag" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="可执行" v-if="node.hasOwnProperty('isExecutable')">
        <el-switch v-model="node.isExecutable" />
      </el-form-item>
      <el-form-item label="元素文档">
        <el-input type="textarea" v-model="node.documentation" :disabled="readonly" placeholder="请输入" />
      </el-form-item>
      <el-form-item v-if="node.tagName === 'userTask' && node.assignee !== '${assignee}'" label="处理人">
        <CounterSignAssigneeSelected
          v-model="node.assignee"
          :assigneeList.sync="node.agreeUsers.assigneeList"
          :readonly="readonly"
          hideRoleTab
          useronly
        />
      </el-form-item>
      <el-form-item v-if="node.tagName === 'userTask' && node.assignee !== '${assignee}'" label="候选组">
        <CounterSignAssigneeSelected
          v-model="node.candidateGroups"
          type="checkbox"
          :useronly="false"
          :assigneeList.sync="node.agreeUsers.candidateList"
          :readonly="readonly"
        />
      </el-form-item>
      <!-- <el-form-item label="优先级" v-if="node.tagName === 'userTask'">
        <el-input-number
          v-model="node.priority"
          size="small"
          :precision="0"
          :step="1"
          :max="1000"
          :disabled="readonly"
        />
      </el-form-item> -->
      <template v-if="isTimer">
        <el-form-item label="定时类型">
          <el-select v-model="node.timerEventDefinition.type">
            <el-option value="timeDate" label="开始时间" />
            <el-option value="timeCycle" label="循环时间" />
            <el-option value="timeDuration" label="持续时间" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="node.timerEventDefinition.type === 'timeDate'" label="开始时间">
          <el-input v-model="node.timerEventDefinition.timeDate" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="node.timerEventDefinition.type === 'timeCycle'" label="循环时间">
          <el-input v-model="node.timerEventDefinition.timeCycle" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="node.timerEventDefinition.type === 'timeDuration'" label="持续时间">
          <el-input v-model="node.timerEventDefinition.timeDuration" placeholder="请输入" />
        </el-form-item>
      </template>
    </el-form>
  </el-collapse-item>
</template>

<script>
import Process from '@uae/uae-bpmn-editor/definitions/definitionElements/process';
import StartEventType from '@uae/uae-bpmn-editor/definitions/enums/startEventType';
import BoundaryEventType from '@uae/uae-bpmn-editor/definitions/enums/boundaryEventType';
import IntermediateCatchEventType from '@uae/uae-bpmn-editor/definitions/enums/intermediateCatchEventType';
import CounterSignAssigneeSelected from './CounterSignAssigneeSelected';
export default {
  name: 'Information',
  components: {
    CounterSignAssigneeSelected
  },
  props: {
    node: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isProcess() {
      return this.node instanceof Process;
    },
    isTimer() {
      if (this.node.tagName === 'startEvent') {
        return this.node.type === StartEventType.TIMER;
      }
      if (this.node.tagName === 'boundaryEvent') {
        return this.node.type === BoundaryEventType.TIMER;
      }
      if (this.node.tagName === 'intermediateCatchEvent') {
        return this.node.type === IntermediateCatchEventType.TIMER;
      }
      return false;
    }
  }
};
</script>
