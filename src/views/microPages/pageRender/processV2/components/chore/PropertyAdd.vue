<template>
  <el-container class="PropertyAdd">
    <el-main>
      <el-form :model="formData" :rules="rules" size="mini" label-width="90px" ref="form1" label-suffix=":">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="formData.name" v-focus clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="formData.value" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="padding-left:110px">
      <el-button @click="handleAdd" type="primary">确定</el-button>
      <el-button @click="close()">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
const { defaultRule } = window.aopsUtils;
export default {
  mixins:[window.V8.mixins],
  name: 'PropertyAdd',
  data() {
    return {
      formData: {
        name: '',
        value: ''
      },
      rules: {
        name: defaultRule,
        value: defaultRule
      }
    };
  },
  created() {
    if (this.AParams.property) {
      Object.assign(this.formData, this.AParams.property);
    }
  },
  methods: {
    handleAdd() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          // this.$store.commit('callback', {
          //   name: 'success',
          //   arg: this.formData
          // });
          this.$root.confirm(this.formData)
          // this.close();
        } else {
          return false;
        }
      });
    }
  }
};
</script>
