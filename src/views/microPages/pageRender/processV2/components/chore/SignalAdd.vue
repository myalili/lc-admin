<template>
  <el-container class="SignalAdd">
    <el-main>
      <el-form :model="item" :rules="rules" size="mini" label-width="90px" ref="form1" label-suffix=":">
        <el-form-item label="信号ID" prop="id">
          <el-input v-model="item.id" v-focus clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="信号名称" prop="name">
          <el-input v-model="item.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="Scope" prop="scope">
          <el-select v-model="item.scope" clearable>
            <el-option value="global" label="全局" />
            <el-option value="processInstance" label="流程实例" />
          </el-select>
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
  name: 'SignalAdd',
  data() {
    return {
      item: {
        id: '',
        name: '',
        scope: 'global'
      },
      rules: {
        id: defaultRule,
        name: defaultRule,
        scope: defaultRule
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
