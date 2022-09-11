<template>
  <div class="entrance">
    <div class="top">
      <div class="top-left">
        <codeless-icon
          icon="icon-kuaijierukou-gongzuotai"
          style="margin-right: 6px"
        ></codeless-icon>
        快捷入口
      </div>
      <div class="top-right">
        全部入口
        <i
          class="el-icon-arrow-right"
          style="font-size: 10px; margin-left: 6px"
        ></i>
      </div>
    </div>
    <div class="entrance-list">
      <div
        class="entrance-content"
        v-for="(item, index) in entrance"
        :key="index"
        @click="openPage(item)"
      >
        <div class="icon">
          <codeless-icon
            :icon="item.path.icon ? item.path.icon : 'icon-kuaijierukou4'"
            style="width: 100%; height: 100%"
          ></codeless-icon>
        </div>
        <p>{{ item.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  mixins: [ window.codelessMixins.customDialog ],
  _options: pck.docs,
  inject: ["root"],
  name: "v2AWorkEntrance",
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      list: [],
      path: "",
      pck,
    };
  },
  computed: {
    entrance() {
      console.log("v2AWorkEntrance", this.config);
      const pages = this.config.pages;
      if (pages.length > 0) {
        return pages;
      } else {
        return this.list;
      }
    },
  },
  mounted() {
    this.list = this.$store.state.user.menus.filter(
      (i) => i.codelessType && i.codelessType === "0"
    );
    function compare(p) {
      return (m, n) => {
        var a = m[p];
        var b = n[p];
        return b - a;
      };
    }
    this.list = this.list.sort(compare("createTime")).slice(0, 7);
    console.log(this.list);
  },
  methods: {
    getList() {},
    openPage(item) {
      const ctx = this;
      console.log("要跳转的页面", item);

      let params = {
        title: item.title,
        pageId: item.path.prototypeId,
        prototypeId: item.path.prototypeId,
        runtime: true
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
      
    },
    findLeaf(array) {
      let nodes = [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.children && Array.isArray(element.children)) {
          nodes = [...nodes, ...this.findLeaf(element.children)];
        } else {
          if (element.id) {
            nodes.push(element);
          }
        }
      }
      return nodes;
    },
    forId(parentId) {
      const ctx = this;
      let pId = parentId;
      let ppId = "";
      if (pId[0] === "/") {
        ppId = pId.split("/")[1];
      } else {
        ppId = parentId;
      }
      this.$store.state.user.currentMenus.map((i) => {
        if (i.id === ppId && i.parentId) {
          pId = "/" + i.parentId + "/" + ppId;
        }
      });
      let pIdArr = pId.split("/");
      if (pIdArr[1] !== ppId) {
        this.forId(pId);
      } else {
        this.path = pId;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.entrance {
  // height: 212px !important;
  box-sizing: border-box;
  overflow: hidden;
  background: #ffffff;
  opacity: 1;
  border-radius: 7px;
  .top {
    width: 100%;
    height: 16px;
    box-sizing: border-box;
    padding: 0 23px 0 18px;
    margin: 21px 0 18px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top-left {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 32px;
      color: #333333;
      opacity: 1;
      display: flex;
      align-items: center;
    }
    .top-right {
      font-size: 14px;
      font-weight: 400;
      line-height: 36px;
      color: #a4aeb4;
      opacity: 1;
      display: flex;
      align-items: center;
      &:hover {
        color: #3698f2;
        cursor: pointer;
      }
    }
  }
  .entrance-list {
    width: 100%;

    box-sizing: border-box;
    padding: 0 27px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    // overflow-x: scroll;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    .entrance-content {
      cursor: pointer;
      min-width: 144px;
      box-sizing: border-box;
      padding: 0 20px;
      padding-bottom: 12px;
      background: #ffffff;
      border-radius: 7px;
      margin-right: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 24px;
      color: #333333;
      text-align: center;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2; //在第几行显示...
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
      .icon {
        width: 44px;
        height: 44px;
        margin: 21px 0 15px 0;
      }
      &:hover {
        background: #f7fafb;
        cursor: pointer;
      }
    }
    .entrance-content:nth-last-child(1) {
      margin-right: 0;
    }
  }
}
</style>
