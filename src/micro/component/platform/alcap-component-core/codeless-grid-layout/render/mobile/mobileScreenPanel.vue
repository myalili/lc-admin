<template>
  <div class="mobile-screen-panel" :style="mobileStyle">
    <div style="background: white;margin:0 5px;">{{ config.mainTitle }}</div>
    <template v-if="config && config.component === 'v2-screen-panel'">
      <template v-if="config.tabsVisible">
        <el-carousel height="100%" v-if="config.children.length > 2">
          <el-carousel-item v-for="(m, index) in config.children" :key="index">
            <div style="background: yellow">
              {{ config.tabsDefine[index] && config.tabsDefine[index].text }}
            </div>
            <slot :name="m.slotName"></slot>
          </el-carousel-item>
        </el-carousel>
      </template>
    </template>
    <template v-else>
      <!-- <transition :name="anime">
          <slot v-if="visible"></slot>
        </transition> -->
      <slot></slot>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      componentName: "v2-screen-panel",
      autoPlayIndex: 0,
      visible: false,
      activeIndex: 0,
    };
  },
  props: [
    "wid",
    "config",
    "activeTab",
    "autoSwitchInterval",
    "autoSwitch",
    "anime",
    "panelTheme",
  ],
  methods: {
    getWindowSize() {
      let doc = this.$root.$el.ownerDocument;
      return {
        width: doc.documentElement.clientWidth || doc.body.clientWidth,
        height: doc.documentElement.clientHeight || doc.body.clientHeight,
      };
    },
  },
  computed: {
    mobileStyle() {
      if (this.config.children && this.config.children.length) {
        let width = parseInt(this.config.containerWidth);
        let height = parseInt(this.config.containerHeight);
        return {
          position: "relative",
          "margin-top": "5px",
          width: "100vw",
          height: (height * 100) / width + "vw",
        };
      }

      let cw = this.config?.commonStyle.width;
      let ch = this.config?.commonStyle.height || "0px";
      if (cw && cw.endsWith && cw.endsWith("px")) {
        let rcw = Number(cw.substr(0, cw.length - 2));
        let rch = Number(ch.substr(0, ch.length - 2));
        let scale = this.getWindowSize().width / rcw;
        if (rcw)
          return {
            position: "relative",
            transform: `scale(${scale})`,
            height: `${rch * scale}px`,
            "margin-top": "5px",
            "transform-origin": "1px 0",
          };
      }
    },
  },
};
</script>
<style>
.mobile-screen-panel {
  box-shadow: 1px 2px 6px #ccc;
  background-color: #fff;
}
</style>
