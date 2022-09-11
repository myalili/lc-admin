<template>
  <el-collapse-item name="escalation-config">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-question"></i> 升级定义</div>
    <el-table :data="list" size="mini">
      <el-table-column label="id" prop="id" min-width="80px" show-overflow-tooltip />
      <el-table-column label="名称" prop="name" min-width="80px" show-overflow-tooltip />
      <el-table-column v-if="!readonly" label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="toEditItem(row)">编辑</el-button>
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="list.splice($index, 1)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="!readonly" size="mini" type="primary" @click="toAddItem" style="width:100%"
      >添加升级定义</el-button
    >
  </el-collapse-item>
</template>

<script>
import Escalation from '@uae/uae-bpmn-editor/definitions/processElements/escalation';
import EscalationAdd from "../../chore/EscalationAdd"
export default {
  mixins:[window.V8.mixins],
  props: {
    list: {
      type: Array,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toAddItem() {
      this.open({
        title: '添加升级定义',
        path: '/EscalationAdd',
        component:EscalationAdd,
        // page: 'microPages/process/components/chore/EscalationAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '550px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.list.push(new Escalation(data));
        }
      });
    },
    toEditItem(item) {
      this.open({
        title: '编辑升级定义',
        path: '/EscalationAdd',
        // page: 'microPages/process/components/chore/EscalationAdd',
        component:EscalationAdd,
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: { item },
        confirmCallback: data => {
          Object.assign(item, data);
        }
      });
    }
  }
};
</script>
