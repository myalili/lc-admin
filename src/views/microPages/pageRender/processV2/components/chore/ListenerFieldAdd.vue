<template>
  <el-container class="ListenerFieldAdd">
    <el-main>
      <el-form :model="formData" size="mini" label-width="96px" ref="form1" label-suffix="：">
        <el-form-item label="字段名称" prop="name" required>
          <el-input v-model="formData.name" clearable />
        </el-form-item>
        <el-form-item label="字段类型" prop="type" required>
          <el-select v-model="formData.type" style="width:100%">
            <el-option label="字符串" value="string"/>
            <el-option label="表达式" value="expression"
          /></el-select>
        </el-form-item>
        <el-form-item v-if="formData.type === 'string'" label="字段值" prop="string" required>
          <el-input v-model="formData.string" clearable />
        </el-form-item>
        <el-form-item v-if="formData.type === 'expression'" label="表达式" prop="expression" required>
          <el-input v-model="formData.expression" clearable />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="text-align:right">
      <el-button @click="close()">取消</el-button>
      <el-button @click="handleAdd" type="primary">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  mixins:[window.V8.mixins],
  name: 'ListenerFieldAdd',
  data() {
    return {
      formData: {
        name: '',
        type: 'string',
        string: '',
        expression: ''
      }
    };
  },
  created() {
    if (this.AParams.field) {
      Object.assign(this.formData, this.AParams.field);
    }
  },
  methods: {
    handleAdd() {
      // this.$store.commit('callback', {
      //   name: 'success',
      //   arg: this.formData
      // });
       this.$root.confirm(this.formData)
      // this.close();
    }
  }
};
</script>
