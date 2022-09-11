<template>
  <div @mousedown="click" :style="btnStyle" class="v2TabButton V2Container">
    <img
      @mousedown="($event) => $event.preventDefault()"
      :src="`${imgPath}`"
    />
    <span :style="fontStyle">{{ text }}</span>
  </div>
</template>
<script>
/**
 * 自动化的大屏排序组件
 */
export default {
  name: "v2-screen-btn",
  inject: ["screenPanel"],
  props: [
    "positiveText",
    "negativeText",
    "positiveImage",
    "negativeImage",
    "target",
    "text",
    "color",
    "textAlign",
    "font",
    "negativeColor",
    "positiveColor",
    "defaultOrder",
  ],
  data() {
    return {
      order: true,
      componentName: "v2-screen-sorter",
    };
  },
  mounted() {
    this.order = this.defaultOrder;
    setTimeout(() => {
      this.update();
    }, 300);
  },
  methods: {
    click() {
      this.order = !this.order;
      this.update();
    },
    setOrder(order) {
      this.order = order;
      this.update();
    },
    update() {
      if (!this.screenPanel) return;
      let value = this.order ? "asc" : "desc";
      if (this.target) {
        let v = this.screenPanel.findRefs(this.target,this);
        if (v) {
          let ids = this.screenPanel.findTargetChilds(v.$children).map((i) => i.wid || i.$el.getAttribute("wid"));
          if (ids.length > 0) {
            this.screenPanel.updateComponent({ ids, params: { order: value } });
            return;
          }
        } else {
          console.log("指定容器查找失败！", this.target);
        }
      }
      this.screenPanel.updateComponent({
        type: "v2-screen-sorter",
        el: this.$el,
        params: { order: value },
      });
    },
   
  },
  computed: {
    text() {
      return (this.order && this.positiveText) || this.negativeText;
    },
    imgPath() {
      let ret  = (this.order && this.positiveImage) || this.negativeImage ||this.positiveImage;
      if(ret && (ret.indexOf('aweb-api/')===-1)){
        ret = `/v1/public/${ret}`
      }
      return ret
    },
    fontColor() {
      return (
        (this.order && this.positiveColor) ||
        this.negativeColor ||
        this.positiveColor
      );
    },
    fontStyle() {
      return {
        position: "absolute",
        width: "100%",
        left: 0,
        "text-align": this.textAlign || "center",
        "line-height": $(this.$el).height() + "px",
        "font-family": this.font,
        color: this.fontColor,
      };
    },
    btnStyle() {
      if (!this.positiveImage) {
        return {
          width: "100px",
          height: "50px",
          background: "rgba(233,91,51,.7)",
        };
      }
      return {
        width: "auto",
        height: "auto",
        ...this.commonStyle,
        "min-width": "20px",
        "min-height": "20px",
      };
    },
  },
};
</script>
