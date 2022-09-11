<template>
  <div
    class="
      lock-mask
      absolute
      w-full
      h-full
      flex flex-col
      items-center
      justify-between
    "

    :class="{ 'cursor-pointer': !toLogin, 'lock-mask-transform': compShow}"
    @click="toLogin = true"
  >
    <div class="lock-mask-login flex flex-col items-center" v-show="toLogin">
      <svg
        class="lock-mask-login-icon"
        style="width: 70px; height: 70px"
        aria-hidden="true"
      >
        <use xlink:href="#icon-suoyouzhe"></use>
      </svg>
      <div class="lock-mask-login-user my-7">{{ user }}-{{ role }}</div>
      <div class="lock-mask-login-input">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="0px"
        >
          <el-form-item label="" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password @keyup.enter.native="login"></el-input>
          </el-form-item>
        </el-form>
        
      </div>
    </div>
    <div class="lock-mask-cancel flex flex-col items-center cursor-pointer" v-show="toLogin" @click.stop="toLogin = false">
      <i class="el-icon-circle-close text-4xl"></i>
      <span>取消</span>
    </div>
    <i class="el-icon-loading absolute top-2 right-2 text-2xl" v-if="loading"></i>
  </div>
</template>

<script>
export default {
  name: "lockMask",
  mixins: [window.codelessMixins.customDialog],
  props: {
    show: false,
  },
  data() {
    return {
      ruleForm: {
        password: "",
        identifyCode: ''
      },
      toLogin: false,
      rules: {
        password: [
          { required: false, message: "密码不能为空！", trigger: "blur" },
        ]
      },
      loading: false
    };
  },
  computed: {
    curDepartment(){
      return  this.$store.state.user.curDepartment
    },
    compShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    },
    user() {
      return localStorage.getItem('user')
    },
    role() {
      let roles = this.$store.state.user.currentData.roles||[];
      if(this.curDepartment.id){
        roles = roles.concat(this.curDepartment.roles||[])
      }

      return roles[0]? roles[0].name:""
      
    },
  },
  methods: {
    login(ev, flag = 0) {
      const ctx = this;
      if (!this.ruleForm.password) return
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let encodePassword = pipe.base64.encode(this.ruleForm.password);
          this.loading = true;
          var loginParams = {
            username: this.user,
            password: encodePassword,
            decode: true,
            flag
          };
          this.$store
            .dispatch("user/login", loginParams)
            .then((res) => {
              if (res.content.confirm) {
                ctx.openCustomDialog({
                  title: "提示",
                  path: "deleteConfirm",
                  width: "300px",
                  component: {
                    template: `<div>${res.content.confirm}?</div>`,
                  },
                  confirmCallback() {
                    ctx.handleSubmit('', 1)
                  },
                });
              }else {
                // this.ruleForm.resetFields();
                this.ruleForm.password = null;
                this.loading = false;
                this.compShow = false;
              }
            })
            .catch((err) => {
              this.$notify({
                title: "登录失败",
                message: err && err.msg,
                type: "error",
              });
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.lock-mask {
  background: rgba(255, 255, 255, 0.39);
  backdrop-filter: blur(18px);
  z-index: 2000;
  box-sizing: border-box;
  padding: 220px 0 76px 0;
  &-login {
    &-user {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 31px;
      color: #374E71;
      opacity: 1;
    }
    &-input {
       &::v-deep .el-input{
        .el-input__inner {
          background: #edeeef;
          border-radius: 8px;
          border: none;
        }
      }
    }
  }
  .lock-mask-cancel {
    i {
      color: #7F8C93;
    }
    color: #7F8C93;
    font-size: 18px;
    font-weight: bold;
    line-height: 31px;
  }
}
.lock-mask-transform {
  transform: translateY(-100%);
  transition: transform 0.4s;
}
</style>