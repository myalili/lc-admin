<template>
  <el-dialog
    :title="title"
    v-bind="$attrs"
    v-on="$listeners"
    @open="dialogOpen"
  >
    <el-form
      label-width="80px"
      ref="roleForm"
      :rules="roleRules"
      :model="roleForm"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="roleForm.name"
          auto-complete="off"
          placeholder="角色名称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input
          v-model="roleForm.desc"
          type="textarea"
          maxlength="200"
          placeholder="请输入描述，描述长度为200以内"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit('addRoleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
function baseRoleForm() {
  return {
    name: '',
    desc: ''
  }
}
export default {
  name: 'roleEditorDialog',
  inheritAttrs: false,
  props: {
    data: {
      type: Object,
      default() {
        return baseRoleForm()
      }
    },
    title: {
      type: String,
      default: '添加角色'
    }
  },
  data() {
    return {
      roleForm: baseRoleForm(),
      roleRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        desc: [
          { maxlength: 200, message: '描述长度为200以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    dialogOpen() {
      this.roleForm = {
        ...baseRoleForm(),
        ...this.data
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$refs.roleForm.validate().then(() => {
        this.$emit('submit', { ...this.roleForm })
      })
    }
  }
}
</script>
