<template>
  <el-dialog
    :title="title"
    v-bind="$attrs"
    v-on="$listeners"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="用户名：" prop="name">
        <el-input
          v-model="formData.name"
          :disabled="isEdit"
          placeholder="请输入以字母开头，只包含字母、数字和下划线的用户名"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱："
        class="tenant-form-item tenant-mark-item"
        prop="email"
      >
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述：" class="tenant-form-item">
        <el-input
          type="textarea"
          maxlength="200"
          v-model="formData.desc"
          placeholder="请输入描述，描述长度为200以内"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
function baseUserInfo() {
  return {
    name: '',
    nickname: '',
    phone: '',
    email: '',
    desc: ''
  }
}
export default {
  name: 'UserEditorDialog',
  inheritAttrs: false,
  props: {
    data: {
      type: Object,
      default() {
        return baseUserInfo()
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'user'
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
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!/^1[0-9]{10}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!/^[\w.-]+@[a-zA-Z0-9]+(\.[a-z]+)+$/.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      formData: baseUserInfo(),
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      const name = this.type === 'user' ? '用户' : '所有者'
      const action = this.isEdit ? '编辑' : '添加' 
      return action + name
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false)
    },
    dialogOpen() {
      this.formData = {
        ...baseUserInfo(),
        ...this.data
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    submit() {
      this.$refs.form.validate().then(() => {
        this.$emit('submit', {
          ...this.formData
        })
      })
    }
  }
}
</script>

<style>
</style>