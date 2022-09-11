<template>
  <component
    :is="subComponent"
    v-bind="$attrs"
    v-on="$listeners"
    ref="_op_subPage"
  />
</template>

<script>
import { _import, _require } from "../mixin/index.js";
// import _require from "../util/_require_pro";

/**
 * 动态文件加载器
 */

export default {
  name: "subPageCtn",
  inheritAttrs: false,

  props: {
    // 文件的路径
    page: {
      default: null,
    },

    params: {
      type: [Object, Array],
      default: () => {},
    },
    other: {
      default: () => false,
    },
    deploy: {
      default: () => false,
    },
    pageType: {
      default: () => "",
    },
  },
  data() {
    return {
      subComponent: this.getPage(this.page),
    };
  },
  created() {
    //兼容 7.x.x
    this.$nextTick(async () => {
      if (this.subComponent && typeof this.subComponent === "function") {
        let subComponent = await this.subComponent();
        subComponent &&
          subComponent.resume &&
          subComponent.resume.call(this.$refs._op_subPage);
        this.$refs._op_subPage &&
          this.$refs._op_subPage.__resume &&
          this.$refs._op_subPage.__resume();
      }
    });
  },
  watch: {
    page() {
      this.subComponent = this.getPage(this.page);
    },
  },
  methods: {
    reload(page = this.page) {
      this.subComponent = this.getPage(page);
    },
    getPage(component = this.page) {
      // return typeof path === "string" ? _import(path, deploy) : path;
      let relComp;
      if (this.pageType === "js" || this.other) {
        // other = true;
        relComp = _require(component);
      } else if (this.pageType === "component") {
        relComp = Vue && Vue.options.components[component];
      } else if (typeof component === "string") {
        relComp = _import(component, this.deploy);
      } else {
        relComp = component;
      }
      return relComp;
      // return typeof component === "string"
      //   ? this.other
      //     ? _require(component)
      //     : _import(component, this.deploy)
      //   : component;
    },
  },
  async destroyed() {
    //兼容 7.x.x

    if (this.subComponent && typeof this.subComponent === "function") {
      let subComponent = await this.subComponent();
      subComponent &&
        subComponent.pause &&
        subComponent.pause.call(this.$children[0]);
      this.$children.length &&
        this.$children[0].__pause &&
        this.$children[0].__pause();
    }
  },
};
</script>