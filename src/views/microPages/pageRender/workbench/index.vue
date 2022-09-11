<template>
  <div
    :class="[
      'workbench-bg',
      edit ? 'workbench-editor' : 'workbench-wrapper',
      $route && ($route.query.class || $route.query.menuId),
    ]"
  >
    <skeleton v-if="loading"> </skeleton>
    <template v-else>
      <tool-bar
        :edit.sync="edit"
        @save="save"
        :title="title"
        :type="type"
      >
      </tool-bar>
      <div class="workbench-content" :class="preview ? 'preview' : ''">
        <codeless-grid-layout :page-def="pageContent" :edit="edit">
        </codeless-grid-layout>
      </div>
    </template>
  </div>
</template>

<script>
import workJson from "./index.json";
const { editMenu, getMenu } = window.getAacApi();

export default {
  mixins: [window.V8.mixins],
  components: {
    // skeleton,
    // ToolBar,
  },
  provide() {
    return {
      root: this,
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        this.refresh();
      },
    },
  },
  data() {
    return {
      // mode: false,
      loading: false,
      edit: false,
      pageId: "",
      title: "工作台",
      type: "10",
      preview: true,

      pageContent: {},
      workJson,
    };
  },
  async mounted() {
    await this.refresh();
  },
  computed: {},
  methods: {
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    async refresh() {
      // debugger;
      const ctx = this;
      let params = (ctx.$route && ctx.$route.query) || ctx.AParams || {};

      ctx.pageId = params.menuId;
      ctx.loading = true;
      if (ctx.pageId) {
        // await ctx.$store
        //   .dispatch("codeless/getPageContent", ctx.pageId)
        await getMenu(ctx.pageId)
          .then((res) => {
            console.log("ctx.$store.state.codeless.pageContent res", res);
            ctx.pageObj = res.content;
            if (!res.content.pageContent || res.content.pageContent === "{}") {
              ctx.pageContent = ctx.workJson;
            } else {
              ctx.pageContent = JSON.parse(res.content.pageContent);
            }
            ctx.cancelLoading();
            console.log("工作台内容", ctx.pageContent);
          })
          .catch((e) => {
            ctx.cancelLoading();
          });
      } else {
        ctx.pageContent = ctx.workJson;
        ctx.cancelLoading();
      }
    },
    async save() {
      const ctx = this;
      if (this.pageId) {
        // this.$store
        //   .dispatch("codeless/setPageContent", {
        //     ...ctx.pageObj,
        //     pageContent: JSON.stringify(this.pageContent),
        //   })
        let menuPO = {
          ...ctx.pageObj,
          pageContent: JSON.stringify(this.pageContent),
        };
        console.log("页面内容", this.pageContent);
        editMenu({
          id: ctx.pageObj.id,
          menuPO: menuPO,
        })
          .then((res) => {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            // this.$emit("refresh");
          })
          .catch((err) => {
            console.log("err", err);
            this.$message.error("保存失败！");
          });
      } else {
        this.$message({
          message: "保存成功",
          type: "success",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.workbench-bg {
  width: 100%;
  height: 100%;
  &.workbench-editor {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }
  ::v-deep .pr_page_render {
    padding-top: 0;
  }
  .code-less-toolbar {
    background: rgb(231, 236, 239);
  }
  .workbench-content {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    overflow: auto;
    overflow-x: hidden;
  }
}
</style>
