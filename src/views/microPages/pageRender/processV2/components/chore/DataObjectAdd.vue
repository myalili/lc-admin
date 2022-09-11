<template>
  <el-container class="DataObjectAdd">
    <el-main>
      <el-form :model="item" :rules="rules" size="mini" label-width="100px" ref="form1" label-suffix=":">
        <el-form-item label="数据对象id" prop="id">
          <el-input v-model="item.id" v-focus clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="item.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型" prop="itemSubjectRef">
          <el-select v-model="item.itemSubjectRef">
            <el-option value="xsd:string" label="string" />
            <el-option value="xsd:boolean" label="boolean" />
            <el-option value="xsd:datetime" label="datetime" />
            <el-option value="xsd:double" label="double" />
            <el-option value="xsd:int" label="int" />
            <el-option value="xsd:long" label="long" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认值" prop="value" placeholder="请输入">
          <el-input v-model="item.value" clearable />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="padding-left:120px">
      <el-button @click="handleAdd" type="primary">确定</el-button>
      <el-button @click="close()">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
const { defaultRule } = window.aopsUtils;
export default {
  mixins:[window.V8.mixins],
  name: 'DataObjectAdd',
  data() {
    return {
      item: {
        id: '',
        name: '',
        itemSubjectRef: 'xsd:string',
        value: ''
      },
      rules: {
        id: defaultRule,
        name: defaultRule,
        itemSubjectRef: defaultRule
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
