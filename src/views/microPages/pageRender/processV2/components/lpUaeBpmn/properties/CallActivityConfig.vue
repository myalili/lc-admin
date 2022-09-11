<template>
  <el-collapse-item name="call-activity">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-question"></i> 调用活动</div>
    <el-form size="mini" label-width="80px" :disabled="readonly">
      <el-form-item label="被调用类型">
        <el-select v-model="data.calledElementType" size="mini" @change="data.calledElement = ''">
          <el-option label="流程定义id" value="id" />
          <el-option label="流程ID" value="key" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.calledElementType === 'id'" label="流程定义id">
        <el-input v-model="data.calledElement" clearable placeholder="请输入">
          <el-button slot="append" @click="toLpDefChoose">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item v-if="data.calledElementType === 'key'" label="流程ID">
        <el-input v-model="data.calledElement" clearable placeholder="请输入">
          <el-button slot="append" @click="toLpDefChoose">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="业务key">
        <el-input v-model="data.businessKey" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="实例名称">
        <el-input v-model="data.processInstanceName" clearable placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-divider><i class="el-icon-coin"></i> 输入</el-divider>
    <el-table :data="data.ins" size="mini" max-height="240" fit>
      <el-table-column label="输入参数源" prop="source" show-overflow-tooltip />
      <el-table-column label="目标" prop="target" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="toEditItem(row)" :disabled="readonly">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: #ff4d4f"
            :disabled="readonly"
            @click="data.ins.splice($index, 1)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="opr_bottom_button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddIn" :disabled="readonly"
        >添加字段</el-button
      >
    </div>
    <el-divider><i class="el-icon-coin"></i> 输出</el-divider>
    <el-table :data="data.outs" size="mini" max-height="240" fit>
      <el-table-column label="输出参数源" prop="source" show-overflow-tooltip />
      <el-table-column label="目标" prop="target" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="toEditItem(row)" :disabled="readonly">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: #ff4d4f"
            :disabled="readonly"
            @click="data.outs.splice($index, 1)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="opr_bottom_button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddOut" :disabled="readonly"
        >添加字段</el-button
      >
    </div>
  </el-collapse-item>
</template>

<script>
import CallActivity from '@uae/uae-bpmn-editor/definitions/processElements/construction/callActivity';
import Out from '@uae/uae-bpmn-editor/definitions/processElements/common/out';
import In from '@uae/uae-bpmn-editor/definitions/processElements/common/In';
import LpChoose from "../../chore/LpChoose"
import InOutAdd from "../../chore/InOutAdd"

export default {
  mixins:[window.V8.mixins],
  name: 'CallActivityConfig',
  props: {
    data: {
      type: CallActivity,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toLpDefChoose() {
      const type = this.data.calledElementType;
      this.open({
        title: `选择流程定义${type}`,
        path: '/LpChoose',
        component:LpChoose,
        // page: 'microPages/process/components/chore/LpChoose',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '800px',
        // hideFooter: true,
        hideCancelBtn:true,
        hideConfirmBtn:true,
        params: {
          showHistory: type === 'id',
          lpId: this.PageParams.id||this.AParams.id
        },
        confirmCallback: data => {
          if (type === 'id') {
            this.data.calledElement = `${data.id}:${data.version}`;
          } else if (type === 'key') {
            this.data.calledElement = data.id;
          }
        }
      });
    },
    toAddIn() {
      this.open({
        title: '添加',
        path: '/InOutAdd',
        component:InOutAdd,
        // page: 'microPages/process/components/chore/InOutAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.data.ins.push(new In(data));
        }
      });
    },
    toAddOut() {
      this.open({
        title: '添加',
        path: '/InOutAdd',
        component:InOutAdd,
        // page: 'microPages/process/components/chore/InOutAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.data.outs.push(new Out(data));
        }
      });
    },
    toEditItem(item) {
      this.open({
        title: '编辑',
        path: '/InOutAdd',
        component:InOutAdd,
        // page: 'microPages/process/components/chore/InOutAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        // hideFooter: true,
        hideCancelBtn:true,
        hideConfirmBtn:true,
        params: { item },
        confirmCallback: data => {
          Object.assign(item, data);
        }
      });
    }
  }
};
</script>
