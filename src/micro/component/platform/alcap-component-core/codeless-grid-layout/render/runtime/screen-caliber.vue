<template>
  <div :style="caliberGroupStyle" class="v2CaliberGroup V2Container">
    <div
      @click="select(caliber.value)"
      v-for="(caliber, index) in selectedCalibers"
      :key="index"
      :style="caliberStyle(caliber.value)"
      class="v2Caliber V2Container"
      @mouseenter="mouseenter(caliber.value)"
      @mouseleave="mouseleave(caliber.value)"
    >
      <img
        v-if="imgPath(caliber.value)"
        @mousedown="($event) => $event.preventDefault()"
        :src="`${imgPath(caliber.value)}`"
      />
      <span :style="fontStyle(caliber.value)">{{ caliber.label }}</span>
    </div>
  </div>
</template>
<script>
/**
 * 口径组组件。
 * 口径为 今日/近三日/近五日/近一周/近两周/近一月/近三月/近半年/近一年 中的1~3个
 */
const mapping = {
  oneDay: "今日",
  threeDay: "近三日",
  fiveDay: "近五日",
  sevenDay: "近一周",
  fourtyDay: "近两周",
  oneMonth: "近一月",
  threeMonth: "近三月",
  sixMonth: "近半年",
  oneYear: "近一年",
};
export default {
  name: "v2-screen-caliber",
  data() {
    return {
      hoverTarget: null,
      activeTarget: null,
      componentName: "v2-screen-caliber",
    };
  },
  inject: ["screenPanel"],
  props: [
    "selections",
    "align",
    "image",
    "target",
    "activeImage",
    "hoverImage",
    "distance",
    "color",
    "textAlign",
    "fontSize",
    "font",
    "activeColor",
    "hoverColor",
    "width",
    "activeBackgroundColor",
  ],
  mounted() {
    this.activeTarget = this.selectedCalibers[0] && this.selectedCalibers[0].value
    this.$forceUpdate();
    setTimeout(() => {
      this.update();
    }, 300);
  },
  methods: {
    mouseenter(target) {
      this.hoverTarget = target;
      this.$forceUpdate();
    },
    mouseleave(target) {
      this.hoverTarget = null;
      this.$forceUpdate();
    },
    select(active) {
      this.activeTarget = active;
      this.$forceUpdate();
      this.update();
      // this.screenPanel && this.screenPanel.updateComponent({caliber:active})
    },
    update() {
      if (!this.screenPanel) return;
      let value = this.activeTarget;
      if (this.target) {
        let v = this.screenPanel.findRefs(this.target, this);
        if (v) {
          let ids = this.screenPanel
            .findTargetChilds(v.$children)
            .map((i) => i.wid || i.$el.getAttribute("wid"));
          if (ids.length > 0) {
            this.screenPanel.updateComponent({ ids, params: { caliber: value } });
            return;
          }
        } else {
          console.log("指定容器查找失败！", this.target);
        }
      }
      this.screenPanel.updateComponent({
        type: "v2-screen-caliber",
        el: this.$el,
        params: { caliber: value },
      });
    },
  },
  computed: {
    selectedCalibers() {
      let selections = this.selections;
      if (selections) {
        let r = [];
        for (let i = 0; i < selections.length && i < 3; i++) {
          r.push({
            label: mapping[selections[i]],
            value: selections[i],
          });
        }
        return r;
      }
      return [];
    },
    imgPath() {
      return (caliber) =>{
          let ret = (this.hoverTarget == caliber && this.hoverImage) || (this.activeTarget == caliber && this.activeImage) || this.image;
          if(ret && (ret.indexOf('aweb-api/')===-1)){
            ret = `/v1/public/${ret}`
          }
          return ret;
      }

       
    },
    fontColor() {
      return (caliber) =>
        (this.hoverTarget == caliber && this.hoverColor) ||
        (this.activeTarget == caliber && this.activeColor) ||
        this.color;
    },
    fontStyle() {
      return (caliber) => ({
        position: "absolute",
        width: "100%",
        left: 0,
        top: 0,
        "text-align": this.textAlign || "center",
        "line-height": $(this.$el).height() + "px",
        "font-family": this.font,
        color: this.fontColor(caliber),
      });
    },
    caliberGroupStyle() {
      if (this.selectedCalibers && this.selectedCalibers.length)
        return {
          display: "flex",
          "flex-direction": "row",
          "flex-wrap": "nowrap",
          "justify-content": this.align,
          "font-size": this.fontSize + "px",
        };
      return {
        width: "80px",
        height: "30px",
        // background: 'rgba(31, 133, 234, 0.6)',
      };
    },
    // caliberStyle() {
    //   if (!this.imgPath) {
    //     return {
    //       width: "100px",
    //       height: "50px",
    //       background: "rgba(233,91,51,.7)",
    //     };
    //   }
    //   return {
    //     width: "auto",
    //     height: "auto",
    //     "margin-left": this.distance + "px",
    //     "min-width": "20px",
    //     "min-height": "20px",
    //     "background-size": "cover",
    //   };
    // },
    caliberStyle() {
      return (caliber) => ({
        width: (this.width && this.width + "px") || "auto",
        height: this.imgPath ? "auto" : "100%",
        "margin-left": this.distance + "px",
        "min-width": "20px",
        "min-height": "20px",
        "background-size": "cover",
        "text-align": this.textAlign || "center",
        color: this.activeColor || this.color || null,
        background:
          (this.activeTarget == caliber && this.activeBackgroundColor) || null,
      });
    },
  },
};
</script>
