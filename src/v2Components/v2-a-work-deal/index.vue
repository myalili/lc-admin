<template>
  <div class="v2-a-work-deal">
    <div
      class="work-deal-card work-deal-title-card relative"
      :style="{ '--bg': './img/bg_01.png' }"
    >
      <div
        class="work-deal-icon flex items-center justify-center"
        :style="{ '--bg': compBg('01') }"
      >
        <codeless-icon
          :icon="mainIcon"
          style="width: 23px; height: 23px"
        ></codeless-icon>
      </div>
      <div class="work-deal-main-title">
        {{ mainTitle }}
      </div>
      <img
        class="w-full h-full absolute top-0 left-0"
        src="./img/bg_01.png"
        alt=""
        srcset=""
      />
    </div>
    <div
      class="work-deal-card relative"
      :style="{ '--bg': item.model.bg }"
      v-for="item in options"
      :key="item.model.title"
      @click="openPage(item.model.page)"
    >
      <div
        class="work-deal-icon flex items-center justify-center"
        :style="{ '--bg': compBg(item.model.bg) }"
      >
        <codeless-icon
          :icon="item.model.icon"
          style="width: 23px; height: 23px"
        ></codeless-icon>
      </div>
      <div class="content">
        <div class="title-ch">{{ item.model.title }}</div>
        <div class="num">
          {{ Number(item.model.num) > 999 ? "999" : item.model.num }}
        </div>
      </div>
      <img
        class="w-full h-full absolute top-0 left-0"
        :src="require(`./img/bg_${item.model.bg}.png`)"
        alt=""
        srcset=""
      />
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  mixins: [window.codelessMixins.customDialog],
  _options: pck.docs,
  name: "v2AWorkDeal",
  props: {
    mainTitle: {
      type: String,
      default: "",
    },
    mainIcon: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    const ctx = this;
    console.log("办理事件数据", ctx.options);
  },
  computed: {
    objMap() {
      const ctx = this;
      return ctx.options;
    },
    compBg() {
      return (bg) => {
        const bgMap = {
          "01": "#fff5f5",
          "02": "#e4f1ff",
          "03": "#e6fbf5",
        };
        return bgMap[bg];
      };
    },
  },
  methods: {
    colorMap() {
      const ctx = this;
      ctx.obj = ctx.options[ctx.type];
    },
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
};
</script>

<style lang="less" scoped>
.v2-a-work-deal {
  box-sizing: border-box;
  // padding: 16px 20px;
  display: flex;
  // align-items: center;
  background: transparent;
  opacity: 1;
  border-radius: 6px;
  overflow: auto;

  align-items: center;
  justify-content: space-around;
  .work-deal-card:nth-last-child(1) {
    margin-right: 0;
  }
  .work-deal-card {
    width: 287px;
    height: 96px;
    margin-right: 24px;
    background: #fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 23px 32px;
    cursor: pointer;
    .work-deal-icon {
      width: 52px;
      height: 52px;
      margin-right: 18px;
      border-radius: 16px;
      background: var(--bg);
    }
    .content {
      width: 60%;
      .title-ch {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #333333;
        opacity: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
    .num {
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #333333;
      opacity: 1;
    }
  }
  .work-deal-title-card {
    cursor: default;
    .work-deal-main-title {
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 41px;
      color: #333333;
      opacity: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
</style>
