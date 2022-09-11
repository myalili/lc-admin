<template>
  <div class="HttpParamTable">
    <el-row style="margin-bottom:10px">
      <el-button type="primary" size="mini" @click="toAddHttpParam">添加参数</el-button>
    </el-row>
    <el-table :data="params" size="mini" fit>
      <el-table-column label="参数名称" prop="name" show-overflow-tooltip />
      <el-table-column label="参数位置" prop="in" show-overflow-tooltip />
      <el-table-column label="参数值" prop="value" show-overflow-tooltip></el-table-column>
      <el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="toEditHttpParam(row, $index)">编辑</el-button>
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="params.splice($index, 1)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import HttpParamAdd from "./chore/HttpParamAdd"
export default {
  mixins:[window.V8.mixins],
  name: 'HttpParamTable',
  props: {
    params: {
      type: Array,
      require: true
    }
  },
  methods: {
    toAddHttpParam() {
      this.open({
        title: '添加参数',
        path: '/HttpParamAdd',
        component:HttpParamAdd,
        // page: 'microPages/process/components/chore/HttpParamAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.params.push(data);
        }
      });
    },
    toEditHttpParam(param, index) {
      this.open({
        title: '修改参数',
        path: '/HttpParamAdd',
        component:HttpParamAdd,
        // page: 'microPages/process/components/chore/HttpParamAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        params: {
          param
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.$set(this.params, index, data);
        }
      });
    }
  }
};
</script>
