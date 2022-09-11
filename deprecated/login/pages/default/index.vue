<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-left-ctn">
        <img class="login-logo-img" :src="logoSrc" alt="logo" />
        <p class="login-title">{{ loginTitle }}</p>
        <p class="vue-spa-version">
          V {{ version }} 科技 &copy; {{ new Date().getFullYear() }}
        </p>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm cus-login-container"
      >
        <h3 class="cus-title">{{ loginTitle }}</h3>
        <el-form-item prop="account">
          <el-input
            type="text"
            v-model="ruleForm.account"
            auto-complete="off"
            placeholder="账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>

        <el-form-item prop="identifyCode" v-if="showIdentifyingCode">
          <div class="cus-code-input">
            <el-input
              class="input"
              maxlength="8"
              placeholder="请输入验证码"
              v-model="ruleForm.identifyCode"
            ></el-input>
            <div class="cus-identifying-code" @click="getIdentifyingCode(true)">
              <img
                style="height: 100%; width: 100px; cursor: pointer"
                alt="点击更换"
                :src="identifyCodeSrc"
                title="点击更换"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="cus-submit-btn"
            :loading="logining"
            htmlType="submit"
            @click="handleSubmit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
 const { getVerifyImage } = window.getAacApi();
// import packageV from "packageJSON";

export default {
  data() {
    return {
      otherQuery: {},
      identifyCodeSrc: `${getVerifyImage()}?${Math.random()}`,
      logining: false,
      version: window.alcapVersion,
      showIdentifyingCode: true,
      ruleForm: {
        account: "admin",
        checkPass: "",
        identifyCode: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          //{ validator: validaePass2 }
        ],
        identifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          //{ validator: validaePass2 }
        ],
      },
      checked: false,
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.showIdentifyingCode =
      this.$store.state.project.info.loginPageWithIdentifyingCode;
  },
  computed: {
    loginTitle() {
      return this.$store.getters.title || "AGREE AWEB IDE";
    },
    logoSrc() {
      return this.$store.getters.logo || "img/agree-logo.png";
    },
  },
  methods: {
    // handleReset() {
    //   this.$refs.ruleForm.resetFields();
    // },
    getIdentifyingCode: function (bRefresh) {
      if (bRefresh) {
        this.identifyCodeSrc = `${getVerifyImage()}?${Math.random()}`;
      }
    },
    handleSubmit(ev) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let loginParams = {
            username: this.ruleForm.account,
            password: window.pipe.des.encryptByDES(this.ruleForm.checkPass),
            code: this.ruleForm.identifyCode,
          };
          this.logining = true;
          this.$store
            .dispatch("user/login", loginParams)
            .then(() => {
              this.$router.push({ path: "/" });

              this.logining = false;
              //}
            })
            .catch((err) => {
              this.logining = false;
              this.$message.error(err && err.msg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" >
.login-wrapper {
  background-image: url("./img/login-bg.jpeg");
  background-size: cover;
  background-position-y: 0;
  height: 100%;
  width: 100%;
}

.login-wrapper:before {
  position: absolute;
  content: "";
  background: hsla(0, 0%, 53.7%, 0.3);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(hsla(0, 0%, 53.7%, 0.3)),
    to(hsla(0, 0%, 53.7%, 0.5))
  );
  background: linear-gradient(hsla(0, 0%, 53.7%, 0.3), hsla(0, 0%, 53.7%, 0.5));
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.login-container {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -192.5px;
  margin-left: -375px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 750px;
  -webkit-box-shadow: 0 0 12px #8f96a2;
  box-shadow: 0 0 12px #8f96a2;
  height: 360px;
}
.login-left-ctn {
  position: relative;
  float: left;
  width: 50%;
  height: 100%;
  text-align: center;
  background: rgba(228, 234, 244, 0.9);
  // background: $--color-primary;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(rgba(69, 124, 226, 0.5)),
    to(rgba(69, 124, 226, 0.9))
  );
  background: linear-gradient(rgba(69, 124, 226, 0.5), rgba(69, 124, 226, 0.9));

  p.login-title {
    font-size: 18px;
    color: #fff;
    margin-top: 20px;
  }
  img.login-logo-img {
    margin-top: 100px;
    width: 120px;
    height: 82px;
  }
  .vue-spa-version {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    color: #fff;
  }
}
.cus-submit-btn {
  width: 100%;
  background: #457ce2;
  border-color: #457ce2;
  &:hover,&:active,&:focus{
      border-color: #457ce2;
        background: #457ce2;

  }
}
.cus-login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  // -webkit-border-radius: 5px;
  // border-radius: 5px;
  // -moz-border-radius: 5px;
  background-clip: padding-box;
  //margin: 180px auto;
  // width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  //border: 1px solid #eaeaea;
  //box-shadow: 0 0 25px #cac6c6;
  float: left;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  .cus-code-input {
    position: relative;
  }
  .cus-identifying-code {
    position: absolute;
    top: -1px;
    right: 0;
    z-index: 5;
    width: 102px; /*设置图片显示的宽*/
    height: 28px; /*图片显示的高*/
    //background: #e2e2e2;
    margin: 0;
    border-left: 0;
    box-sizing: border-box;
  }
  .cus-title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
    font-size: 18px;
  }
  .cus-remember {
    float: left;
  }

  .cus-forget-passWord {
    float: right;
  }
}
</style>