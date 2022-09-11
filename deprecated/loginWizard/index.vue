<template>
  <div class="w-full h-full flex items-center justify-center login-wizard">
    <el-card class="box-card w-1/2 h-2/3" style="min-width: 850px; min-height: 512px;">
      <div slot="header" class="clearfix">
        <span class=" text-base font-bold">登录向导</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="complete">跳过</el-button>
      </div>
      <div class="w-full box-border px-11 text item">
        <el-steps :active="step" style="margin-top: 14px;">
          <el-step title="登录向导说明"></el-step>
          <el-step title="授权模型设置"></el-step>
          <el-step title="操作员设置"></el-step>
        </el-steps>
        <div class="login-wizard-text mt-7" v-if="step === 2">
          <p class=" text-sm font-bold mb-1">授权模型设置</p>
          <p class="text-sm">
            <span>提供多种预制授权模型选择，包括单人授权模型、双人授权模型，可自定义授权模型。</span>
            <el-button style="padding: 0" type="text">详细了解</el-button>
          </p>
        </div>
        <div class="login-wizard-text mt-7" v-if="step === 3">
          <p class=" text-sm font-bold mb-1">操作员设置</p>
          <p class="text-sm">
            <span>设置普通操作员后，将可以根据系统默认的业务审核模式或您自己自定义的账号/业务审核模式进行日常制单与审核工作。</span>
            <el-button style="padding: 0" type="text">详细了解</el-button>
          </p>
        </div>
        <div class="login-wizard-text mt-7" v-if="step === 1">
          <p class=" text-sm font-bold mb-1">登录向导说明</p>
          <p class="text-sm">
            <span>配置向导将帮助您完成企业网银需要的基本配置。</span>
            <el-button style="padding: 0" type="text">详细了解</el-button>
          </p>
        </div>
        <div class="login-wizard-avatar my-6 flex items-center" style="height: 50px">
          <codeless-icon icon="icon-suoyouzhe" style="width: 50px; height: 50px"></codeless-icon>
          <div class="name h-full ml-3">
            <span class=" text-sm">{{ role }}</span>
            <p>{{ (user.userInfo && user.userInfo.user && user.userInfo.user.nickname) || user.userName }}</p>
          </div>
        </div>
        <el-divider />
        <div class="login-wizard-settings">
          <div class="settings-no flex items-center mb-1">
            <span class="no mr-2 w-5 h-5 text-sm  bg-gray-200 flex items-center justify-center rounded-full">1</span>
            <p class="text-sm" :style="{color: step > 1 ? '#409EFF' : ''}">审核模型设置</p>
            <i class="el-icon-check ml-1"  style="color: #409EFF" v-if="step > 1"></i>
          </div>
          <div class="settings-no flex items-center">
            <span class="no mr-2 w-5 h-5 text-sm  bg-gray-200 flex items-center justify-center rounded-full">2</span>
            <p class="text-sm" :style="{color: step > 2 ? '#409EFF' : ''}">操作员设置</p>
            <i class="el-icon-check ml-1" style="color: #409EFF" v-if="step === 3"></i>
          </div>

        </div>
        <el-divider />
        <div class="login-wizard-btn w-full flex items-center justify-end mt-8">
          <el-button type="primary" size="mini" @click="stepFn" v-if="step === 1 || step === 2">继续</el-button>
          <el-button type="primary" size="mini" @click="complete(true)" v-if="step === 3">完成</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  mixins: [ window.V8.mixins ],
  name: 'loginWizard',
  data() {
    return {
      step: 1
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    role() {
      return this.$store.state.user.currentData.roles[0].name
    }
  },
  methods: {
    complete(f) {
      if (f) {
         this.$message({
          message: '恭喜您成功完成配置向导，请开始使用您的企业网银',
          type: 'success'
        });
      }
      this.$router.replace({ path: '/' });
    },
    stepFn() {
      const ctx = this;
      let params1 = {
        pId: "menu-2tYZxAKG",
        pageId: "menu-Q6ncWsCF",
        title: "授权模式设置",
        type: "1"
      }
      let params2 = {
        pId: "menu-2tYZxAKG",
        pageId: "menu-RG2AUdSZ",
        title: "操作员设置",
        type: "1",
        // pId: "menu-2tYZxAKG",
        // pageId: "menu-0YcCOgCh",
        // title: "操作员设置",
        // type: "2"
      }
      const paramsMap = new Map([
        [ 1, params1 ],
        [ 2, params2 ],
      ])
        ctx.open({
          title: paramsMap.get(ctx.step).title,
          type: 'SUB',
          component: 'codeLess/index',
          width: "80%",
          height: "80%",
          params: paramsMap.get(ctx.step),
          hideConfirmBtn: true,
          hideCancelBtn: true,
          beforeConfirm: ($el) => {
            //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
            return true;
          },
          confirmCallback: ($el) => {},
          cancelCallback: ($el) => {
            console.log("点击取消");
          },
        });
        ctx.step += 1;
      }
    }
 }
</script>

<style>

</style>