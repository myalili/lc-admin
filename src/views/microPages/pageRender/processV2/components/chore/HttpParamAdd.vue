<template>
  <el-container class="HttpParamAdd">
    <el-main>
      <el-form ref="form1" :model="parameter" size="mini" label-width="96px" label-suffix="：">
        <el-form-item label="参数名" prop="name">
          <el-input v-model="parameter.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="参数位置" prop="in">
          <el-select v-model="parameter.in" style="width:100%">
            <el-option value="header">header</el-option>
            <el-option value="path">path</el-option>
            <el-option value="query">query</el-option>
            <el-option value="body">body</el-option>
            <el-option value="formData">formData</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-if="parameter.in === 'body'" v-model="parameter.value" type="textarea" rows="5"></el-input>
          <el-input v-else v-model="parameter.value"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="parameter.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleAdd">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  mixins:[window.V8.mixins],
  name: 'HttpParamAdd',
  data() {
    return {
      parameter: {
        name: '',
        type: 'string',
        in: 'query',
        value: '',
        description: ''
      }
    };
  },
  created() {
    if (this.AParams.param) {
      Object.assign(this.parameter, this.AParams.param);
    }
  },
  methods: {
    handleAdd() {
      // this.$store.commit('callback', {
      //   name: 'success',
      //   arg: this.parameter
      // });
      this.$root.confirm(this.parameter)
      // this.close();
    }
  }
};
</script>
