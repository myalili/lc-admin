<template>
  <el-collapse-item name="CountersignPanel">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-info"></i> 会签消息</div>
    <el-form size="mini" :model="node.agreeSignVote" label-width="80px">
      <el-form-item label="开启会签">
        <el-switch v-model="isOpenVote" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="node.agreeSignVote.strategy" clearable>
          <el-option label="全票通过" value="ALL_AGREE" />
          <el-option label="比例通过" value="PERCENTAGE_AGREE" />
          <el-option label="指定人 + 比例" value="PERCENTAGE_AGREE,ONE_VOTE_DISAPPROVAL" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="比例"
        prop="percentage"
        v-if="['PERCENTAGE_AGREE', 'PERCENTAGE_AGREE,ONE_VOTE_DISAPPROVAL'].includes(node.agreeSignVote.strategy)"
      >
        <el-input-number v-model="node.agreeSignVote.percentage" :min="0" :max="100">
        </el-input-number>%
      </el-form-item>
      <el-form-item label="处理人">
        <CounterSignAssigneeSelected
          v-model="userIds"
          type="checkbox"
          useronly
          :assigneeList.sync="node.agreeSignVote.usersData"
          :execType="node.multiInstance.type"
          :readonly="readonly"
        />
      </el-form-item>
      <el-form-item
        v-if="['PERCENTAGE_AGREE,ONE_VOTE_DISAPPROVAL'].includes(node.agreeSignVote.strategy)"
        label="指定人"
      >
        <el-select clearable v-model="node.agreeSignVote.oneVoteDisapproval">
          <el-option
            v-for="item in node.agreeSignVote.usersData"
            :key="item.userCode"
            :label="item.userName"
            :value="item.userCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行方式">
        <el-select v-model="node.multiInstance.type">
          <el-option label="串行" value="sequential"></el-option>
          <el-option label="并行" value="parallel"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script>
import CounterSignAssigneeSelected from './CounterSignAssigneeSelected.vue';

// import { getSystemApi } from '@/api/workflowApi.js';

export default {
  name: 'CounterSignMsg',
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
  components: {
    CounterSignAssigneeSelected
  },
  data() {
    return {
      multiType: ['parallel', 'sequential']
    };
  },
  computed: {
    userIds: {
      get() {
        return this.node.multiInstance.collection?.replace("${ListService.asList('", '')?.replace("')}", '');
      },
      set(val) {
        this.node.multiInstance.collection = `\${ListService.asList('${val}')}`;
      }
    },
    isOpenVote: {
      get() {
        return !!this.node.agreeSignVote.strategy;
      },
      set(val) {
        if (val === true) {
          this.node.assignee = '${assignee}';
          this.node.multiInstance.elementVariable = 'assignee';
          this.node.multiInstance.completionCondition = '${MultiTaskService.accessCondition(execution)}';
          this.node.multiInstance.type = 'parallel';
          this.node.agreeSignVote.strategy = 'ALL_AGREE';
          this.node.agreeSignVote.percentage = '';
          this.node.agreeSignVote.oneVoteDisapproval = '';
        } else {
          this.node.assignee = '';
          this.node.multiInstance.elementVariable = '';
          this.node.multiInstance.completionCondition = '';
          this.node.multiInstance.collection = '';
          this.node.multiInstance.type = '';
          this.node.agreeSignVote.usersData = [];
          this.node.agreeSignVote.assigneeList = [];
          this.node.agreeSignVote.strategy = '';
          this.node.agreeSignVote.percentage = '';
          this.node.agreeSignVote.oneVoteDisapproval = '';
        }
      }
    }
  }
};
</script>
