<template>
  <div class="app-style-dialog">

    <!-- 主题 -->
    <div class="app-style-dialog-theme w-full" v-if="tab === 'theme'">
      <el-radio-group v-model="currentTheme" style="width: 100%">
        <div class="w-full flex items-center flex-wrap justify-between">
          <div
            class="h-44 mt-5 flex flex-col items-center"
            style="width: 30%"
            v-for="item in themes"
            :key="item.id"
          >
            <div
              class="
                w-full
                h-36
                rounded-md
                flex
                items-center
                flex-wrap
                cursor-pointer
              "
              :class="{ ' border  border-gray-400': item.color === 'white' }"
              :style="{ 'background-color': item.color }"
              @click="currentTheme = item.id"
            ></div>
            <el-radio :label="item.id" class="mt-4">{{ item.name }}</el-radio>
          </div>
        </div>
      </el-radio-group>
    </div>

    <!-- 布局 -->
    <div class="app-style-dialog-layout" v-if="tab === 'layout'">
      <el-radio-group v-model="currentLayout" style="width: 100%">
        <div class="w-full flex items-center flex-wrap justify-between">
          <div
            class="h-44 mt-5 flex flex-col items-center"
            style="width: 30%"
            v-for="item in layouts"
            :key="item.id"
          >
            <img
              :src="item.img"
              class="
                w-full
                h-36
                rounded-md
                flex
                items-center
                flex-wrap
                cursor-pointer
              "
              @click="currentLayout = item.id"
            />
            <el-radio :label="item.id" class="mt-4">{{
              item.name
            }}</el-radio>
          </div>
        </div>
      </el-radio-group>
    </div>
    
    <!-- 登录页 -->
    <div class="app-style-dialog-login" v-if="tab === 'login'">
      <el-form :model="appForm" :rules="appRules" label-position="right" label-width="100px" size="small">
          <el-form-item label="项目名称" prop="title">
            <el-input v-model="appForm.title" placeholder="请输入" style="width:370px"></el-input>
          </el-form-item>
          <el-form-item label="项目版本" prop="version">
            <el-input v-model="appForm.version" placeholder="请输入" style="width:370px"></el-input>
          </el-form-item>
          <el-form-item label="项目logo" prop="logo">
            <div class=" w-12 h-12 rounded border-gray-400 border flex items-center justify-center cursor-pointer" @click="dialogVisible = true">
              <img class=" w-8" :src="appForm.logo" alt="" srcset="">
            </div>
          </el-form-item>
          <el-form-item label="登录页样式" prop="login"></el-form-item>
          <el-radio-group v-model="appForm.login" class=" -mt-2" style="width: 100%">
        <div class="w-full flex items-center flex-wrap justify-between">
          <div
            class="h-44 flex flex-col items-center"
            style="width: 30%"
            v-for="item in logins"
            :key="item.id"
          >
            <img
              :src="item.img"
              class="
                w-full
                h-36
                rounded-md
                flex
                items-center
                flex-wrap
                cursor-pointer
              "
              @click="appForm.login = item.id"
            />
            <el-radio :label="item.id" class="mt-4">{{
              item.name
            }}</el-radio>
          </div>
        </div>
      </el-radio-group>
      </el-form>
    </div>


    <el-dialog
      top="10vh"
      :visible.sync="dialogVisible"
      width="790px"
      height="456px"
      :modal-append-to-body="false"
      
      :close-on-click-modal="false"
      :modal="false"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        title="选择logo"
        @confirm="dialogVisible = false"
        @close="dialogVisible = false"
        @cancel="dialogVisible = false"
      >
        <template v-slot:dialogContent>
          <div class="app-style-dialog-dialogContent">
            <codeless-dialog-input-pic
                :pic.sync="appForm.logo"
                :pics="showPics"
                :netImgsOrg="[]"
              ></codeless-dialog-input-pic>
          </div>
        </template>
      </codeless-dialog-ctn>
    </el-dialog>
  </div>
</template>

<script>

export default {
  mixins: [ window.codelessMixins.customDialog ],
  props: {
    tab: {
      type: String,
      default: () => {
        return "theme";
      },
    },
  },
  data() {
    return {
      // 主题
      currentTheme: "",
      themes: [
        {
          name: "默认主题",
          id: "",
          color: "white",
        },
        {
          name: "暗黑",
          id: "theme-dark",
          color: "rgb(48,50,68)",
        },
        {
          name: "科技蓝",
          id: "theme-blue",
          color: "rgb(69,118,206)",
        },
        {
          name: "夕阳红",
          id: "theme-red",
          color: "#f8f1f1",
        },
      ],

      // 布局
      currentLayout: "1",
      layouts: [
        {
          id: "1",
          img: require("../assets/images/default-layout.png"),
          name: "默认布局",
          layout: '@micro-page/defaultLayout'
        },
      ],

      // 登录页
      appForm: {
        title: '',
        version: '',
        logo: 'img/agree-logo.png',
        login: '@micro-page/alcapDefaultLogin'
      },

      appRules: {
        title: [ { required: true, message: '项目名称不能为空', trigger: 'change' } ],
        version: [ { required: true, message: '项目版本不能为空', trigger: 'change' } ],
        logo: [ { required: true, message: 'logo不能为空', trigger: 'change' } ], 
        login: [ { required: true, message: '请选择扽轮毂也', trigger: 'change' } ]
      },

      logins: [
        {
          id: '@micro-page/alcapDefaultLogin',
          img: require("../assets/images/login0.png"),
          name: '默认登录页'
        },
        {
          id: '@micro-page/alcapDefaultLogin1',
          img: require("../assets/images/login1.png"),
          name: '登录页一'
        },
        {
          id: '@micro-page/alcapDefaultLogin2',
          img: require("../assets/images/login2.png"),
          name: '登录页二'
        },
      ],
      dialogVisible: false,

      currentCategory: {
        name: "publicImgs",
        title: "本地图片",
      },
      searchText: ''

    };
  },
  computed: {
    showPics() {
      const ctx = this;
      if (ctx.currentCategory.name === "publicImgs") {
        return ctx[ctx.currentCategory.name].filter(
          (i) => i.indexOf(ctx.searchText) > -1
        );
      } else {
        return ctx[ctx.currentCategory.name];
      }
    },

    publicImgs() {
      return this.$store.state.public.publicImg.map((i) => {
        return "/img" + i;
      });
    },
  },
  methods: {
    submit(v) {
      console.log(v);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-style-dialog {
  &-theme {
    height: 456px;
    padding: 0 10px;
    margin-top: -10px;
  }
  &-layout {
    height: 456px;
    padding: 0 10px;
    margin-top: -10px;
  }
  &-login {
    height: 456px;
    padding: 20px 10px;
    margin-top: -10px;
  }
}
</style>