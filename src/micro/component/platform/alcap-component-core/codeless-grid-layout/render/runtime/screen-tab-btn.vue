<template>
  <div @click="click" style="display: flex;align-items: center;justify-content: center;" class="v2TabButton V2Container">
    <img ref="img" v-if="imgPath" @mousedown="($event) => $event.preventDefault()" :src="`${imgPath}`" @load="refresh" style="position: absolute;width:100%;height:100%;" />
    <span :style="fontStyle">{{ text }}</span>
  </div>
</template>
<script>
/**
 * 运行时大屏组件
 * 如果不做任何设定，它会根据创建顺序决定自身的标记位，点击后自动决定切换哪个可切换面板的对应的板块。
 * 它可以指定标记位（activeIndex），可以指定要操作的可切换面板（switchable ref）
 */
export default {
  name: "v2-screen-btn",
  data() {
    return {
      isHover: false,
      isActive: false,
      componentName: "v2-screen-btn",
      height: 20,
    };
  },
  mounted() {
    this.rootPanel.registTab && this.rootPanel.registTab(this);
    // console.log("btn", this);
    this.refresh();
    let self = this;
    $(this.$el).on("mouseenter.stb", () => {
      self.isHover = true;
    });

    $(this.$el).on("mouseleave.stb", () => {
      self.isHover = false;
    });
  },
  beforeDestroy() {
    $(this.$el).off(".stb");
  },
  inject: ["screenPanel"],
  props: [
    "image",
    "hoverImage",
    "activeImage",
    "target",
    "activeIndex",
    "text",
    "color",
    "textAlign",
    "fontSize",
    "font",
    "activeColor",
    "hoverColor",
    "activeBackgroundColor",
    "clickUpdate",
  ],
  methods: {
    refresh() {
      setTimeout(() => {
        let self = this;
        self.height = $(self.$el).height();
      }, 100);
    },
    click(e) {
      //检查当前custom中的所有button和switchable
      if (!this.rootPanel) {
        console.log("大屏切换按钮只能操作大屏面板内的组件");
        return;
      }
      let target = this.foundTarget(this.rootPanel.$children);
      if (target) {
        let i = this.getActiveIndex();
        if (target.setAmountIndex) target.setAmountIndex(i);
        else {
          console.log("可切换组件版本异常", target);
        }
        !isNaN(this.rootPanel.autoPlayIndex) && (this.rootPanel.autoPlayIndex = i);
        this.rootPanel.setActiveTab && this.rootPanel.setActiveTab(this);
        // 如果是点击触发的事件 且配置了点击刷新的属性
        if (e && e.x && e.y && this.clickUpdate && target.$children[i]) {
          const com = target.$children[i];
          if (com.schema_type || com.SCHEMA_TYPE) {
            if (com.$attrs.wid) {
              IDE.$Scheduler.refresh({ wid: com.$attrs.wid });
            } else {
              console.warn('[无法获取组件wid，无法更新此组件数据请求]',com);
              //  IDE.$Scheduler.refresh({ panelCid: `${this.rootPanel.wid}_${com.wid}` });
            }
          }
        }
      }
    },
    getActiveIndex() {
      if (this.activeIndex !== undefined) return this.activeIndex;
      return (this.activeIndex = this.foundIndex(this.rootPanel.$children));
    },
    foundIndex(children, index = 0) {
      for (let child of children) {
        if (child) {
          if (child.componentName == "v2-screen-btn") {
            if ($(child.$el).offset().left < $(this.$el).offset().left) {
              index++;
            }
          }
          if (child.$children) {
            index = this.foundIndex(child.$children, index);
          }
        }
      }
      return index;
    },
    foundTarget(children) {
      let t;
      if (this.target) {
        if (this.target.$el) return this.target;
        t = this.rootPanel.$refs[this.target];
      }
      if (t) return t;

      for (let child of children) {
        if (child) {
          if (child.componentName === "v2-switchable") {
            this.target = child;
            return child;
          }
          if (child.$children) {
            let target = this.foundTarget(child.$children);
            if (target) return target;
          }
        }
      }
    },
    setActive(active) {
      this.isActive = active;
      this.$forceUpdate();
    },
  },
  computed: {
    rootPanel() {
      if (this.screenPanel) return this.screenPanel;
      let parent = this.$parent;
      while (parent && !$(parent.$el).hasClass("v2ScreenPanel")) {
        parent = parent.$parent;
      }
      return parent;
    },
    imgPath() {
      let ret = (this.isHover && this.hoverImage) || (this.isActive && this.activeImage) || this.image;
      if (ret && ret.indexOf("aweb-api/") === -1) {
        ret = `/v1/public/${ret}`;
      }
      return ret;
    },
    fontColor() {
      return (this.isHover && this.hoverFont) || (this.isActive && this.activeColor) || this.color;
    },
    fontStyle() {
      return {
        // position: "absolute",
        width: "100%",
        left: 0,
        top: 0,
        "text-align": this.textAlign || "center",
        "line-height": this.height + "px",
        "font-family": this.font,
        "font-size": this.fontSize,
        color: this.fontColor,
        background: (this.isActive && this.activeBackgroundColor) || null,
      };
    },
  },
};
</script>
