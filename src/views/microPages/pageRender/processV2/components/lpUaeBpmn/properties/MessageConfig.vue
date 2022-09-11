<template>
  <el-collapse-item name="message-config">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-question"></i> 消息定义</div>
    <el-table :data="list" size="mini">
      <el-table-column label="消息id" prop="id" min-width="80px" show-overflow-tooltip />
      <el-table-column label="消息名称" prop="name" min-width="80px" show-overflow-tooltip />
      <el-table-column v-if="!readonly" label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="toEditItem(row)">编辑</el-button>
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="list.splice($index, 1)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="!readonly" size="mini" type="primary" @click="toAddItem" style="width:100%"
      >添加消息定义</el-button
    >
  </el-collapse-item>
</template>

<script>
import Message from '@uae/uae-bpmn-editor/definitions/processElements/message';
import MessageAdd from '../../chore/MessageAdd';
export default {
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
  mixins:[window.V8.mixins],
  methods: {
    toAddItem() {
      this.open({
        title: '添加消息定义',
        path: '/MessageAdd',
        component:MessageAdd,
        // page: 'microPages/process/components/chore/MessageAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '550px',
        // hideFooter: true,
        hideCancelBtn:true,
        hideConfirmBtn:true,
        confirmCallback: data => {
          this.list.push(new Message(data));
        }
      });
    },
    toEditItem(item) {
      this.open({
        title: '编辑消息定义',
        path: '/MessageAdd',
        component:MessageAdd,
        // page: 'microPages/process/components/chore/MessageAdd',
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
