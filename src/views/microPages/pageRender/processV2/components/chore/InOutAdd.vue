<template>
  <el-container class="DataObjectAdd">
    <el-main>
      <el-form :model="item" :rules="rules" size="mini" label-width="96px" ref="form1" label-suffix="：">
        <el-form-item label="参数源" prop="source">
          <el-input v-model="item.source" clearable />
        </el-form-item>
        <el-form-item label="目标" prop="target">
          <el-input v-model="item.target" clearable />
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
const { defaultRule } = window.aopsUtils;
export default {
  mixins:[window.V8.mixins],
  name: 'InOutAdd',
  data() {
    return {
      item: {
        source: '',
        target: ''
      },
      rules: {
        source: defaultRule,
        target: defaultRule
      }
    };
  },
  created() {
    if (this.AParams.item) {
      Object.assign(this.item, this.AParams.item);
    }
  },
  methods: {
    handleAdd() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          // this.$store.commit('callback', {
          //   name: 'success',
          //   arg: this.item
          // });
          this.$root.confirm(this.item)
          // this.close();
        } else {
          this.$message({ message: '请填写完整！', type: 'warning' });
          return false;
        }
      });
    }
  }
};
</script>
