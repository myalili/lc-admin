<template>
  <el-dialog
    :title="innerTitle"
    v-bind="$attrs"
    v-on="$listeners"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="租户名称：" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入企业名称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input
          v-model="formData.desc"
          placeholder="请输入描述，描述长度为200以内"
          type="textarea"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
function baseTenantInfo() {
  return {
    name: '',
    desc: ''
  }
}
export default {
  name: 'TenantEditorDialog',
  inheritAttrs: false,
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (!/^[a-zA-Z]+\w+$/.test(value)) {
        callback(
          new Error(
            '请输入正确用户名，用户名以字母开头，只能包含字母、数字和下划线'
          )
        )
      } else {
        callback()
      }
    }
    return {
      formData: baseTenantInfo(),
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
          // { validator: validateName, trigger: 'blur' }
        ],
        desc: [
          { maxlength: 200, message: '描述长度为200以内', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    innerTitle() {
      if (this.title) {
        return this.title
      } else if (this.isEdit) {
        return '编辑租户'
      } else {
        return '添加租户'
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false)
    },
    dialogOpen() {
      this.formData = {
        ...baseTenantInfo(),
        ...this.data
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    submit() {
      this.$refs.form.validate().then(() => {
        this.$emit('submit', {
          ...this.formData,
          name: this.formData.name.trim()
        })
      })
    }
  }
}
</script>

<style>
</style>