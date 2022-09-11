<script>
import screenPage from "../screenPage.vue";
import gridToolbar from "./pcToolbar.vue";
// import baseConfig from "../../../components/base/base-config.vue";
import pcScreenPanel from "./pcScreenPanel.vue";
export default {
  extends: screenPage,
  components: {
    "grid-toolbar": gridToolbar,
    // "base-config": baseConfig,
    "pc-screen-panel": pcScreenPanel,
  },
  props: {
    mode: {
      type: Boolean,
      default() {
        return false;
      },
    },
    pHeight: {
      type: String,
      default() {
        return "600";
      },
    },
    pWidth: {
      type: String,
      default() {
        return "800";
      },
    },
  },
  data() {
    return {
      layout: [],
      mobilelayout: [],
      wMargin: 0,
      hMargin: 0,
      editorConfig: {},
      showEdit: false,
      showDrag: false,
      gridlayout: {
        w: 200,
        h: 200,
        wunit: "px",
        hunit: "px",
      },
      rowHeight: 1,
      pcColNum: 100,
      mColNum: 1,

      isHide: [],
      hideComponent: [],
      showList: []
    };
  },
  watch: {
    isHide: {
      handler(n, o) {
        this.hideComponent = n.filter(i=>i.isHide);
        this.relocal();
      },
      deep: true
    },
    // "editorConfig.model._gridlayout": {
    //   deep: true,
    //   handler(nv) {
    //     if (nv) {
    //       //计算出gridlayout 比例
    //       let data = this.calcSize(nv);
    //       let gridlayout = this.editorConfig.model.gridlayout;
    //       if (
    //         data.w !== gridlayout.w ||
    //         data.h !== gridlayout.h ||
    //         data.wunit !== gridlayout.wunit ||
    //         data.hunit !== gridlayout.hunit
    //       ) {
    //         // this.editorConfig.model.gridlayout = ;
    //         for (let j = -1, item; (item = this.componentList[++j]); ) {
    //           if (item.wid === this.editorConfig.model.wid) {
    //             item.gridlayout = { i: gridlayout.i, ...data };
    //             // this.layout.splice(gridlayout.i,0,item.gridlayout)
    //             this.relocal();
    //             break;
    //           }
    //         }
    //       }
    //     }
    //     // // debugger;
    //     // debugger;
    //     // coso
    //   },
    // },
    
  },
  computed: {
    colNum() {
      return this.mode ? this.mColNum : this.pcColNum;
    },
    colWidth() {
      // console.log(
      //   "colWidth",
      //   (this.pWidth - this.wMargin * (this.colNum + 1)) / this.colNum
      // );
      return (this.pWidth - this.wMargin * (this.colNum + 1)) / this.colNum;
    },
    // getGridLayoutWidth() {
    //   return this.editable && this.showEdit ? "calc(100% - 366px)" : "100%";
    // },
    layoutWidth() {
      if (this.showDrag && this.showEdit) {
        return "calc( 100% - 260px - 317px )";
      } else if (this.showDrag && !this.showEdit) {
        return "calc( 100% - 260px )";
      } else if (!this.showDrag && this.showEdit) {
        return "calc( 100% - 317px )";
      } else {
        return "100%";
      }
    },
  },
  created() {
    msgHub.$on("addChild", async (item, type) => {
      console.log("添加", item, this.layout);
      this.layout = this.layout.filter((obj) => obj.i !== "drop");
      let data = this.buildModel(item);

      // 检测组件是否有效
      // if (data.defaultComponents) {
      //   arr = [ data.href, ...data.defaultComponents ];
      // }
      let forArr = await this.addChildJudge(data);
      console.log('拖拽组件执行完了', forArr);
      if (!forArr) return;

      let _layout = this.componentList.map((item) => {
        return item.gridlayout;
      });
      let x = 0;
      let y = this.bottom(_layout);

      let layout = {
        ...this.gridlayout,
        ...this.getComponentStyle(data.style),
      };

      let w = Math.round(this.hCal(layout, "w"));

      let h = Math.round(this.hCal(layout, "h"));

      // this.$set(childConfig, "gridlayout", {
      //   ...this.calcSize(layout),
      //   i: index + 1,
      // });
      let fullScreen = this.getFullScreen(w, h);

      data.gridlayout = item.gridlayout
        ? item.gridlayout
        : {
            i: this.componentList.length,
            x,
            y,
            w,
            h,
            fullScreen,
          };
      this.componentList.push(data);
      this.layout.push(data.gridlayout);
      this.mobilelayout.push(data.gridlayout);
      console.log("布局", this.layout);
      // this.relocal();
      // let page = this.$el.getElementsByClassName("screenPage")[0];
      // this.$nextTick(() => {
      //   page.scrollTop = page.clientHeight;
      //   page = null;
      // });
    });
    this.$on("setEditable", (item) => {
      // console.log("可编辑性", item);
      this.editable = item;
    });
    //TODO 测试代码
    window.pcScreenPage = this;
  },
  destroyed() {
    msgHub.$off("addChild");
  },
  render(h) {
    let self = this;
    // console.log("render");

    // debugger;
    let children = this.componentList.map((childConfig, index) => {
      // if (!childConfig._gridlayout) {
      //   self.decompileToPx(childConfig);
      // }
      if (childConfig) {
        
      }

      let render = this.renderPanel1(h, childConfig, index);

      return render;
    });

    children = children.filter(i=>i);

    this.hMargin =  0;
    this.wMargin = this.root.pageCss?.component?.padding || 0;

    // 弹窗层
    // children = children.concat(this.renderDialog(h));
    let gridlayout = h(
      "grid-layout",
      {
        class: ["screenPage"],
        ref: "gridlayout",
        props: {
          wid: "root",
          layout: this.mode ? this.mobilelayout : this.layout,
          "col-num": this.colNum,
          "is-draggable": this.editable,
          "is-resizable": this.editable,
          "vertical-compact": true,
          margin: [this.wMargin, this.hMargin],
          "use-css-transforms": this.editable,
          rowHeight: this.rowHeight,
          // colWidth: this.colWidth,
        },
        on: {
          "layout-updated": function (newLayout) {
            // console.log("Updated layout: ", newLayout);
          },
        },
      },
      children
    );

    let pageChildren = [gridlayout];
    // debugger;
    if (this.editable) {
      pageChildren.push(
        h("base-config", {
          props: {
            obj: self.editorConfig,
            visible: self.showEdit,
          },
          on: {
            showEdit(v) {
              self.showEdit = v;
            },
            change(e) {
              self.showEdit = e;
            },
          },
        })
      );
      pageChildren.push(
        h("base-drag", {
          props: {
            obj: self.editorConfig,
            visible: self.showDrag,
            renderList: self.componentList,
            layout: self.layout,
          },
          on: {
            showEdit(v) {
              self.showDrag = v;
            },
            change(e) {
              self.showDrag = e;
            },
          },
        })
      );
    } else {
      this.showEdit = false;
      this.showDrag = false;
    }
    return h(
      "div",
      {
        style: {
          width: self.layoutWidth,
          marginLeft: self.showDrag ? "260px" : "0",
          marginRight: self.showEdit ? "317px" : "0",
          // height: "100%",
          position: "relative",
        },
      },
      pageChildren
    );
  },
  methods: {
    getFullScreen(w, h) {
      let fullScreen = false;
      if (
        w === Math.round(this.pWidth / this.colWidth) &&
        h === Math.round(this.pHeight / this.rowHeight)
      ) {
        fullScreen = true;
      }
      return fullScreen;
    },
    bottom(layout) {
      let max = 0,
        bottomY;
      for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) max = bottomY;
      }
      return max;
    },
    decompileToPx(childConfig) {
      let ret = {};
      if (childConfig && childConfig.gridlayout) {
        let layout = childConfig.gridlayout;
        let x = Math.round((layout.x * this.colWidth) / this.pWidth); //转成%
        let w = Math.round((layout.w * this.colWidth) / this.pWidth); //转成%

        let y = Math.round(layout.y * this.rowHeight);
        let h = Math.round(layout.h * this.rowHeight);
        // let wunit = layout.wunit || "px";
        // let hunit = layout.hunit || "px";

        // if (wunit === "%") {
        //   w = Math.round((w / this.pWidth) * 100);
        // }
        // if (hunit === "%") {
        //   h = Math.round((h / this.pHeight) * 100);
        // }
        if (layout.fullScreen) {
          //全屏
          w = Math.round(this.pWidth / 100);
          h = Math.round(this.pHeight / 100);
        }

        ret = {
          x,
          y,
          w,
          h,
          fullScreen: layout.fullScreen,
        };
      }
      this.$set(childConfig, "_gridlayout", ret);
    },
    getComponentStyle(style) {
      // let cs = component.split("-");
      // let arr = [];
      // cs.forEach((item, idx) => {
      //   let s = item;

      //   if (idx !== 0) {
      //     s = item.charAt(0).toUpperCase() + item.slice(1);
      //   }
      //   arr.push(s);
      // });
      // component = arr.join("");
      let ret = {};
      // let components = Vue.options.components;
      // if (components[component]) {
      //   let _options = components[component].extendOptions._options;
      //   let style = _options.style;
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
      // }
      return ret;
    },
    /**
     * 根据配置构建模型
     */
    buildModel(config) {
      console.log("模型", config);
      let model = JSON.parse(JSON.stringify(config));
      //生成WID
      model.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      return model;
    },
    /**
     * 从props中抽取数据
     */
    handleItemProps(item, props) {
      let self = this;
      for (let key of item.props) {
        if (item[key]) {
          props[key] = item[key];
        } else if (key !== undefined) {
          let v;
          if ((v = self.dataDistributor[item.wid + "-" + key])) {
            props[key] = v;
          }
        }
      }
    },
    handleRootProps(childConfig, rprops, index) {
      let self = this;

      if (childConfig.dataBasket) {
        for (const key in childConfig.dataBasket) {
          rprops[key] = self.identifyObject(childConfig.dataBasket[key]);
        }
      }
      if (childConfig.props) {
        for (let k of childConfig.props) {
          rprops[k] = childConfig[k];
          if (childConfig.dataBasket && childConfig.dataBasket[k])
            rprops[k] = childConfig.dataBasket[k];
          if (this[k] != undefined) rprops[k] = this[k];
          if (this.dataDistributor[k] != undefined)
            rprops[k] = this.dataDistributor[k];
        }
      }
      if (childConfig.__sourceList) {
        for (let sourceKey in childConfig.__sourceList) {
          rprops[sourceKey] =
            self.dataDistributor[childConfig.id + "_" + sourceKey];
        }
      }
    },
    getPanelSize() {
      return this.getWindowSize();
    },
    //
    calHideToShowY(arr, componentList) {
      arr.forEach(com => {
        let hideComp = componentList.find(i=>i.wid === com.wid);
        if(!hideComp) return
        // console.log('隐藏的组件要加入了', hideComp.name, hideComp.gridlayout.y, hideComp.wid, this.layout);
        let sameY = this.layout.filter(i=>(i.i !== hideComp.wid && i.y === hideComp.gridlayout.y));
        let totalW = hideComp.gridlayout.w
        sameY.map(s=> {
          totalW += s.w
        })
        // console.log('我的位置被占据了', sameY, totalW);
        if(totalW > 100) {
          this.layout.forEach(lay=> {
            if (lay.y === hideComp.gridlayout.y) {
              lay.y = hideComp.gridlayout.y + hideComp.gridlayout.h
            }
          });
          // console.log('修改后的布局', this.layout);
        }
      });
    },
    /**
     * 抽取配置信息，添加gridlayout定位。
     * 对所有元素重新定位
     */
    relocal() {
      // this.layout = [];
      // this.layout = [];
      // let { width, height } = this.getPanelSize();
      // // let defWidth = this.pageDef.display.width;
      // // let defHeight = this.pageDef.display.height;
      // let defWidth = this.pHeight;
      // let defHeight = this.pWidth;
      // debugger;
      let layout = [];
      let mobilelayout = [];
      // this.currentComponentsHeight = 0;
      // this.currentMobCptHeight = 0;

      let componentList = [ ...this.componentList ]
      // let showList = this.componentList.map(i=>i);
      if (!this.editable) {
        this.hideComponent.forEach(com => {
          let hideIndex = componentList.findIndex(i=>i.wid === com.wid);
          // console.log('需要隐藏的组件', com.name, com.gridlayout, com.wid);
          // console.log('componentList.find(i=>i.wid === com.wid)', componentList.find(i=>i.wid === com.wid).wid);
          componentList.splice(hideIndex, 1);
        });
        let isOpenArr = this.componentList.filter(i=>i.generalComponentShow?.isOpen) || [];
        this.calHideToShowY(isOpenArr, componentList);
      }else {
        this.calHideToShowY(this.hideComponent, componentList);
      }

      componentList.forEach((childConfig, index) => {
        // childConfig = JSON.parse(JSON.stringify(childConfig));
        if (!childConfig.wid) {
          //重构wid
          childConfig.wid =
            new Date().valueOf() + ((Math.random() * 100000) | 0);
        }
        let gridlayout = this.calcSize(childConfig.gridlayout);
        gridlayout.i = childConfig.wid;
        // console.log(childConfig.component)
        childConfig.mobilelayout = childConfig.gridlayout = {
          ...childConfig.gridlayout,
          ...gridlayout,
        };
        // self.resetLayoutData(childConfig, index);
        layout.push(childConfig.gridlayout);
        mobilelayout.push(childConfig.mobilelayout);
      });
      this.layout = [...layout];
      this.mobilelayout = [...mobilelayout];
    },

    /**
     * 重写函数，避免自动缩放
     */
    trigerAutoScale() {},
    /**
     * 重设元素的gridlayout
     */
    resetLayoutData(childConfig, index) {
      // console.log(1)
      if (!childConfig.mobilelayout) {
        childConfig.mobilelayout = {
          x: 0,
          y: this.currentComponentsHeight,
          h: 4,
          w: 24,
          i: index,
        };
        let y = childConfig.mobilelayout.y;
        let h = childConfig.mobilelayout.h;
        this.currentMobCptHeight =
          y + h > this.currentMobCptHeight ? y + h : this.currentMobCptHeight;
      }
      if (!childConfig.gridlayout) {
        // let style = childConfig.commonStyle;
        let x = 0,
          y = this.currentComponentsHeight;
        // w = this.gridlayout.w,
        // h = this.gridlayout.h;
        // const hCal = (style, key) => {
        //   let x = 0;
        //   if (style[key]) {
        //     if (typeof style[key] == "number") {
        //       x = Math.round((style[key] / parseInt(defWidth)) * 100);
        //     } else if (typeof style[key] == "string") {
        //       if (style[key].endsWith("px")) {
        //         x = Math.round(
        //           (parseInt(style[key]) / parseInt(defWidth)) * 100
        //         );
        //       } else if (style[key].endsWith("%")) {
        //         x = parseInt(style[key]);
        //       }
        //     }
        //   }
        //   return x;
        // };
        // if (style && style.left) {
        //   x = hCal(style && style, "left");
        // }
        // if (childConfig.panelWidth) {
        //   w = hCal(childConfig, "panelWidth");
        // } else if (style && style.width) {
        //   w = hCal(style, "width");
        // } else if (childConfig.width) {
        //   w = hCal(childConfig, "width");
        // }

        // const vCal = (style, key) => {
        //   let y = 0;
        //   if (style[key]) {
        //     if (typeof style[key] == "number") {
        //       y = Math.round(style[key] / rowHeight);
        //     } else if (typeof style[key] == "string") {
        //       if (style[key].endsWith("px")) {
        //         y = Math.round(parseInt(style[key]) / rowHeight);
        //       } else if (style[key].endsWith("%")) {
        //         y = Math.round(
        //           (parseInt(style[key]) * parseInt(defHeight)) / 100 / rowHeight
        //         );
        //       }
        //     }
        //   }
        //   return y;
        // };
        // if (style && style.top) {
        //   y = vCal(style, "top");
        // }
        // if (childConfig.panelHeight) {
        //   h = vCal(childConfig, "panelHeight");
        // } else if (style && style.height) {
        //   h = vCal(style, "height");
        // } else if (childConfig.height) {
        //   h = vCal(childConfig, "height");
        // }
        // this.calcSize(childConfig);
        // this.$set(childConfig, "_gridlayout", {});
        let layout = {
          ...this.gridlayout,
          ...this.getComponentStyle(childConfig.component),
        };

        // this.$set(childConfig, "gridlayout", {
        //   ...this.calcSize(layout),
        //   i: index + 1,
        // });

        childConfig.gridlayout = {
          x,
          y,
          i: index + 1,
        };
        // childConfig.gridlayout = this.calcSize(layout);
        // childConfig.gridlayout.i = index + 1;

        this.currentComponentsHeight =
          y + layout.h > this.currentComponentsHeight
            ? y + layout.h
            : this.currentComponentsHeight;

        // childConfig.gridlayout = {
        //   x,
        //   y,
        //   w,
        //   h,
        //   i: index,
        // };
        // childConfig._gridlayout = {
        //   w,
        //   h,
        //   wunit: this.gridlayout.wunit,
        //   hunit: this.gridlayout.wunit,
        // };
        // console.log(childConfig.component, childConfig.gridlayout);
      } else {
        //该算法用于保证新元素出现在底部
        let layout = this.calcSize(childConfig._gridlayout);
        // console.log(childConfig.component)
        childConfig.gridlayout = { ...childConfig.gridlayout, ...layout };
        let currentBottom =
          childConfig._gridlayout.h + (childConfig._gridlayout.y || 0);
        this.currentComponentsHeight =
          currentBottom > this.currentComponentsHeight
            ? currentBottom
            : this.currentComponentsHeight;
      }
      // console.log("currentComponentsHeight", this.currentComponentsHeight);
    },
    getPanelComponentName() {
      return "pc-screen-panel";
    },
    setComponentStyle(childConfig) {
      // console.log("setComponentStyle");
      const commonStyle = childConfig.commonStyle;
      return {
        ...commonStyle,
        top: childConfig.containerLeft || "0",
        left: childConfig.containerLeft || "0",
        // width: commonStyle.width || "0",
        // height: commonStyle.height || "0",
        width: "100%",
        height: "100%",
        position: "relative",
      };
    },

    hCal(style, key) {
      let kMap = {
        w: "pWidth",
        h: "pHeight",
      };
      let colWidth = this.colWidth;
      if (style[key + "unit"] === "%") {
        //% 先转成px  再转成gridlyaout比例
        let pxW = this[kMap[key]] * (style[key] / 100);
        if (key === "w") {
          return pxW / colWidth;
        } else {
          return pxW;
        }
      } else {
        if (key === "w") {
          return style[key] / colWidth;
        } else {
          return style[key];
        }
      }
    },
    //单位转化成gridlayout 比例
    calcSize(gridlayout) {
      gridlayout = JSON.parse(JSON.stringify(gridlayout));

      // let w = Math.round(this.hCal(gridlayout, "w"));
      // let x = Math.round((gridlayout.x || 0) / this.colWidth);

      // let h = Math.round(this.hCal(gridlayout, "h"));
      // let y = Math.round((gridlayout.y || 0) / this.rowHeight);
      // let wunit = gridlayout.wunit;
      // let hunit = gridlayout.hunit;

      //w x都是%

      if (gridlayout.fullScreen) {
        gridlayout.w = Math.round(this.pWidth / (this.colWidth + this.wMargin));
        gridlayout.h = Math.round(this.pHeight / (this.rowHeight + this.hMargin));
      }

      //  console.log('全屏的宽高', gridlayout.h,this.pHeight, this.rowHeight, gridlayout);

      // w = this.w > this.colNum ? this.colNum : w;

      // if (x + w > this.colNum) {
      //   // debugger;
      //   if (wunit === "px") {
      //     w = this.colNum - x;
      //   } else {
      //     x = this.colNum - w;
      //   }

      //   // w = w - 1;
      // }

      // if(w===0) w=2;

      return gridlayout;
    },
    renderPanel1(h, childConfig, index) {
      // let time = new Date().getTime();

      let r = this.renderPanel(h, childConfig, index);
      let children = [r];
      let self = this;
      if (this.editable) {
        self.$set(self.componentList[index], 'isSelected', false);
        children.push(
          h("grid-toolbar", {
            props: {
              componentList: self.componentList,
              index
            },
            on: {
              remove() {
                if (
                  self.editorConfig.hasOwnProperty("model") &&
                  self.componentList[index].wid === self.editorConfig.model.wid
                ) {
                  self.showEdit = false;
                }
                self.delEntityInPageContent(self.componentList[index].wid);
                self.delPageInPageContent(self.componentList[index].wid);
                self.delResourceInPageContent(self.componentList[index].wid);
                self.componentList.splice(index, 1);
                self.relocal();
              },
              edit() {
                console.log("childConfig", childConfig);
                if (childConfig.__editor) {
                  // self.editorConfig = {
                  //   model: childConfig,
                  //   config: childConfig.__editor,
                  // };
                  self.$set(self.editorConfig, "model", childConfig);
                  self.showEdit = true;
                }
              },
              fullScreen() {
                // childConfig.gridlayout.w = self.pWidth / self.colWidth;
                // childConfig.gridlayout.h = self.pHeight / self.rowHeight;
                childConfig.gridlayout.fullScreen = true;
                self.relocal();
              },
            },
          })
        );
      } else {
        childConfig.isEditable = false;
      }
      // this.calcSize(childConfig);
      let myprops = this.mode
        ? childConfig.mobilelayout
        : childConfig.gridlayout;
      
      let isHide = false;
      const generalComponentShow = childConfig.generalComponentShow;
      const ctx = this;
      if (generalComponentShow?.isOpen) {
        isHide = true;
        let p = generalComponentShow.arg.substring(0, generalComponentShow.arg.indexOf("."));
        let c = generalComponentShow.arg.substring(generalComponentShow.arg.indexOf(".") + 1);
        if (generalComponentShow.showType !== '==' && !isNaN(ctx.root.args[p][c])) {
          isHide = !eval(`Number(ctx.root.args[p][c]) ${generalComponentShow.showType} Number(generalComponentShow.showValue)`);
        }else {
          isHide = !eval(`ctx.root.args[p][c] ${generalComponentShow.showType} generalComponentShow.showValue`)
        }
      }
      if (typeof(index) === 'number') {
        
        if (index < this.componentList.length) {
          if(!this.isHide[index]) {
            this.isHide.push({ ...childConfig, isHide });
          }else {
            this.isHide[index].isHide = isHide;
          } 
        }
      }

      if (isHide && !this.editable) return false

      const padding = this.root.pageCss?.component?.padding || 5;

      return h(
        "grid-item",
        {
          props: {
            ...myprops,
            wid: childConfig.wid
          },
          style: {
            // overflow: "hidden",
            // padding: 0,
          },
          // directives: [
          //   {
          //     name: 'show',
          //     value: (!isHide && !this.editable) || this.editable
          //   }
          // ],
          on: {
            moveEvent: function (i, newX, newY) {
              console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);

              // self.componentList.map((item) => {
              //   self.decompileTo(item);
              // });
            },
            resized: function (i, newH, newW, newHPx, newWPx) {
              // childConfig.gridlayout.isFull = false;
              // self.componentList.map((item) => {
              //   self.decompileToPx(item);
              // });
              // debugger;
              childConfig.gridlayout.fullScreen = self.getFullScreen(
                newW,
                newH
              );
            },

            "container-resized": function (i, newH, newW, newHPx, newWPx) {
              // console.log(
              //   "CONTAINER RESIZED i=" +
              //     i +
              //     ", H=" +
              //     newH +
              //     ", W=" +
              //     newW +
              //     ", H(px)=" +
              //     newHPx +
              //     ", W(px)=" +
              //     newWPx
            }
          },
        },
        children
      );
    },
  },
};
</script>
