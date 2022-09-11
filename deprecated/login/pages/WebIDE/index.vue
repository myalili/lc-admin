<template>
  <div class="cus-login-frame" v-loading="loading">
    <div class="cus-login-bg" :style="bgStyle" id='cusLoginBg'></div>
    <div class="cus-login-block">
      <!-- <div class="cus-title-ctn">
        <h3 class="cus-title">Agree Web IDE</h3>
        <p class="cus-sub-title">V {{version}} 科技 &copy; {{currentYear}}</p>
      </div>-->
      <div class="cus-title-ctn" id='cusTitleCtn'>
        <p class="cus-title-and-version">
          <span class="cus-title">{{loginTitle}}</span>
          <span class="cus-version">V{{version}}</span>
        </p>
        <p class="cus-sub-title">登录</p>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm cus-login-container"
      >
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm.account" placeholder="请输入账号/邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请输入密码" clearable></el-input>
        </el-form-item>

        <el-form-item prop="identifyCode" v-if='showIdentifyingCode'>
          <div class="cus-code-input">
            <el-input
              class="input"
              maxlength="8"
              placeholder="请输入验证码"
              v-model="ruleForm.identifyCode"
            ></el-input>
            <div class="cus-identifying-code" @click="getIdentifyingCode(true)">
              <img
                style="height:40px; width: 100px; cursor: pointer;"
                alt="点击更换"
                :src="identifyCodeSrc"
                title="点击更换"
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item style="width:100%;">
          <el-button
            type="primary"
            class="cus-submit-btn"
            native-type="submit"
            @click.native.prevent="handleSubmit"
            :loading="logining"
          >登录</el-button>
        </el-form-item>
      </el-form>
      <p class="cus-footer">
        <!-- <span class='cus-regist'>免费注册</span>
        <span>忘记密码</span>-->
         <span v-if="$store.getters.gitlabEnable && $store.getters.gitlabData &&  ($store.getters.gitlabData.oauth === 'both' || $store.getters.gitlabData.oauth === 'authorization_code')" @click="gitlabLogin">gitlab授权登录</span>
      </p> 
    </div>
  </div>
</template>

<script>
// import packageV from "packageJSON";
// import { getVerifyImage } from "@/api/api";
const { getVerifyImage } = window.getAacApi();

const appearanceConfig = require('../../../../config/appearance.json');


export default {
  computed: {
    bgStyle() {
      return ` background-image:url(${require("../../../img/bg.svg")})`;
    },
    loginTitle(){
      return this.$store.getters.title||'AGREE AWEB IDE'
    },
    // currentYear() {
    //   return new Date().getFullYear();
    // }
  },
  data() {
    return {
      showIdentifyingCode:true,
      loading: false,
      identifyCodeSrc: getVerifyImage(),
      bgDom:'',
      version: window.alcapVersion,
      logining: false,
      ruleForm: {
        account: "",
        checkPass: "",
        identifyCode: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        identifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      checked: false
    };
  },

  mounted() {
   
    this.showIdentifyingCode = appearanceConfig.loginPageWithIdentifyingCode

  },
  methods: {

    handleLogin(loginParams) {
      var _this = this;
      this.$store.dispatch("user/login", loginParams).then(res => {
        this.logining = false;

        _this.$notify({
          title: res.msg,
          type: "success"
        });

        _this.$router.replace({ path: "/" });
      }).catch(err => {
              this.logining = false;
              this.$notify({
                title: "登录失败",
                message: err&&err.msg,
                type: "error"
              });
            });;
    },

    getIdentifyingCode: function(bRefresh) {
      if (bRefresh) {
        this.identifyCodeSrc = `${getVerifyImage()}?${Math.random()}`;
      }
    },

    handleSubmit(type) {
      var _this = this;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          var loginParams = {
            username: this.ruleForm.account,
            password: this.$root.encryptByDES(this.ruleForm.checkPass),
            code: this.ruleForm.identifyCode
          };
          this.logining = true;

          this.handleLogin(loginParams)


        } else {
          this.$message.error('请填写必要的登录信息')
          return false;
        }
      });
    }
  }
};
</script>



 <style lang="less" scoped>
        
@color: #07b5b6;
.cus-login-frame {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  width: 100%;
  height: 100%;
  overflow: auto;
}
.cus-login-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // z-index: -1;
  background-size: cover;
  background-position: center;
  transition: all linear 0.3s;
  background-repeat: no-repeat;
  background-color: #efefef;
  animation: showLoginBg 1s;
}
.cus-login-block {
  position: relative;
  //top: -25px;
  width: 388px;
  height: 530px;
  padding: 48px;
  background-color: #ffffff;
  margin-right: 700px;
  border: 1px solid rgba(240, 240, 240, 1);
  box-shadow: 0px 3px 6px rgba(7, 181, 182, 0.16);
  border-radius: 4px;
  box-sizing: border-box;
  // display: flex;
  // flex-direction: row;
  animation: showLoginCtn 1s;
}

.cus-title-ctn {
  color: @color;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 40px;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // background-color: rgba(255, 255, 255, 0.86);
  // margin: 0;
  // padding: 12px;
  // width: 250px;
  // border-top-left-radius: 8px;
  // border-bottom-left-radius: 8px;
  >p{
    height:50px;
  }
  .cus-title-and-version {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .cus-version {
      font-size: 14px;
      font-weight: 500;
      color: #cccccc;
    }
  }
}

// .cus-title {
//   color: #666;
//   font-size: 28px;
// }
// .cus-sub-title {
//   position: absolute;
//   bottom: 1em;
//   color: #222;
//   font-size: 12px;
// }

.cus-login-container {
  // z-index: 1;
  // background-color: rgba(255, 255, 255, 1);
  // margin: auto;
  // padding: 70px 35px 50px 35px;
  // width: 350px;
  // border-top-right-radius: 8px;
  // border-bottom-right-radius: 8px;

  .cus-code-input{
      display: flex;
  }
 &::v-deep .el-input__inner {
   border:none;
    border-bottom: 1px solid #cccccc;
    border-radius: unset;
    padding-bottom: 12px;
  }
  &::v-deep input{
    box-shadow: 0 0 0px 1000px white inset;
  }

  // &::v-deep .el-form-item{
  //   margin-bottom:16px;
  // }

  // &::v-deep input {
  //   animation: resetBg 0.1s forwards;
  // }
  // @keyframes resetBg {
  //   to {
  //     color: #fff;
  //     background: transparent;
  //   }
  // }

  // &::v-deep input{
  //   &:-internal-autofill-selected {
  //     background-color: #ffffff;
  //   }
  // }

  // .cus-identifying-code {
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   z-index: 5;
  //   width: 102px; /*设置图片显示的宽*/
  //   height: 40px; /*图片显示的高*/
  //   background: #e2e2e2;
  //   margin: 0;
  // }

  // .cus-forget-password {
  //   float: right;
  // }
  .cus-submit-btn {
    width: 100%;
    margin-top:26px;
    color:#ffffff;
    background-color: #3698F2;
    border-color: #3698F2;

    
  }
}

.cus-footer{
  // display: flex;
  // justify-content: space-between;
  // color:#999999;
  font-size: 14px;
  text-align: right;
  >span{
    cursor:pointer;
    color: @color;
  }

  .cus-regist{
    color:@color
  }
}

@keyframes showLoginCtn {
  from {
    opacity: 0;
    top: 50px;
  }
  to {
    opacity: 1;
    top: 0;
  }
}
@keyframes showLoginBg {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>