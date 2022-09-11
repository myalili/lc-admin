<template>
  <div class="page w-full h-full flex justify-center items-center">
    <el-button :type="type" :size="size" @click="openPage(page)">{{ title }}</el-button>
    <page-drawer :params="config" :visible.sync="drawer" />
  </div>
</template>

<script>
import pck from "./package.json";
// import PageDrawer from '@/views/codeLess/components/pageDrawer';
export default {
  mixins: [ window.codelessMixins.customDialog ],
  inject: ["root"],
  name: "v2AButtonPage",
  _options: pck.docs,
  components: {
    // PageDrawer
  },
  props: {
    title: {
      type: String,
      default() {
        return '按钮';
      },
    },
    page: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default() {
        return 'primary';
      },
    },
    size: {
      type: String,
      default() {
        return 'mini';
      },
    },
  },
  data() {
    return {
      app: window.pageIwbNuvjh,

      dialogInfo: {
        title: "选择页面",
        visible: false,
        width: "50%",
        params: {},
        component: "",
      },
      emitParams: {},

      config: {
        page: {}
      },
      drawer: false
    };
  },
  methods: {
    openPage(item) {
      const ctx = this;
      console.log("要跳转的页面", item);

      let syncParamsObj = {}
      if (item.syncParams) {
        
        item.syncParams.forEach(i=> {
          if (i.current) {
            if (i.isComponent) {
              ctx.$set(syncParamsObj, i.target, eval('ctx.params.' + i.current))
            }else {
              ctx.$set(syncParamsObj, i.target, eval('ctx.root.args.' + i.current))
            }
          }
        })
      }
      console.log('参数', syncParamsObj);

      let params = {
        title: item.title,
        pageId: item.path.prototypeId,
        prototypeId: item.path.prototypeId,
        runtime: true,
        syncParamsObj
      };
      let option = {
        title: item.title,
        path: item.type === "WINDOW" ? item.path : (item.path.path || ''),
        params,
        dialogInfo: item.dialogInfo
      }
      if (item.type === "drawer") {
        ctx.$set(ctx.config, "page", item.path);
        console.log("ctx.config", ctx.config);
        ctx.drawer = true;
        return
      }

      ctx.v2ComponentOpen(option, item.type);

      ctx.dialogInfo.visible = false;
      
    },
  },
  created() {
    const ctx = this;
    // AUAE.msgHub.$on("click", (item) => {
      
    //   console.log("拓扑emit", item);
    //   ctx.emitParams = item;
    //   //函数内直接用ctx代替this访问vue页面的数据。
    //   ctx.dialogInfo = {
    //     title: `页面列表`,
    //     visible: false,
    //     width: "50%",
    //     params: "",
    //   };
    //   ctx.dialogInfo.visible = true;
      
    // });
    // AUAE.msgHub.$on("contextmenu", (item) => {
    //   console.log("拓扑emit", item);
    // });
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.page {
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;

    .el-dialog{ 
      .el-dialog__body {
        max-height: 600px;
        overflow-y: scroll;
      }
    }
  }
  ::v-deep .aweb-dialog__wrapper {
    z-index: 9999;
  }
}

</style>