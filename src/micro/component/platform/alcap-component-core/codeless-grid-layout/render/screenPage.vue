<script>
//TODO 测试数据
// import testConfig from "./testConfig.json";
import defaultPageDef from "./defaultPageDef";
const { getSource } = window.alcapCoreUtils;
export default {
  mixins: [ window.codelessMixins.vRegister, window.codelessMixins.entityAuthorities, window.codelessMixins.pageList, window.codelessMixins.resourceList ],
  components: {},
  //screen-panel应当是从属于整个页面的一部分，能用到页面本身的data和computed，所以应该直接渲染在Page中
  render(h) {
    let children = this.componentList.map((childConfig, index) => {
      return this.renderPanel(h, childConfig, index);
    });
    /*---------测试移动端------------*/
    // return h(
    //   "div",
    //   {
    //     style:{
    //       width:'375px',
    //       height:'812px',
    //       position:'absolute',
    //       border:'1px solid darkblue',
    //       left:'20%',
    //       height:'20%'
    //     }
    //   },
    //    mobRender.render.call(this, children)
    // )
    /*---------------------*/

    // 弹窗层
    children = children.concat(this.renderDialog(h));
    return h(
      "div",
      {
        class: ["screenPage"],
        style: this.wrapper,
        props: {
          wid: "root",
        },
      },
      children
    );
  },
  destroyed() {
    this.deleteAutoScale();
    this.dataDistributor && this.dataDistributor.$destroy();
    if (!IDE) return;
    IDE.$Scheduler && IDE.$Scheduler.remove(this);
  },

  created() {
    console.log("screenPage MyType", window.MyType);
    if (JSON.stringify(this.pageDef) === "{}") {
      this.$set(this.pageDef, "structure", defaultPageDef.def.structure);
      // this.$set(this.pageDef, "dataBasket", defaultPageDef.def.dataBasket);
      this.$set(this.pageDef, "display", defaultPageDef.def.display);
    }
    console.log("this.pageDef", this.pageDef);
    IDE && IDE.$Scheduler.pause();
    // window.testPage=this;
    //初始化数据篮子到data中
    // let list = this.pageDef?.dataBasket?.list || {};
    let computed = {};
    let data = {};
    let watch = {};

    let self = this;

    // for (let item of list) {
    //   if (item.type == "computed") {
    //     computed[item.name] = new Function(item.code);
    //   } else if (item.type == "data") {
    //     data[item.name] = new Function("return " + item.code)();
    //   }
    // }

    for (let panel of this.componentList) {
      this.awaitRenderList.push(false);
      this.setUpScheduler(panel, data, panel.id);
      //独立的没有包裹在panel下的数据源组件
      // if (panel.__sourceList) {
      //   for (let sourceKey in panel.__sourceList) {
      //     if (panel.__sourceList[sourceKey].api) {
      //       let newKey = panel.id + "_" + sourceKey;
      //       data[newKey] = {};
      //       IDE.$Scheduler.get(this).createPolling(
      //         `${panel.id}_`,
      //         newKey, //绑定值
      //         panel.__sourceList[sourceKey].api, //apiName
      //         panel.__sourceList[sourceKey].timeOut, //计时配置对象
      //         {
      //           format: panel.__sourceList[sourceKey].format_list,
      //           schemaType: panel.dataBasket && panel.dataBasket.schema_type,
      //         }
      //       );
      //     }
      //   }
      // }
      // for (let child of panel.children) {
      //   if (child.__sourceList) {
      //     for (let sourceKey in child.__sourceList) {
      //       if (child.__sourceList[sourceKey].api) {
      //         let newKey = child.id + "_" + sourceKey;
      //         data[newKey] = {};
      //         IDE.$Scheduler.get(this).createPolling(
      //           `${panel.id}_${child.id}`, //组件id
      //           newKey, //绑定值
      //           child.__sourceList[sourceKey].api, //apiName
      //           child.__sourceList[sourceKey].timeOut, //计时配置对象
      //           {
      //             format: child.__sourceList[sourceKey].format_list,
      //             schemaType: child.dataBasket && child.dataBasket.schema_type,
      //           }
      //         );
      //       }
      //     }
      //   }
      // }
    }

    for (let d in data) {
      watch[d] = () => {
        self.$forceUpdate();
      };
    }
    data.screenExtensionParams = {};
    //读取def的扩展字段
    if (this.pageDef.__screenParams) {
      for (const key in this.pageDef.__screenParams) {
        data[key] = this.pageDef.__screenParams[key];
      }
      // data.__screenParams = this.pageDef.__screenParams;
      // data.$screenParams = this.pageDef.__screenParams;
      data.screenExtensionParams = this.pageDef.__screenParams;
    }
    let Distributor = Vue.extend({
      computed,
      data() {
        return data;
      },
      watch,
    });
    this.dataDistributor = new Distributor();

    // let queue = [];
    // let next = async function() {
    //   let n = queue.shift();
    //   n && (await n());
    // };

    // let activator = IDE && IDE.activator;
    // let sourcesExt = (activator && activator.get("preview.sources")) || {};

    // let previewExt = (activator && activator.get("preview.extension")) || {};

    // let extension = Object.values(sourcesExt);
    // extension = [...extension, ...Object.values(previewExt)];
    // console.log(extension);
    // if (extension) {
    //   for (let ext of extension) {
    //     if (typeof ext === "function") {
    //       queue.push(async function() {
    //         await ext(window, next);
    //       });
    //     }
    //   }
    // }
    // next();
  },
  mounted() {
    setTimeout(() => {
      this.stepRender();
    }, 1000);
    this.trigerAutoScale();
  },
  data() {
    return {
      dataDistributor: {},
      awaitRenderList: [],
      dialogStack: [], // 存放弹窗实例  目前限制只存在一个
      //TODO 测试
      // pageDef: testConfig,
    };
  },
  props: {
    //TODO 测试
    pageDef: {
      type: Object,
      default: () => {
        return {
          ...defaultPageDef.def,
        };
      },
    },
    editable: {
      type: Boolean,
      default: false,
    },
    // 是否为可见页面
    isActivePage: {
      type: Boolean,
      default: false,
    },
    isDiaPage: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // bgImg() {
    //   return this.pageDef.display["background-image"];
    // },
    // panelTheme() {
    //   return this.pageDef.display["panelTheme"];
    // },
    isMobile() {
      let windowSize = this.getWindowSize();
      if (windowSize.width < 600) {
        return true;
      }
      return false;
    },
    wrapper() {
      if (this.isMobile) {
        return {
          width: "100%",
          height: "100%",
          overflow: "auto",
        };
      }
      const commonStyle = this.pageDef.structure.commonStyle;
      // let bgImg = "";
      // if (commonStyle["background-image"]) {
      //   if (commonStyle["background-image"].indexOf("aweb-api/") === -1) {
      //     bgImg = commonStyle["background-image"].replace(
      //       "url(",
      //       "url(/v1/public"
      //     );
      //   } else {
      //     bgImg = commonStyle["background-image"];
      //   }
      // }
      let pageDisplay = this.pageDef && this.pageDef.display;
      return {
        ...commonStyle,
        width: pageDisplay.width || "1920px",
        height: pageDisplay.height || "1080px",
        // "background-image": bgImg,
      };
    },
    componentList() {
      return this.pageDef.structure.children;
    },
  },
  watch: {
    'pageDef.structure.children': {
      deep: true,
      immediate: true,
      handler(n) {
        if (n && n.length > 0) {
          this.getSourceForArr(n);
        }
      }
    },
    // 'pageDef.componentList': {
    //   handler(n, o) {
    //     if (JSON.stringify(n) !== JSON.stringify(o) && n.length > 0) {
    //       this.getSourceForArr(n);
    //     }
    //     // console.log('最后的组件列表长度', n);
    //   },
    //   immediate: true,
    //   deep: true
    // },
    isActivePage() {
      // 针对下钻的页面做轮询的暂停和恢复
      if (this.isDiaPage && IDE && IDE.$Scheduler) {
        if (this.isActivePage) {
          IDE.$Scheduler.runPageJob(this);
        } else {
          // 页面不可见且是下钻页面 暂停该页的请求
          IDE.$Scheduler.pausePageJob(this);
        }
      }
    },
    "pageDef.__screenParams": {
      deep: true,
      handler() {
        const self = this;
        // 下钻参数有变化的时候应当也更新 dataDistributor 的值
        if (self.pageDef.__screenParams) {
          if (self.dataDistributor.screenExtensionParams) {
            let data = self.pageDef.__screenParams;
            Object.keys(data).forEach((key) => {
              self.dataDistributor.$set(self.dataDistributor, key, data[key]);
              self.dataDistributor.$set(
                self.dataDistributor.screenExtensionParams,
                key,
                data[key]
              );
            });
          }
        }
      },
    },
  },
  methods: {
    handleRootProps(childConfig, rprops, index) {
      let self = this;
      if (childConfig.dataBasket) {
        for (const key in childConfig.dataBasket) {
          rprops[key] = self.identifyObject(childConfig.dataBasket[key]);
        }
      }
      if (childConfig.props)
        for (let k of childConfig.props) {
          if (childConfig.dataBasket && childConfig.dataBasket[k])
            rprops[k] = childConfig.dataBasket[k];
          if (this[k] != undefined) rprops[k] = this[k];
          if (this.dataDistributor[k] != undefined)
            rprops[k] = this.dataDistributor[k];
        }
      if (childConfig.__sourceList) {
        for (let sourceKey in childConfig.__sourceList) {
          rprops[sourceKey] =
            self.dataDistributor[childConfig.id + "_" + sourceKey];
        }
      }
    },
    handleItemProps(item, props) {
      let self = this;
      for (let i of item.props) {
        let x = item.props[i];
        if (x !== undefined) {
          if (x.startsWith && x.startsWith("${")) {
            x = x.substring(2, x.length - 1);
            props[i] = self.dataDistributor[x];
            // console.log(
            //   "从数据分派中获取",
            //   x,
            //   self.dataDistributor[x],
            //   self.dataDistributor
            // );
          } else props[i] = self.identifyObject(x);
        } else {
          props[i] = "";
        }
      }
    },
    getWindowSize() {
      let doc = this.$root.$el.ownerDocument;
      return {
        width: doc.documentElement.clientWidth || doc.body.clientWidth,
        height: doc.documentElement.clientHeight || doc.body.clientHeight,
      };
    },
    renderPanel(h, childConfig, index) {
      if (!childConfig) {
        return null;
      }
      // if (!this.awaitRenderList[index]) {
      //   return null;
      // }
      let self = this;
      let rprops = {};
      this.handleRootProps(childConfig, rprops, index);
      //面板专属属性
      rprops["autoSwitch"] = childConfig.autoSwitch;
      rprops["autoSwitchInterval"] = childConfig.autoSwitchInterval;
      // 下钻页面传递参数
      rprops["extensionData"] =
        self.dataDistributor.screenExtensionParams || {};
      rprops["isActivePage"] = self.isActivePage;
      // rprops["panelTheme"] = self.panelTheme;
      // 面板内容区专属属性
      let slotProps = {};
      slotProps["autoScroll"] = childConfig.autoScroll;
      slotProps["autoScrollSpeed"] = childConfig.autoScrollSpeed;
      slotProps["autoScrollDirection"] = childConfig.autoScrollDirection;
      slotProps["isActivePage"] = self.isActivePage;
      // 组件事件
      let events = {
        on: {
          nextPage: this.acceptEvent,
          setPage: this.setPageData,
          prePage: this.prePage,
          jumpPage: this.jumpPage,
          openDialog: this.openDialog,
          closeDialog: this.closeDialog,
        },
        nativeOn: {
          dblclick: this.onDbclick.bind(
            this,
            `${childConfig.component}@${childConfig.id}`
          ),
        },
      };

      //遍历生成组件的函数:
      let buildChild = (item) => {
        //处理容器包裹slot的情况
        if (item.component == "v2-ctn-xy" || item.component == "v2-ctn-order") {
          return h(
            "div",
            { style: item.commonStyle },
            item.children && item.children.map(buildChild)
          );
        }

        //处理通用情况
        let props = {};
        if (item.props) {
          this.handleItemProps(item, props);
        }

        //补充其他的props值
        if (item.dataBasket) {
          for (const key in item.dataBasket) {
            if (self.dataDistributor[key]) {
              props[key] = self.dataDistributor[key];
            } else {
              props[key] = self.identifyObject(item.dataBasket[key]);
            }
          }
        }
        if (item.__sourceList)
          for (let sourceKey in item.__sourceList) {
            props[sourceKey] = self.dataDistributor[item.id + "_" + sourceKey];
          }
        // if (item.dataBasket && item.dataBasket.sourceConfig)
        //   props["sourceConfig"] = item.dataBasket["sourceConfig"];
        props.wid = item.id + "";
        Object.assign(props, slotProps);
        // 下钻页面传递参数
        props["extensionData"] =
          self.dataDistributor.screenExtensionParams || {};
        props["isActivePage"] = self.isActivePage;
        let directives = [];
        if (childConfig.visible != undefined && childConfig.visible !== true) {
          directives.push({
            name: "show",
            value: childConfig.visible,
            rawName: "v-show",
          });
        }
        if (childConfig["if"] != undefined && childConfig["if"] !== true) {
          directives.push({
            name: "if",
            value: childConfig.visible,
            rawName: "v-if",
          });
        }
        // console.log('render slot props: ', props, slotProps);
        // return h("transition", { attrs: { name: "el-zoom-in-center" } }, [
        return h(
          item.component,
          {
            props,
            attrs: props,
            slot: item.slotName || "default",
            directives,
            ref: item.$ref,
            style: item.commonStyle,
            ...events,
          },
          item.children && item.children.map(buildChild)
        );
        // ]);
      };

      return h(
        this.getPanelComponentName(),
        {
          props: {
            wid: childConfig.id,
            config: childConfig,
            ...rprops,
            anime: childConfig.anime || "el-zoom-in-center",
          },
        },
        childConfig.component === "v2-screen-panel"
          ? childConfig.children && childConfig.children.map(buildChild)
          : [
              h(
                childConfig.component, //面板
                {
                  props: rprops, //面板props
                  ref: childConfig.$ref,
                  style: this.setComponentStyle(childConfig),
                  ...events,
                },
                /**
                 * 子组件，嵌入slot
                 */
                childConfig.children && childConfig.children.map(buildChild)
              ),
            ]
      );
    },
    getPanelComponentName() {
      return this.isMobile ? "mobile-screen-panel" : "v2-screen-panel";
    },
    renderDialog(h) {
      // 默认只存在一个弹窗
      let define = this.dialogStack[0];
      if (!define) return null;
      if (!define.component) {
        console.error("[renderDialog] 非法弹窗组件定义！", define);
        return null;
      }
      // if (!Vue.component(define.component)) {
      //   console.error("[renderDialog] 未注册的弹窗组件！", define);
      //   // return null;
      // }
      let { modal, x, y, width, height, params, showClose, animate } = define;
      let style = {
        position: "absolute",
        zIndex: 999,
        width: width || "400px",
        height: height || "300px",
      };
      if (!x && !y) {
        style.inset = 0;
        style.margin = "auto";
      } else {
        style.left = x;
        style.top = y;
      }
      let component = h(
        "div",
        {
          class: ["animated", animate || "zoomIn"],
          style,
        },
        [
          h(define.component, {
            props: { params },
            on: { closeDialog: this.closeDialog },
          }),
          [
            showClose &&
              h("i", {
                on: { click: this.closeDialog },
                style: {
                  position: "absolute",
                  fontSize: "20px",
                  color: "#fff",
                  right: "20px",
                  top: "20px",
                  cursor: "pointer",
                },
                class: ["el-icon-close"],
              }),
          ],
        ]
      );
      if (!modal) {
        return component;
      }
      return [
        component,
        h("div", {
          style: {
            position: "absolute",
            zIndex: 900,
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            opacity: 0.4,
            backgroundColor: "#000",
          },
        }),
      ];
    },

    async openDialog(data) {
      if (data) {
        // if (!Vue.component(data.component)) {
        //   await IDE.registerComponent(data.component);
        // }
        await IDE.registerComponent(data.component);
        this.dialogStack = [data];
      }
    },
    closeDialog() {
      let define = this.dialogStack.shift();
      this.dialogStack = [];
      define.onClose && define.onClose();
    },

    acceptEvent(data) {
      if (this.isDiaPage && !this.isActivePage && data && !data.isForce) {
        console.log("[screen page] 省略未激活下钻页面事件 ");
        // 如果是未激活的下钻页面 除非强制 忽略掉所有平台级别的操作
        return;
      }
      console.log("[screen event] nextPage", data);
      this.$emit("digPage", {
        // digStack: this.pageDef.digPageStack,
        extensionData: data.extensionData,
      });
    },
    onDbclick(name) {
      this.$emit("digCustom", { componentID: name });
    },
    // 设置页面变量 并触发更新
    setPageData(data) {
      if (this.isDiaPage && !this.isActivePage && data && !data.isForce) {
        console.log("[screen page] 省略未激活下钻页面事件 ");
        return;
      }
      console.log("[screen event] setPage", data);
      // 确保是对象的形式
      if (
        data &&
        Object.prototype.toString.call(data.extensionData) === "[object Object]"
      ) {
        let db = this.dataDistributor;
        Object.keys(data.extensionData).forEach((key) => {
          db.$set(db, key, data.extensionData[key]);
          if (!db.screenExtensionParams) {
            db.$set(db, "screenExtensionParams", {});
          }
          db.$set(db.screenExtensionParams, key, data.extensionData[key]);
        });
        // 触发当前页面数据请求更新
        IDE && IDE.$Scheduler.refresh({ uid: this._uid });
      }
    },
    // 关闭当前下钻页面 返回到上一个页面
    prePage(data) {
      if (this.isDiaPage && !this.isActivePage && data && !data.isForce) {
        console.log("[screen page] 省略未激活下钻页面事件 ");
        return;
      }
      console.log("[screen event] prePage");
      IDE && IDE.closePage && IDE.closePage();
    },
    // 跳转页面
    jumpPage(data) {
      if (this.isDiaPage && !this.isActivePage && data && !data.isForce) {
        console.log("[screen page] 省略未激活下钻页面事件 ");
        return;
      }
      console.log("[screen event] jumpPage");
      if (data && data.id) {
        IDE && IDE.openPage(data);
      }
    },
    identifyObject(o) {
      if (typeof o == "string") {
        // o = o.trim();
        if (
          (o.startsWith("[") && o.endsWith("]")) ||
          (o.startsWith("{") && o.endsWith("}"))
        ) {
          try {
            // return JSON.parse(o);
            return eval("(" + o + ")");
          } catch (_) {
            console.log(_);
            return o;
          }
        }
        if (o == "true" || o === true) return true;
        if (o == "false" || o === false) return false;
        if (o.trim() === "") {
          return "";
        }
        if (!isNaN(o)) return Number(o);
      }
      return o;
    },
    setComponentStyle(item) {
      const commonStyle = item.commonStyle;
      if (this.isMobile) {
        //去掉top和left，scale交给mobileScreenPanel处理
        let cw = commonStyle.width;
        if (cw && cw.endsWith && cw.endsWith("px")) {
          return {
            ...commonStyle,
            top: "0",
            left: "0",
            width: commonStyle.width || "0",
            height: commonStyle.height || "0",
            position: "relative",
          };
        }
      }
      return {
        ...commonStyle,
        top: commonStyle.top || "0",
        left: commonStyle.left || "0",
        width: commonStyle.width || "0",
        height: commonStyle.height || "0",
        "background-image": commonStyle["background-image"]
          ? commonStyle["background-image"].indexOf("aweb-api/") === -1
            ? commonStyle["background-image"].replace("url(", "url(/v1/public")
            : commonStyle["background-image"]
          : "",
      };
    },
    async stepRender() {
      let timeout = (time) =>
        new Promise((resolve) => setTimeout(resolve, time));
      for (let i = 0; i < this.awaitRenderList.length; i++) {
        await timeout(800);
        this.$set(this.awaitRenderList, i, true);
        this.$emit("renderComponent", {
          now: this.componentList[i],
          index: i,
          all: this.componentList.length,
        });
      }
      // 如果当前属于下钻的页面  则开始数据请求
      if (IDE && IDE._screenDigPageState) {
        console.log("[screenPage] 属于下钻页面 更新数据请求");
        IDE.$Scheduler.run();
      }
      setTimeout(() => {
        this.$emit("onMounted");
      }, 5000);
    },
    trigerAutoScale() {
      if (!this.isMobile) {
        let customSignal = new CustomEvent("auto-scale", {
          detail: {
            scaleScreen: this.pageDef && this.pageDef.display,
            page: this.$el,
          },
        });
        window.top.dispatchEvent(customSignal);
      }
    },
    setUpScheduler(componentDef, dataDistributor, panelId) {
      if (!componentDef) return;
      if (componentDef.__sourceList) {
        for (let sourceKey in componentDef.__sourceList) {
          if (componentDef.__sourceList[sourceKey].api) {
            let newKey = componentDef.id + "_" + sourceKey;
            dataDistributor[newKey] = {};
            IDE.$Scheduler.get(this).createPolling(
              `${panelId}`,
              newKey, //绑定值
              componentDef.__sourceList[sourceKey].api, //apiName
              componentDef.__sourceList[sourceKey].timeOut, //计时配置对象
              {
                format: componentDef.__sourceList[sourceKey].format_list,
                schemaType:
                  componentDef.dataBasket &&
                  componentDef.dataBasket.schema_type,
              }
            );
          }
        }
      }
      if (componentDef.children) {
        for (const def of componentDef.children) {
          this.setUpScheduler(def, dataDistributor, `${panelId}_${def.id}`);
        }
      }
    },
    deleteAutoScale() {
      let customSignal = new CustomEvent("delete-scale", {});
      window.top.dispatchEvent(customSignal);
    },
  },
};
</script>
<style lang="scss" scoped>
.screenPage {
  position: relative;
  background-repeat: no-repeat;
  width:100%;
  // height: 100%!important;

  .screenPage-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
  .screenPage-renderComponent {
    position: absolute;
    border: 1px solid #fff;
  }
}
</style>
