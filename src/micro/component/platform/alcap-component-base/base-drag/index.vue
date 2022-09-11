<template>
  <div class="base-drag" :id="id">
    <div
      :class="['drawer', placement, visible ? 'open' : 'close']"
      id="base-drag"
    >
      <div ref="drawer" class="content beauty-scroll">
        <div class="config-content" @mousemove="mousemove">
          <div class="w-full h-14 box-border p-3 pr-4">
            <el-input v-model="searchVal" placeholder="搜索关键字" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-collapse v-model="activeNames">
            <el-collapse-item
              :name="item.type"
              v-for="item in list"
              :key="item.type"
            >
              <template slot="title">
                <i
                  class="font-bold m-1"
                  :class="
                    activeNames.includes(item.type)
                      ? 'el-icon-arrow-down'
                      : 'el-icon-arrow-right'
                  "
                ></i>
                <span>{{ item.name }}</span>
              </template>
              <div
                class="
                  w-full
                  box-border
                  pt-4
                  pb-1
                  px-3
                  flex
                  items-center
                  justify-between
                  flex-wrap
                "
                v-if="item.components.length > 0"
              >
                <div
                  class="
                    collapse-component
                    text-center
                    mb-3
                    cursor-pointer
                    flex flex-col
                    items-center
                  "
                  v-for="(action, key) in item.components"
                  :key="key"
                  @mouseenter="mouseover(action)"
                  @mouseleave="mouseLeave(action)"
                  @drag="drag($event, action)"
                  @dragend="dragend($event, action)"
                  @click="addComp(action)"
                  draggable="true"
                >
                  <!-- fill, contain, cover, none, scale-down -->
                  <!-- <el-image
                    style="width: 112px; height: 64px"
                    class="w-28 h-16 mb-2 rounded-md"
                    :src="action.bgImg"
                    fit="cover"
                    @error="imgError(action)"
                  >
                  </el-image> -->
                  <img style="width: 112px; height: 64px"
                    class="w-28 h-16 mb-2 rounded-md" :src="action.bgImg" @error="imgError(action)"  alt="" srcset="">
                  <span class="component-name">{{ action.name  }}</span>
                </div>
              </div>
              <div class="w-full flex items-center justify-center" v-else>
                <el-empty :image-size="80" description="暂无组件"></el-empty>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div
        :class="['handler-container', placement, visible ? 'open' : 'close']"
        ref="handler"
        @click="toggle"
      >
        <div class="handler-close">
          <i
            :class="visible ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
          ></i>
        </div>

        <div
          class="absolute -right-80 rounded-md"
          :style="{ top: previewImgY + 'px' }"
          style="box-shadow: 0px 3px 10px rgba(55, 78, 113, 0.35)"
          v-show="previewImg"
        >
          <el-image class="w-80 h-48 rounded-md" :src="previewImg" fit="cover">
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };
const { getArmUnpkg } = window.getArmApi();
export default {
  name: "baseDrag",
  components: {},
  model: {
    prop: "visible",
    event: "change",
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    placement: {
      type: String,
      required: false,
      default: "left",
    },
    renderList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    layout: {
      type: Array,
      default: () => {
        return [];
      },
    },
    id: {
      type: String,
      default: "",
    },
    isSub: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showHandler: false,
      option: [],
      searchVal: "",

      activeNames: ["base"],

      componentList: {
        // base: {
        //   type: "base",
        //   name: "基础组件",
        //   components: [],
        // },
        // work: {
        //   type: "work",
        //   name: "工作台组件",
        //   components: [],
        // },
        // form: {
        //   type: "form",
        //   name: "表单组件",
        //   components: [],
        // },
        // dashboard: {
        //   type: "dashboard",
        //   name: "仪表盘组件",
        //   components: [],
        // },
        // preset: {
        //   type: "preset",
        //   name: "预设组件",
        //   components: [],
        // },
        // topo: {
        //   type: "topo",
        //   name: "3D/拓扑",
        //   components: [],
        // },
        other: {
          type: "other",
          name: "其它",
          components: [],
        },
      },
      componentImg: "",
      previewImgY: 0,

      gridlayout: {
        w: 200,
        h: 200,
        wunit: "px",
        hunit: "px",
      },

      dragAction: {},
    };
  },
  computed: {
    list() {
      const ctx = this;
      if (ctx.searchVal) {
        let searchComps = JSON.parse(JSON.stringify(ctx.componentList));
        ctx.activeNames = [];
        for (const key in ctx.componentList) {
          if (Object.hasOwnProperty.call(ctx.componentList, key)) {
            searchComps[key].components = ctx.componentList[
              key
            ].components.filter(
              (i) =>
                i.name.indexOf(ctx.searchVal) > -1 ||
                i.href.indexOf(ctx.searchVal) > -1
            );
            if (searchComps[key].components.length > 0) {
              ctx.activeNames.push(searchComps[key].type);
            }
          }
        }

        return searchComps;
      } else {
        return ctx.componentList;
      }
    },
    previewImg() {
      return this.componentImg;
    },
    componentStyle() {
      return {
        w: Math.round(this.$parent.hCal(this.componentLayout, "w")),
        h: Math.round(this.$parent.hCal(this.componentLayout, "h")),
      };
    },
    componentLayout() {
      return {
        ...this.gridlayout,
        ...this.getComponentStyle(this.dragAction.style),
      };
    },
  },
  watch: {
    visible: {
      handler(n, o) {
        if (n) {
          this.showHandler = true;
        }
      },
    },
  },
  created() {
    this.getComponentList();
    // window.addEventListener('mousemove', this.mousePosition)
  },
  mounted() {
    document.addEventListener(
      "dragover",
      function (e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false
    );
  },
  methods: {
    drag(e, action) {
      let parentRect = document
        .getElementById("pr_page_render")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
        this.mouseLeave();
      }
      this.dragAction = action;

      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: this.componentStyle.w,
          h: this.componentStyle.h,
          i: "drop",
        });
      }
      let index = this.layout.findIndex((item) => item.i === "drop");
      if (index !== -1) {
        try {
          this.$parent.$refs.gridlayout.$children[
            this.layout.length
          ].$refs.item.style.display = "none";
        } catch {}
        let el = this.$parent.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        );
        // console.log('新增元素的位置', new_pos);
        if (mouseInGrid === true) {
          this.$parent.$refs.gridlayout.dragEvent(
            "dragstart",
            "drop",
            new_pos.x,
            new_pos.y,
            this.componentStyle.h,
            this.componentStyle.w
          );
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$parent.$refs.gridlayout.dragEvent(
            "dragend",
            "drop",
            new_pos.x,
            new_pos.y,
            this.componentStyle.h,
            this.componentStyle.w
          );
          this.layout = this.layout.filter((obj) => obj.i !== "drop");
        }
      }
    },
    async dragend(e, action) {
      let parentRect = document
        .getElementById("pr_page_render")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        this.$parent.$refs.gridlayout.dragEvent(
          "dragend",
          "drop",
          DragPos.x,
          DragPos.y,
          this.componentStyle.h,
          this.componentStyle.w
        );
        this.layout = this.layout.filter((obj) => obj.i !== "drop");
        let command = {
          ...action,
          gridlayout: {
            x: DragPos.x,
            y: DragPos.y,
            h: this.componentStyle.h,
            w: this.componentStyle.w,
            i: DragPos.i,
            fullScreen: false,
          },
        };
        if (command) msgHub.$emit("addChild", command);
      }

      console.log("拖动结束", mouseInGrid, this.$parent.layout);
    },
    getComponentStyle(style) {
      let ret = {};
      if (style) {
        if (style.width && style.width.endsWith("%")) {
          ret = {
            w: style.width.replace("%", ""),
            wunit: "%",
          };
        } else if (style.width && style.width.endsWith("px")) {
          ret = {
            w: style.width.replace("px", ""),
            wunit: "px",
          };
        }
        if (style.height && style.height.endsWith("%")) {
          ret = {
            h: style.height.replace("%", ""),
            hunit: "%",
            ...ret,
          };
        } else if (style.height && style.height.endsWith("px")) {
          return {
            h: style.height.replace("px", ""),
            hunit: "px",
            ...ret,
          };
        }
      }
      return ret;
    },
    addComp(action) {
      if (action) msgHub.$emit("addChild", action);
    },
    mousemove(e) {
      this.previewImgY = e.pageY - 100;
    },
    mouseover(action) {
      this.componentImg = action.bgImg;
    },
    mouseLeave(action) {
      this.componentImg = "";
    },
    open() {
      this.$emit("change", true);
    },
    close() {
      this.$emit("change", false);
    },
    toggle() {
      this.$emit("change", !this.visible);
    },
    imgError(action) {
      // 隐藏图片
      // image.style.display = 'none';
      // 替换为默认图片
      // console.log(image);
      // image.setAttribute("src", "./img/bg_component.png")
      action.bgImg = require("./img/bg_component.png");
    },
    async getComponentList() {
      const ctx = this;
      console.log("组件列表", window.alcapCoreUtils.getV2Comps());
      const comp = window.alcapCoreUtils.getV2Comps();

      const bgImg = require.context('@/v2Components', true, /\.png$/);
      const localBgObj = {};
      bgImg.keys().map(key => {
        if (key.lastIndexOf('/') - key.indexOf('/') === key.lastIndexOf('.') - key.lastIndexOf('/')) {
          let bg = bgImg(key).default || bgImg(key)
          // console.log(key.substring(key.indexOf('/') + 1, key.lastIndexOf('/')));
          let localBgKey = key.substring(key.indexOf('/') + 1, key.lastIndexOf('/'));
          // localBg.push(bg);
          localBgObj[localBgKey] = bg;
        }
      });

      for (let index = 0; index < comp.length; index++) {
        const c = comp[index];
        const cPackage = JSON.parse(c.package);
        const _options = cPackage.docs;

        let props = [..._options.option.map((i) => i.name)];
        let propsData = {};
        _options.option.map((i) => {
          propsData[i.name] = i.defaultValue;
        });
        if (_options.type === "edit" || _options.type === "table") continue;
        if (c.menu && !ctx.componentList[c.menu.id]) {
          ctx.$set(ctx.componentList, c.menu.id, {
            type: c.menu.id,
            name: c.menu.description?.substring(0, c.menu.description.indexOf('-')) || c.menu.description,
            components: [],
          });
        }
        ctx.componentList[c.menu ? c.menu.id : "other"].components.push({
          name: _options.name,
          type: _options.type,
          href: _options.href || "",
          component: _options.href || "",
          packageName: c.name,
          props,
          // option: [..._options.option],
          ...propsData,
          __editor: [],
          schemaType: _options.schemaType || "",
          accept: _options.accept || [],
          style: _options.style || null,
          version: c.version,
          children: _options.children || [],
          // defaultComponents: _options.defaultComponents || [],
          bgImg: await ctx.getComponentBg(c, _options, localBgObj)
          // bgImg: `${getArmUnpkg()}/${c.name}@${c.version}/${
          //     _options.href || ""
          //   }.png` || "./img/bg_component.png",
        });
      }

      console.log("最后的组件列表", ctx.componentList);
    },
    async getComponentBg(c, _options, localBgObj) {
      if (c.localPath) {
        if (localBgObj[_options.href]) {
          return localBgObj[_options.href];
        }else {
          return ''
        }
      }else {
        try {
          let src = await this.imgPromise(`${getArmUnpkg()}/${c.name}@${c.version}/${_options.href || ""}.png`);
          console.log('加载图片', src);
          return src
        } catch (error) {
          return ''
        }
      }
    },
    imgPromise(src) {
      return new Promise(resolve=> {
         let ImgObj = new Image()
        ImgObj.src = src
        ImgObj.onload = function(res) {
          resolve(src)
        }
        ImgObj.onerror = function(err) {
          resolve('')
        }   
      })
     
    }
  },
};
</script>
<style lang="less" scoped>
.base-drag {
  position: absolute;
  top: 0;
  .drawer {
    position: fixed;
    transition: all 0.5s;
    height: 93%;
    z-index: 800;
    .config-content {
      width: 260px;
      height: 100%;
      background: #fff;
      opacity: 1;
      // border-radius: 6px;
      overflow-y: scroll;
      box-sizing: border-box;
      ::v-deep .el-input__inner {
        width: 232px;
        height: 28px;
        border: 1px solid #c8d0d4;
        opacity: 1;
        border-radius: 222px;
        font-size: 12px;
        &::placeholder {
          color: #c0c4cc;
        }
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 21px;
        opacity: 1;
      }
      ::v-deep .el-input__prefix {
        top: -5px;
      }
      ::v-deep .el-input__suffix {
        top: -5px;
      }
      &::-webkit-scrollbar {
        display: none;
      }
      .collapse-component {
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 20px;
        color: #3c4555;
      }

      ::v-deep .el-collapse {
        .el-collapse-item {
        }
      }
      ::v-deep .el-collapse-item__header {
        height: 30px;
        background: #f0f4f7;
        font-size: 13px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 23px;
        color: #7f8c93;
        .el-collapse-item__arrow {
          display: none;
        }
      }
      ::v-deep .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    &.left {
      left: 0px;
      &.open {
        .content {
          // box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
          border-top: 1px solid #e7ecef;
          border-right: 1px solid #e7ecef;
        }
      }
      &.close {
        transform: translateX(-100%);
      }
    }
  }
  .content {
    display: inline-block;
    height: 100%;
    overflow-y: auto;
  }
  .handler-container {
    position: absolute;
    display: inline-block;
    text-align: center;
    transition: all 0.5s;
    cursor: pointer;
    top: 14px;
    z-index: 800;
    .handler-close {
      font-size: 14px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: inherit;
      color: #9db3be;
      width: 24px;
      height: 24px;
      background: #fff;
      box-shadow: 0px 3px 6px rgba(55, 78, 113, 0.2);
      border-radius: 50%;
      opacity: 1;
    }
    &.left {
      right: -15px;
      .handler-close {
      }
    }
    &.right {
      left: -40px;
      .handler-close {
      }
    }
  }
  .sub-title {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    line-height: 27px;
    color: #333333;
  }

  ::v-deep.el-divider--horizontal {
    margin: 10px 0;
  }
}
</style>
