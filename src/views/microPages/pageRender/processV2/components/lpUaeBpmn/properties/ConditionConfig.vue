<template>
  <el-collapse-item name="condition" class="SequenceFlowPanel">
    <!-- conditionExpression -->
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-question"></i> 条件配置</div>
    <el-form size="mini" label-width="80px">
      <el-form-item label="类型">
        <el-select v-model="sequenceType" size="mini" :disabled="readonly">
          <el-option label="普通流转路径" value="normal" />
          <!-- <el-option label="默认流转路径" value="default" /> -->
          <el-option label="条件流转路径" value="condition" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="sequenceType === 'condition'" label="表达式">
        <el-input v-model="sequence.conditionExpression.value" clearable :disabled="readonly" />
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script>
import ConditionExpression from '@uae/uae-bpmn-editor/definitions/processElements/common/conditionExpression';
export default {
  name: 'ConditionConfig',
  props: {
    sequence: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    sequenceType: {
      get() {
        if (!this.sequence.conditionExpression) {
          return 'normal';
        } else {
          return 'condition';
        }
      },
      set(val) {
        if (val === 'normal') {
          this.sequence.conditionExpression = null;
        } else if (val === 'condition') {
          this.sequence.conditionExpression = new ConditionExpression({ type: 'tFormalExpression', value: '' });
        }
      }
    }
  }
};
</script>
