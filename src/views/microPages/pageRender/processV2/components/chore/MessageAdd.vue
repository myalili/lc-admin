<template>
  <el-container class="MessageAdd">
    <el-main>
      <el-form :model="item" :rules="rules" size="mini" label-width="90px" ref="form1" label-suffix=":">
        <el-form-item label="消息ID" prop="id">
          <el-input v-model="item.id" v-focus clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="消息名称" prop="name">
          <el-input v-model="item.name" clearable placeholder="请输入" />
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
  name: 'MessageAdd',
  data() {
    return {
      item: {
        id: '',
        name: ''
      },
      rules: {
        id: defaultRule,
        name: defaultRule
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
