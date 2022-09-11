<template>
  <div
    :class="{ edit: edit, pr_mobile: edit && mode }"
    @dragenter="
      (e) => {
        e.preventDefault();
      }
    "
    @dragover="
      (e) => {
        e.preventDefault();
      }
    "
    class="pr_wrapper"
    :style="pageCss"
  >
    <grid-layout-index
      ref="pageRender"
      :page-def="pageDef"
      :editable="edit"
      :mode="edit && mode"
      :pHeight="pHeight"
      :pWidth="pWidth"
      class="pr_page_render"
      :class="{ edit: edit }"
      id="pr_page_render"
    ></grid-layout-index>
  </div>
</template>

<script>
const elementResizeDetectorMaker = require("element-resize-detector");
import gridLayoutIndex from "./grid.vue";

export default {
  name: "codelessGridLayout",
  props: ["edit", "pageDef"],
  inject: ["root"],
  components: {
    gridLayoutIndex,
  },
  data() {
    return {
      mode: false,
      pHeight: "600",

      pWidth: "800",
      erd: null,
    };
  },
  computed: {
    pageCss() {
      const css = this.root.pageCss;

      // console.log('最终的背景', css);
      if (!css)
        return {
          background: "rgb(231, 236, 239)",
        };
      if (css.bg === "img") {
        return {
          backgroundImage: css.img ? `url(${css.img.url})` : "",
          backgroundSize: "100% 100%",
          backgroundColor: !css.img ? "rgb(231, 236, 239)" : "",
        };
      } else {
        return {
          background: css.color,
        };
      }
    },
  },
  mounted() {
    let self = this;

    window.msgHub.$on("modeChanged", (mode) => {
      self.mode = mode;
    });

    self.$nextTick(() => {
      this.recalSize();
      window.addEventListener("resize", this.recalSize);

      this.erd = elementResizeDetectorMaker({
        strategy: "scroll", //<- For ultra performance.
        // See https://github.com/wnr/element-resize-detector/issues/110 about callOnAdd.
        callOnAdd: false,
      });
      // debugger;
      if (self.$refs.pageRender) {
        this.erd.listenTo(self.$refs.pageRender.$el, function () {
          self.recalSize();
        });
      }
    });
  },
  methods: {
    recalSize() {
      let pageRender = this.$refs.pageRender;
      if (pageRender) {
        this.pHeight = pageRender.$el.offsetHeight;
        this.pWidth = pageRender.$el.offsetWidth;
        // console.log("pWidth", this.pWidth);
        // console.log("pHeight", this.pHeight);

        this.$nextTick(() => {
          pageRender.relocal();
        });
      }
    },
    getPageContent() {
      return this.content;
    },
  },
  destroyed() {
    window.msgHub.$off("modeChanged");
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.recalSize);
    if (this.erd) {
      this.erd.uninstall(this.$refs.pageRender.$el);
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vue-grid-layout {
  .vue-grid-item {
    // padding: 0 5px;
    box-sizing: border-box;
    padding-bottom: 10px;
    .vue-resizable-handle {
      z-index: 701;
    }
  }
  .vue-grid-item.vue-grid-placeholder {
    @apply bg-primary;
  }
}
.pr_wrapper {
  position: relative;
  width: 100%;

  height: 100%;
  background: rgb(231, 236, 239);
}

.pr_page_render {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  padding: 10px 5px 0px;
  // background: rgb(231, 236, 239);

  // background: #f1f3f4;
  &.edit {
    padding-bottom: 150px;
    padding-top: 17px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}

.pr_mobile {
  width: 100%;
  height: 100%;

  background: rgb(231, 236, 239);
  position: relative;
  ::v-deep .screenPage {
    left: 50%;
    width: 375px;
    height: 90% !important;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0px 10px lightgrey;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>
