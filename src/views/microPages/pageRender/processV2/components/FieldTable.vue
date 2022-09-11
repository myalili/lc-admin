<template>
  <div class="FieldTable">
    <el-row style="margin-bottom:10px">
      <el-button type="primary" size="mini" @click="toAddField">添加字段</el-button>
    </el-row>
    <el-table key="fields" :data="fields" size="mini" fit>
      <el-table-column label="字段名称" prop="name" />
      <el-table-column label="字段类型" prop="type" show-overflow-tooltip />
      <el-table-column label="字段值" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="toEditField(row, $index)">编辑</el-button>
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="fields.splice($index, 1)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Feild from '@uae/uae-bpmn-editor/definitions/processElements/common/field';
import ListenerFieldAdd from './chore/ListenerFieldAdd'
export default {
  mixins:[window.V8.mixins],
  name: 'FieldTable',
  props: {
    fields: {
      type: Array,
      require: true
    }
  },
  methods: {
    toAddField() {
      this.open({
        title: '添加字段',
        path: '/ListenerFieldAdd',
        component:ListenerFieldAdd,
        // page: 'microPages/process/components/chore/ListenerFieldAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.fields.push(new Feild(data));
        }
      });
    },
    toEditField(field, index) {
      this.open({
        title: '修改字段',
        path: '/ListenerFieldUpdate',
        component:ListenerFieldAdd,
        // page: 'microPages/process/components/chore/ListenerFieldAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        params: {
          field
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.$set(this.fields, index, new Feild(data));
        }
      });
    }
  }
};
</script>
