<template>
  <transition :name="anime">
    <div class="v2ScreenPanel bg-white" v-if="visible" :style="panelStyle">
      <!-- 大屏通用面板渲染 -->
      <template v-if="config && config.component === 'v2-screen-panel'">
        <div class="v2ScreenPanel-common" style="width:100%;height:100%">
          <img
            v-if="panelBgImg"
            :src="panelBgImg"
            style="position: absolute;width:100%;height:100%;user-drag:none;"
            alt=""
            srcset=""
          />
          <component
            v-for="(cpt, i) in screenCpts"
            :key="i"
            :style="cpt.style"
            :is="cpt.name"
            v-bind="cpt.props"
          ></component>
          <a v-for="(d, i) in division" :key="i" :style="d.style">{{
            d.content
          }}</a>
          <a v-if="config.mainTitleVisible" :style="panelMainTitle">{{
            config.mainTitle
          }}</a>
          <a v-if="config.subtitleVisible" :style="panelSubtitle">{{
            config.subtitle
          }}</a>
          <div :style="panelContainer">
            <template v-if="config.tabsVisible">
              <v2-switchable :activeindex.sync="activeindex">
                <template v-slot="$scope">
                  <div
                    style="width:100%;height:100%;overflow:hidden;"
                    class="switchable-wrap"
                    v-for="(m, i) in config.children"
                    :key="i"
                    v-show="m.slotName === `slot_${$scope.activeindex}`"
                  >
                    <slot :name="m.slotName"></slot>
                  </div>
                </template>
              </v2-switchable>
            </template>
            <template v-else>
              <slot></slot>
            </template>
          </div>
        </div>
      </template>
      <!-- 正常渲染 -->
      <template v-else>
        <!-- <transition :name="anime">
          <slot v-if="visible"></slot>
        </transition> -->
        <slot></slot>
      </template>
    </div>
  </transition>
