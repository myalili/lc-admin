<template>
  <div class="app-release px-5 py-3 w-full h-full">
    <div class="app-release-top w-full flex items-center justify-between">
      <div class="app-release-title font-bold text-base">应用发布</div>
      <div class="app-release-btn flex items-center">
        <el-checkbox v-model="isDev">发布到开发环境</el-checkbox>
        <el-button type="primary" size="mini" round class=" w-20 ml-5">发布</el-button>
      </div>
    </div>
    <div class="app-release-content w-full mt-3 flex items-center justify-between">
      <div class="app-release-content-container h-full" style="width:36%">
        <menus-tree />
      </div>
      <div class="app-release-content-container h-full" style="width:36%">
        <pages-tree />
      </div>
      <div class=" h-full flex flex-col justify-between" style="width:22%">
        <app-style title="主题" tab="theme">
          <div class=" w-full h-full rounded-md flex items-center flex-wrap">
            <div class=" bg-primary w-1/2 rounded-tl-md" style="height:62%"></div>
            <div class=" bg-muted w-1/2 rounded-tr-md " style="height:62%"></div>
            <div class=" bg-secondary  w-1/4 rounded-bl-md " style="height:38%"></div>
            <div class=" bg-base w-1/4 " style="height:38%"></div>
            <div class=" bg-off-base w-1/4 " style="height:38%"></div>
            <div class=" bg-system w-1/4 rounded-br-md " style="height:38%"></div>
          </div>
        </app-style>

        <app-style title="布局" tab="layout">
          <div class=" w-full h-full rounded-md flex items-center justify-center border-dashed border border-gray-400">
            <i class="el-icon-plus"></i>
          </div>
        </app-style>

        <app-style title="登录页" tab="login">
          <div class=" w-full h-full rounded-md ">
            <img class="w-full h-full" src="./assets/images/login0.png" alt="" srcset="">
          </div>
        </app-style>
      </div>
    </div>
  </div>
</template>

<script>
  import menusTree from "./components/menusTree.vue";
  import pagesTree from "./components/pagesTree.vue";
  import appStyle from "./components/appStyle.vue";
export default {
  name: 'appRelease',
  components: {
    menusTree,
    pagesTree,
    appStyle
  },
  data() {
    return {
      isDev: false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-release {
  &-top {
    
  }
  &-title {
      
  }
  &-content {
    height: calc( 100% - 48px );
    &-container {
    }
  }
}
</style>