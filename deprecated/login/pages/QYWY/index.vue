<template>
  <div class="login-wrapper">
    <!--svg背景-->
    <div class="login-svg-ctn">
      <!-- <svg id="svgMove" width="100" height="100" viewBox="1 6.2 169 49">
        <path
          class="st5"
          d="M12.7,38.6l9.3,13c0.7,1,2.2,1.1,3.1,0.1l13.2-15.9c0.9-1.1,0.1-2.8-1.3-2.8H4.3c-1.4,0-2.2,1.6-1.4,2.7L22,63
          c0.7,1,2.3,1.1,3.1,0.1l22.7-27.4c0.9-1.1,0.1-2.8-1.3-2.8h0.1h-2.8c-1.4,0-2.2-1.7-1.3-2.8L65.2,2.8c0.8-1,2.4-0.9,3.1,0.1
          l19.1,27.3c0.8,1.1,0,2.7-1.4,2.7H53.3c-1.4,0-2.2-1.7-1.3-2.8l13.2-16c0.9-1,2.4-0.9,3.1,0.1l9.3,13.1"
        />
        <path
          class="st1"
          d
          stroke-width="0.4"
          stroke="#e0fff9"
          fill="none"
          stroke-linecap="round"
        />
        <path
          class="st2"
          d
          stroke-width="0.3"
          stroke="#e0fff9"
          fill="none"
          stroke-linecap="round"
        />
        <path
          class="st3"
          d
          stroke-width="0.2"
          stroke="#e0fff9"
          fill="none"
          stroke-linecap="round"
        />
        <path
          class="st0"
          d
          stroke-width="0.5"
          stroke="#e0fff9"
          fill="none"
          stroke-linecap="round"
        />
        <circle id="circle" cx="2.8" cy="34" r="0.36" fill="#72ffe2" />
      </svg> -->
    </div>
    <div class="login-container">
      <div class="login-left-ctn">
        <div class="login-logo-ctn">
          <img class="login-logo-icon" :src="logoSrc" alt="logo" />
          <!-- <i class="iconfont iconagree login-logo-icon"></i> -->
        </div>
        <p class="login-logo-title">Welcome to</p>
        <div class="project-name">
          {{ '企业网银' }}
          <!-- <div class="project-name-txt">{{ version }}</div> -->
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-right-ctn relative"
      >
        <div class="login-way absolute top-2 right-2"  @click="codeLogin = !codeLogin" v-if="!uLogin">
          <!-- <i class="el-icon-s-grid" style="color:#07b6b5; font-size:40px"></i> -->
          <img class=" w-10 h-10 cursor-pointer" src="./img/code.png" alt="" srcset="" v-if="!codeLogin">
          <img class=" w-8 h-8 mr-1 mt-1 cursor-pointer" src="./img/computer.png" alt="" srcset="" v-if="codeLogin">
        </div>
        <div class="tran-change  absolute top-3 right-3 cursor-pointer" @click="codeLogin = !codeLogin">
           
        </div>
        <div class="login-code w-full h-full flex flex-col items-center justify-center" v-if="codeLogin && !uLogin">
          <span class=" mb-3 text-lg font-bold">扫码登陆</span>
          <div class=" border border-gray-300 flex items-center justify-center cursor-pointer" @click="handleSubmit" style="width: 180px; height: 180px">
            <div class="qrCode" ref="qrCodeUrl"></div>
          </div>
          <span class=" text-xs text-gray-400 mt-4">数据产生价值</span>
        </div>
        <div class="" v-if="!codeLogin && !uLogin">
          <div class="tabs w-full h-12 flex items-center justify-between px-5 mb-4">
            <div class="cursor-pointer tab flex flex-col items-center" @click="tabActive = item.tab" :class="{ 'tab-active': item.tab === tabActive }" v-for="item in tabs" :key="item.name">
              <span>{{ item.name }}</span>
            </div>
          </div>
          <el-form-item prop="operator" class="login-form-item" v-if="tabActive === '3'">
            <el-select title="el-icon-user" style="width: 100%" v-model="ruleForm.operator" placeholder="操作员" @change="operatorChange">
              <template slot="prefix">
                  <span style="padding-left:5px" class="  items-center">
                    <i class="el-icon-suitcase"></i>
                  </span>
                </template>
              <el-option
                v-for="item in operators"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="account" class="login-form-item">
            <el-input
              type="text"
              v-model="ruleForm.account"
              auto-complete="off"
              placeholder="登录名/卡号/通行证手机号"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          
          <el-form-item prop="checkPass">
            <el-input
              :type="pwdType"
              v-model="ruleForm.checkPass"
              auto-complete="off"
              placeholder="密码"
              prefix-icon="el-icon-lock"
            ></el-input>
            <!-- <svg class="icon login-pwd-icon" aria-hidden="true" @click="changePwdIcon">
              <use :xlink:href="pwdIcon" />
            </svg> -->
          </el-form-item>

          <el-form-item prop="identifyCode" v-if="showIdentifyingCode">
            <div class="cus-code-input">
              <el-input
                class="input"
                maxlength="8"
                placeholder="请输入验证码"
                v-model="ruleForm.identifyCode"
                prefix-icon="el-icon-picture-outline"
              ></el-input>
              <div
                class="login-identifying-code"
                @click="getIdentifyingCode(true)"
              >
                <img alt="点击更换" :src="identifyCodeSrc" title="点击更换" />
              </div>
            </div>
          </el-form-item>

          <el-form-item style="width: 100%">
            <el-button
              type="primary"
              class="login-submit-btn"
              native-type="submit"
              @click.native.prevent="handleSubmit"
              :loading="logining"
              >登录 / Login</el-button
            >
          </el-form-item>
          <div class=" -mt-5 flex  items-center w-full justify-center" v-if="(tabActive === '2' || tabActive === '3') && !codeLogin">
              <i class="el-icon-turn-off mr-1" style="color:#07b6b5"></i>
              <el-button type="text" style="color:#07b6b5" @click="uLogin = !uLogin">切换至{{ !uLogin ? 'U盾' : '快速' }}登录</el-button>
            </div>

          <el-form-item class="pwd-ctn">
            <el-checkbox v-model="isRemPwd" class="remember-pwd-chebox"
              >记住密码</el-checkbox
            >
            <el-button type="text" class="forget-pwd-btn">忘记密码？</el-button>
          </el-form-item>    
        </div>
        <div class="login-u w-full h-full flex flex-col items-center justify-center" v-if="uLogin && !codeLogin">
          <span class=" mb-3 text-lg font-bold">使用U盾插入电脑登录</span>
          <img src="./img/u.png" class="" alt="">
          <el-button
              type="primary"
              class="login-submit-btn mt-5"
              native-type="submit"
              @click.native.prevent="handleSubmit"
              :loading="logining"
              >登录 / Login</el-button
            >
            <div class=" flex  items-center w-full justify-center" v-if="(tabActive === '2' || tabActive === '3') && !codeLogin">
              <i class="el-icon-turn-off mr-1" style="color:#07b6b5"></i>
              <el-button type="text" style="color:#07b6b5" @click="uLogin = !uLogin">切换至{{ !uLogin ? 'U盾' : '快速' }}登录</el-button>
            </div>
        </div>
      </el-form>

    </div>
    <!-- <div v-show="isShowTimeoutModal" class="el-message go-back-initpage">
      <i class="el-icon-warning"></i>
      跳转到{{initPage}}页面超时!
      <el-button
        class="common-confirm-btn"
        type="primary"
        @click.native="submitTimeoutModal">
        跳转回门户</el-button>
    </div> -->
    <div class="w-full fixed bottom-2">
      <v2-a-ebank-footer />
    </div>
  </div>
