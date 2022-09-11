<template>
  <div class="app-style w-full">
    <div
      class="app-style-top w-full h-10 px-4 flex items-center justify-between"
    >
      <div class="app-style-top-title">{{ title }}</div>
      <span class="app-style-top-reset cursor-pointer">重置</span>
    </div>
    <div
      class="app-style-content w-full cursor-pointer"
      @click="dialogVisible = true"
    >
      <slot></slot>
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

        @confirm="submit"
        @close="dialogVisible = false"
        @cancel="dialogVisible = false"
      >
        <template v-slot:title>
          <el-tabs v-model="currentTab" class="app-style-dialog-title">
            <el-tab-pane label="主题" name="theme"></el-tab-pane>
            <el-tab-pane label="布局" name="layout"></el-tab-pane>
            <el-tab-pane label="登录页" name="login"></el-tab-pane>
          </el-tabs>
        </template>
        <template v-slot:dialogContent>
          <div class="app-style-dialog-dialogContent">
            <app-style-dialog :tab="currentTab" />
          </div>
        </template>
      </codeless-dialog-ctn>
    </el-dialog>
  </div>
</template>

<script>
  import appStyleDialog from './appStyleDialog.vue'
export default {
  mixins: [window.codelessMixins.customDialog],
  components: {
    appStyleDialog
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    tab: {
      type: String,
      default: () => {
        return "theme";
      },
    },
  },
  data() {
    return {
      currentTab: "theme",
      dialogVisible: false,
    };
  },
  watch: {
    dialogVisible(n) {
      if(n) {
        this.currentTab = this.tab;
      console.log('tab', this.tab);
      }
      
    }
  },
  methods: {
    submit() {
      this.dialogVisible = false
    }
  },
};
</script>

<style lang="scss" scoped>
.app-style {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.39);
  border: 1px solid #c8d0d4;
  opacity: 1;
  border-radius: 6px;
  height: 31%;
  &-top {
    height: 40px;
    background: rgba(247, 250, 251, 0.39);
    opacity: 1;
    border-radius: 5px 5px 0px 0px;
    &-title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 24px;
      color: #333333;
    }
    &-reset {
      color: #357aa0;
    }
  }
  &-content {
    height: calc(100% - 40px);
    padding: 16px;
    border-radius: 6px;
  }
}
.app-style-dialog-title {
  height: 42px;
  ::v-deep .el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap {
      &::after {
        opacity: 0;
      }
      .el-tabs__nav {
        padding-bottom: 2px;
        .el-tabs__active-bar {
          @apply bg-primary;
        }
        .el-tabs__item.is-active {
          font-weight: bold;
        }
      }
    }
  }
}
</style>