</template>
<script>
import v2Switchable from "./runtime/v2-switchable.vue";
export default {
  components: { v2Switchable },
  data() {
    return {
      tabs: [],
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
  provide() {
    return {
      screenPanel: this,
    };
  },
  computed: {
    style() {
      return {
        width: "100px",
        height: "100px",
        border: "1px solid lightgray",
        background: "rgba(123,133,122,.7)",
        ...this.config.commonStyle,
      };
    },
    screenCpts() {
      let config = this.config,
        theme = this.panelTheme;
      if (config.component !== "v2-screen-panel") return;
      let result = [],
        target = ["sorter", "caliber", "btn"],
        position = ["Left", "Top", "Right", "Bottom", "Width", "Height"],
        map = {};
      for (const key in config) {
        for (let i = 0; i < 4; i++) {
          let t = target[i];
          if (key.startsWith(t)) {
            if (!map[t]) {
              map[t] = {
                name: `v2-screen-${t}`,
                props: {},
                style: { position: "absolute" },
              };
            }
            let propsName = key.replace(t, "");
            propsName = propsName[0].toLowerCase() + propsName.substring(1);
            map[t].props[propsName] = config[key];
          }
          let styleName = key.replace(t, "");
          if (position.includes(styleName)) {
            map[t].style[styleName.toLowerCase()] = config[t + styleName];
          }
        }
      }
      if (config.sorterVisible) {
        result.push(map["sorter"]);
      }
      if (config.caliberVisible) {
        map["caliber"].style.width = "auto";
        result.push(map["caliber"]);
      }
      if (
        config.tabsVisible &&
        config.tabsDefine &&
        config.tabsDefine.length > 0
      ) {
        let btnDefine = map["btn"];
        for (const model of config.tabsDefine) {
          let sourceModel = JSON.parse(
            JSON.stringify(btnDefine || { props: {} })
          );
          sourceModel.style = Object.assign(
            sourceModel.style || {},
            model.style
          );
          sourceModel.props["text"] = model.text;
          if (
            theme &&
            !config.btnActiveImage &&
            !config.btnImage &&
            config.tabsType != "text"
          ) {
            sourceModel.props[
              "activeImage"
            ] = `/v1/public/theme/${theme}/${theme}_tab_click.png`;
            sourceModel.props[
              "image"
            ] = `/v1/public/theme/${theme}/${theme}_tab_unClick.png`;
          }
          result.push(sourceModel);
        }
      }
      return result;
    },
    // 按钮分割符
    division() {
      let config = this.config;
      if (config.component !== "v2-screen-panel") return;
      let result = [];
      if (config.tabsVisible) {
        for (const model of config.tabsDefine || []) {
          if (model.showDivision) {
            result.push(model.division);
          }
        }
      }
      return result;
    },
    panelStyle() {
      let config = this.config;
      if (config && config.component === "v2-screen-panel") {
        let width = config.panelWidth,
          height = config.panelHeight;
        // if (config.panelWidthFix) {
        //   width = `calc( ${width} ${config.panelWidthFix > 0 ? "+" : "-"} ${Math.abs(config.panelWidthFix)}px )`;
        // }
        // if (config.panelHeightFix) {
        //   height = `calc( ${height} ${config.panelHeightFix > 0 ? "+" : "-"} ${Math.abs(config.panelHeightFix)}px )`;
        // }
        return {
          ...config.commonStyle,
          position: "absolute",
          height: height,
          width: width,
          left: config.commonStyle.left,
          top: config.commonStyle.top,
        };
      }
    },
    panelBgImg() {
      let t = this.panelTheme,
        s = this.config.panelSizeName,
        d = this.config.panelBgImage;
      if (d) return d;
      if (t) {
        return `/v1/public/theme/${t}/${t}_${s}_panelBg.png`;
      }
      return null;
    },
    panelContainer() {
      let config = this.config;
      if (config.component !== "v2-screen-panel") return;
      return {
        position: "absolute",
        width: config.containerWidth,
        height: config.containerHeight,
        top: config.containerTop,
        left: config.containerLeft,
      };
    },
    panelMainTitle() {
      let config = this.config;
      return {
        position: "absolute",
        top: config.mainTitleTop,
        left: config.mainTitleLeft,
        "font-size": config.mainTitleFontSize,
        color: config.mainTitleFontColor,
        "font-family": config.mainTitleFontFamily,
      };
    },
    panelSubtitle() {
      let config = this.config;
      return {
        position: "absolute",
        top: config.subtitleTop,
        left: config.subtitleLeft,
        "font-size": config.subtitleFontSize,
        color: config.subtitleFontColor,
        "font-family": config.subtitleFontFamily,
      };
    },
  },
  beforeDestroy() {
    clearInterval(this.autoPlay);
  },
  watch: {
    activeTab(v) {
      this.autoPlayIndex = v;
    },
  },
  mounted() {
    this.startTimeout();
  },
  methods: {
    startTimeout() {
      setTimeout(() => {
        this.visible = true;
        this.$nextTick(() => {
          let tabs = this.findTarget(this.$children, "v2-screen-btn");
          this.autoPlayIndex = this.activeTab;
          if (tabs && tabs.length) {
            // //自动播放
            // TODO  btn的默认激活状态应该由面板组件内部控制 而不是在渲染组件内部去计算
            let activeIndex = parseInt(this.activeTab);
            if (this.activeTab && !isNaN(activeIndex) && tabs[activeIndex]) {
              setTimeout(() => {
                tabs[activeIndex].click && tabs[activeIndex].click();
              }, 300);
            } else if (tabs[0]) {
              this.setActiveTab(tabs[0]);
            }
          }
        });
      }, 5000);
    },
    setActiveTab(tabBtn) {
      for (let tab of this.tabs) {
        tab.setActive && tab.setActive(false);
      }
      tabBtn.setActive && tabBtn.setActive(true);
      this.restartAutoPlay();
    },
    restartAutoPlay() {
      clearTimeout(this.autoPlay);

      let tabs = this.tabs;
      if (tabs && tabs.length) {
        //自动播放
        if (this.autoSwitch) {
          let intv = this.autoSwitchInterval || 5;
          this.autoPlay = setTimeout(() => {
            if (this._isDestroyed) {
              clearTimeout(this.autoPlay);
            }
            this.autoPlayIndex++;
            if (
              this.autoPlayIndex >= tabs.length ||
              isNaN(this.autoPlayIndex)
            ) {
              this.autoPlayIndex = 0;
            }
            let tab = tabs[this.autoPlayIndex];
            tab.click && tab.click();
          }, intv * 1000);
        }
      }
    },
    registTab(tabBtn) {
      this.tabs.push(tabBtn);
    },
    updateComponent(data) {
      if (!IDE) return;
      if (!IDE.$Scheduler) return;
      let { type, el, params, ids } = data;
      if (ids) {
        for (const id of ids) {
          IDE.$Scheduler.updatePollingParams(`${id}`, params);
        }
      } else {
        IDE.$Scheduler.updatePollingParams(`${this.wid}`, params);
      }
    },

    getUpdateIds(name, el) {
      let i = 0,
        res = this.findTarget(this.$children, name);
      if (res.length === 1) {
        //只有一个排序或口径组件，则更新全部组件
        return this.findTargetChilds(this.$children).map((c) => c.wid);
      } else {
        for (const child of res) {
          if (child.$el === el) {
            console.log(`当前${name}组件位置 : ${i}`);
            return this.getTagretId(i);
          }
          i++;
        }
        console.log(`无法获得${name}组件的位置`, el);
        return [];
      }
    },

    getTagretId(index) {
      const result = this.findTarget(this.$children);
      let target = result[index],
        ids = [];
      if (target) {
        if (target.componentName === "v2-switchable") {
          //得到switchable里面的数据源组件
          for (const child of this.findTarget(target.$children)) {
            ids.push(child.wid);
          }
        } else {
          ids.push(target.wid);
        }
      } else {
        console.log("找不到目标容器！！");
      }
      return ids;
    },

    findTarget(list, name) {
      let r = [];
      for (const child of list) {
        if (name && child.componentName === name) {
          r.push(child);
        } else if (
          !name &&
          (child.componentName === "v2-switchable" ||
            !!child.SCHEMA_TYPE ||
            !!child.schema_type)
        ) {
          r.push(child);
        } else if (child.$children.length > 0) {
          r = r.concat(this.findTarget(child.$children, name));
        }
      }
      return r.sort((p, n) => $(p.$el).offset().left - $(n.$el).offset().left);
    },

    findRefs(ref, ins) {
      if (ref.$children) return ref;
      let target = ins.$parent;
      while (target) {
        if (target.$refs[ref]) {
          return target.$refs[ref];
        } else {
          target = target.$parent;
        }
      }
    },

    findTargetChilds(list) {
      let r = [];
      for (const child of list) {
        if (child.SCHEMA_TYPE || child.schema_type) {
          r.push(child);
        } else if (
          child.componentName === "v2-switchable" ||
          child.$children.length > 0
        ) {
          r = r.concat(this.findTargetChilds(child.$children));
        }
      }
      return r;
    },
  },
};
</script>