</template>

<script>
// const { getVerifyImage } = window.getAacApi();
// import { getVerifyImage } from "@/api/api";
const appearanceConfig = require("../../../../config/appearance.json");
import "snapsvg-cjs";
//import { c } from "@/utils/user";
// import packageV from "packageJSON";
var lineMoveInterval = "";
var intervalMap = {};

import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      //isShowTimeoutModal:false,
      showIdentifyingCode: false,
      isRemPwd: false,
      otherQuery: {},
      // identifyCodeSrc:getVerifyImage(),
      logining: false,
      version: window.alcapVersion,
      ruleForm: {
        account: "",
        checkPass: "",
        identifyCode: "",
        operator: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          //{ validator: validaePass }
        ],
        operator: [
          { required: true, message: "请选择操作员", trigger: "blur" },
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
      pwdIcon: "#iconeye",
      pwdType: "password",
      //initPage: "pageValue",

      tabActive: '1',
      tabs: [
        {
          tab: '1',
          name: '查询版',
        },
        {
          tab: '2',
          name: '理财版',
        },
        {
          tab: '3',
          name: '专业版',
        }
      ],
      operators: [
        {
          label: '网银集团主管',
          value: 'groupAdmin999',
          password: 12345679
        },
        {
          label: '网银主管',
          value: 'admin999',
          password: 12345678
        },
        {
          label: '网银制单员',
          value: 'operator001',
          password: 12345680
        },
        {
          label: '网银审核员',
          value: 'auditor500',
          password: 12345681
        }
      ],
      codeLogin: false,
      uLogin: false
    };
  },
  watch: {
    codeLogin: {
      handler(n) {
        if (n) {
          this.createQrCode();
        }
      }
    }
  },
  computed: {
    logoSrc() {
      return this.$store.getters.logo || "img/agree-logo.png";
    },
    adminLogo() {
      return "img/admin.png";
    },
    loginTitle() {
      return this.$store.getters.title || "AGREE AWEB IDE";
    },
  },
  created() {},
  mounted() {
    this.svgBg();
    this.showIdentifyingCode = appearanceConfig.loginPageWithIdentifyingCode;
  },
  destroyed() {
    for (let key in intervalMap) {
      clearInterval(intervalMap[key]);
    }
    clearInterval(lineMoveInterval);
  },
  methods: {
    // 操作员改变
    operatorChange(e) {
      const ctx = this;
      ctx.ruleForm.account = e;
      ctx.ruleForm.checkPass = ctx.operators.filter(i=>i.value === e)[0].password
    },
    createQrCode() {
      
      this.$nextTick(()=> {
        var qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: 'xxxx', // 需要转换为二维码的内容
          width: 160,
          height: 160,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel : QRCode.CorrectLevel.H
        })
      })
        
    },
    //登录超时
    // closeTimeoutModal(){

    // },
    // submitTimeoutModal(){
    //   this.$router.push({ path: "/" });
    // },
    // resetTimeoutModal(){

    // },
    // handleReset() {
    //   this.$refs.ruleForm.resetFields();
    // },
    getIdentifyingCode: function (bRefresh) {
      if (bRefresh) {
        // this.identifyCodeSrc = `${getVerifyImage()}?${Math.random()}`;
      }
    },
    handleSubmit(ev) {
      var _this = this;

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var loginParams = {
            username: this.ruleForm.account || 'agreeOwner',
            password: this.ruleForm.checkPass || '12345678',
            // password: window.pipe.des.encryptByDES(this.ruleForm.checkPass),
            code: this.ruleForm.identifyCode,
          };

          this.logining = true;
          this.$store
            .dispatch("user/login", loginParams)
            .then(() => {
              //if(data.status&&data.success){
              _this.$router.push({ path: "/", query: this.$route.query.isFirst ? {isFirst: true} : {} });
              this.logining = false;
              //}
            })
            .catch((err) => {
              this.logining = false;
              this.$notify({
                title: "登录失败",
                message: err && err.msg,
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // changePwdIcon() {
    //   this.pwdType = this.pwdType === "text" ? "password" : "text";
    //   this.pwdIcon = this.pwdIcon === "#iconeye2" ? "#iconeye" : "#iconeye2";
    // },
    //svg动画
    svgBg() {
      var linePath =
        "M12.7,38.6l9.3,13c0.7,1,2.2,1.1,3.1,0.1l13.2-15.9c0.9-1.1,0.1-2.8-1.3-2.8H4.3c-1.4,0-2.2,1.6-1.4,2.7L22,63c0.7,1,2.3,1.1,3.1,0.1l22.7-27.4c0.9-1.1,0.1-2.8-1.3-2.8h0.1h-2.8c-1.4,0-2.2-1.7-1.3-2.8L65.2,2.8c0.8-1,2.4-0.9,3.1,0.1l19.1,27.3c0.8,1.1,0,2.7-1.4,2.7H53.3c-1.4,0-2.2-1.7-1.3-2.8l13.2-16c0.9-1,2.4-0.9,3.1,0.1l9.3,13.1";
      var totalLength = Snap.path.getTotalLength(linePath);
      var svgMove = Snap("#svgMove");
      var start = 0,
        end = totalLength,
        moveLangth = 2;
      var time = 6000;
      function lineMove(start, end) {
        Snap.animate(
          start,
          end,
          function (value) {
            let path = {
                path0: "",
                path1: "",
                path2: "",
                path3: "",
                path4: "",
              },
              endPath,
              startPath;
            for (let i = 0; i < 4; i++) {
              endPath = value + moveLangth + i;
              startPath = value - i;
              if (endPath > totalLength) {
                endPath = totalLength;
              }
              if (startPath < 0) {
                startPath = 0;
              }
              path["path" + i] = Snap.path.getSubpath(
                linePath,
                startPath,
                endPath
              );
              svgMove.select(".st" + i).attr({ d: path["path" + i] });
            }
            if (value === totalLength) {
              console.log(value);
              var tran = start;
              start = end;
              end = tran;
              for (let i = 0; i < 4; i++) {
                svgMove.select(".st" + i).attr({ d: "" });
              }
            }
          },
          time,
          mina.easeinout
        ); //
      }
      function circles(id, cx, cy, timeOut) {
        var objCircle = svgMove.select("#circle");
        objCircle.clone().attr({
          r: 0.46,
          cx: cx,
          cy: cy,
        });
        var objCircleBottom = objCircle.clone().attr({
          id: id,
          r: 0,
          cx: cx,
          cy: cy,
        });
        function circleAnimate() {
          objCircleBottom
            .attr({
              opacity: 0.8,
              r: 0,
            })
            .animate(
              {
                opacity: 0,
                r: 2,
              },
              2400
            );
        }
        setTimeout(function () {
          circleAnimate();
          setTimeout(function () {
            intervalMap[new Date().getTime()] = setInterval(function () {
              circleAnimate();
            }, 2400);
          }, 2400);
        }, timeOut);
      }
      function initCircle() {
        lineMove(start, end);
        circles("objCircle0", 2.8, 34, 900);
        circles("objCircle1", 12.8, 38.8, 1200);
        circles("objCircle2", 23.6, 52.3, 600);
        circles("objCircle3", 38.5, 34, 0);
        circles("objCircle4", 44.5, 32.9, 300);
        circles("objCircle5", 51.8, 31.8, 1500);
        circles("objCircle6", 77.6, 27.4, 2400);
        circles("objCircle7", 66.7, 13.5, 2100);
        circles("objCircle8", 87.55, 31.8, 1800);
      }
      lineMoveInterval = setInterval(function () {
        lineMove(start, end);
      }, time);
      initCircle();
    },
  },
};
</script>

<style lang="less" >
.login-wrapper {
  position: fixed;
  background-image: url(./img/qywy-login-bg.png);
  background-size: 1920px;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: #e2edf3;
  // z-index: -1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  //   .go-back-initpage{
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     padding: 20px;
  //     margin-left: -140px;
  //     margin-right: -36px;
  //     background: #fff;
  //     border-radius: 6px;
  //     box-shadow: 0 0 10px rgba($color: #000000, $alpha: .2);
  //     z-index: 100;
  //     &::before{
  //       position: fixed;
  //       content: "";
  //       top: 0;
  //       right: 0;
  //       bottom: 0;
  //       left: 0;
  //       background: rgba($color: #fff, $alpha: .3);
  //       z-index: -1;
  //     }
  //   }
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
  display: none;
}
.login-container {
  position: fixed;
  top: 50%;
  left: 72%;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  -webkit-box-shadow: 0 0 20px rgba(105, 123, 134, 0.2);
  box-shadow: 0 0 20px rgba(105, 123, 134, 0.2);
  height: 428px;
  width: 612px;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border-radius: 14px;
}
.login-left-ctn {
  position: relative;
  float: left;
  width: 232px;
  height: 100%;
  background: #374e71;
  background: -webkit-linear-gradient(top, #374e71, #1d2636);
  background: -ms-linear-gradient(top, #374e71, #1d2636);
  background: -moz-linear-gradient(top, #374e71, #1d2636);
  background: -o-linear-gradient(top, #374e71, #1d2636);
  background: linear-gradient(top, #374e71, #1d2636);
  padding: 44px 32px;
  padding-right: 20px;
  box-sizing: border-box;
  color: #fff;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;

  .login-logo-title {
    color: #7b91b3;
    font-size: 18px;
    margin-top: 10px;
    font-weight: 300;
  }
  .login-logo-icon {
    width: 46px;
    font-size: 46px;
  }
  .project-name {
    font-size: 16px;
    .project-name-txt {
      display: inline-block;
    }
  }
}

.login-right-ctn {
  background-clip: padding-box;
  padding: 30px 38px 64px 38px;
  background: #fff;
  float: left;
  width: 380px;
  height: 100%;
  box-sizing: border-box;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  .tabs {
    .tab {
      height:68%;
      font-size: 16px;
    }
    .tab-active {
      font-weight: bold;
      color: #07b6b5;
      border-bottom: 2px solid #07b6b5;
    }
  }
  .tran-change {
    width: 0;
    height: 0;
    border-bottom: 34px solid #fff !important;
    border-right: 34px solid transparent !important;
  }
  .el-form-item__content {
    line-height: 1;
  }
  .el-form-item {
    position: relative;
    margin-bottom: 20px;
    .el-input__prefix {
      left: 14px;
      display: flex;
      align-items: center;
    }
  }
  .el-input__inner {
    height: 44px;
    line-height: 44px;
    border-radius: 8px;
    padding-left: 42px;
    padding-right: 26px;
    color: #374e71;
  }
  .el-input__icon {
    font-size: 16px;
    line-height: 44px;
  }
  .login-identifying-code {
    position: absolute;
    top: 2px;
    right: 4px;
    z-index: 5;
    width: 120px; /*设置图片显示的宽*/
    height: 40px; /*图片显示的高*/
    margin: 0;
    border-left: 0;
    box-sizing: border-box;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-left: 1px solid #dddfe5;
    img {
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
  }
  .login-pwd-icon {
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    right: 8px;
    font-size: 18px;
    &:hover {
      cursor: pointer;
    }
  }
  .login-title {
    margin: 0px auto 25px auto;
    text-align: center;
    color: #505458;
    font-size: 26px;
    height: 40px;
  }
  .login-user-icon {
    margin-right: 15px;
    width: 40px;
    height: 40px;
    display: inline-block;
  }
  .login-text {
    height: 40px;
    line-height: 40px;
    display: inline-block;
    font-size: 26px;
    vertical-align: top;
    font-weight: lighter;
    color: #374e71;
  }
  .login-submit-btn {
    width: 100%;
    border-radius: 22px;
    height: 44px;
    font-size: 16px !important;
    color: #ffffff;
    background-color: #07b6b5;
    border-color: #07b6b5;
  }
  .pwd-ctn {
    .el-form-item__content {
      line-height: 20px;
    }
    .el-checkbox__label,
    .forget-pwd-btn {
      color: #7f8c93;
      line-height: 20px;
    }
  }
  .forget-pwd-btn {
    padding: 0;
    float: right;
  }
}
//svg背景
.login-svg-ctn {
  position: relative;
  min-height: 421px;
  height: 42.6%;
  height: calc(100vw * (421 / 1920));
  width: 100%;
  overflow: hidden;
  svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .st0 {
    fill: none;
    stroke-width: 0.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }
  .st5 {
    fill: none;
    stroke: #72ffe2;
    stroke-width: 0.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }
}
@media screen and (min-width: 1920px) {
  .login-wrapper {
    background-size: 100%;
  }
}
@media screen and (max-width: 1680px) {
  .login-container {
    height: 364px;
    width: 520px;

    .login-left-ctn {
      width: 198px;
      padding-left: 20px;
      padding-right: 12px;
      padding-top: 32px;
      .project-name-txt {
        display: block;
      }
    }
    .login-right-ctn {
      width: 322px;
      padding: 30px 38px 64px 38px;

      .login-title {
        margin-bottom: 14px;
      }
      .login-user-icon {
        width: 34px;
        height: 34px;
        display: inline-block;
      }
      .login-text {
        font-size: 22px;
      }
      .el-form-item {
        margin-bottom: 16px;

        .el-input__inner {
          border-radius: 6px;
          height: 38px;
          line-height: 38px;
          font-size: 12px;
        }
        .el-input__icon {
          line-height: 38px;
        }
        .login-identifying-code {
          right: 2px;
          height: 34px;
          width: 100px;
        }
        .login-submit-btn {
          height: 38px;
          font-size: 13px;
        }
        .el-checkbox__label,
        .forget-pwd-btn {
          font-size: 12px;
        }
      }

      .tabs {
        .tab {
          height:68%;
          font-size: 16px;
        }
        .tab-active {
          font-weight: bold;
          color: #07b6b5;
          border-bottom: 2px solid #07b6b5;
        }
      }
      .tran-change {
        width: 0;
        height: 0;
        border-bottom: 34px solid #fff !important;
        border-right: 34px solid transparent !important;
      }
    }
  }
}
</style>