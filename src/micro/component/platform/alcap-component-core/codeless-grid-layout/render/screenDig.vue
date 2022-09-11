<template>
  <div style="position:fixed;left:0;top:0;height:100%;width:100%;z-index:1001" ref="container" v-show="plays.length > 0 || isLoading">
    <!-- 动画 -->
    <div
      style="position:absolute;width:100%;height:100%;z-index:999;background:#0f1f34;display:flex;justify-content:center;align-items: center;flex-direction: column;"
      v-show="isLoading"
    >
      <div style="color:#0191ff;font-size:28px;">{{ loadingText }}</div>
      <div
        style="background: #000;height: 5px;border-radius: 3px;border-left: 1px solid #111;border-top: 1px solid #111;border-right: 1px solid #333;border-bottom: 1px solid #333;width:40%;margin:10px 0"
      >
        <span
          ref="process"
          :style="{ width: process + '%' }"
          style="height: 1px;margin: 2px 0;background: #2187e7;position: absolute;box-shadow:0px 0px 10px 1px rgb(0 198 255 / 40%);transition: all .7s;"
        ></span>
      </div>
      <div style="color:#0191ff;font-size:20px;">已加载 {{ process }}%</div>
    </div>

    <div v-if="showBackBtn && plays.length > 0" style="position: absolute; left: 50px;top: 50px;z-index: 998;">
      <el-button size="small" icon="el-icon-arrow-left" circle @click="closeDigPage"></el-button>
    </div>

    <!-- 页面渲染区 -->
    <keep-alive>
      <v2-screen-page
        v-for="page in plays"
        ref="digScreenPage"
        class="animated"
        :class="page.active ? 'zoomIn' : 'zoomOut'"
        :key="page.uid"
        :isDiaPage="true"
        :isActivePage="page.active"
        :pageDef="page.pageDef"
        @digPage="handleDigPage"
        @digCustom="handleDigCustom"
        @onMounted="isLoading = false"
        @renderComponent="handleProcess"
      />
    </keep-alive>
  </div>
</template>

<script>
/**
 * 专门用来处理下钻的组件
 * 下钻有两种：
 * 1、具有序列关系的下钻 (在编排已经定义好的下钻关系)
 * 2、单独的下钻 (比如面板下钻，除了这种之外也可以手动调用)  一个页面可能会有多个面板下钻
 * 考虑到比较复杂的情况 比如在序列关系的任意下钻页面中 打开单独的下钻（如面板下钻）, 在单独的下钻中打开另一个单独的下钻
 */
const getPageDefUrl = `/aweb-api/pageVersion/get`;
export default {
  props: {
    pageList: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  components: {},
  computed: {
    activePageId() {
      let page = this.pageList[this.activeIndex];
      return page ? page.id : null;
    },
    activeDigStack() {
      return this.digLogic[this.activePageId].pageStack || [];
    },
    axios() {
      return window.axios || window.$axios;
    },
    showBackBtn() {
      return window.parent === window;
    },
  },
  watch: {
    pageList: {
      immediate: true,
      handler() {
        const logic = {};
        for (const page of this.pageList) {
          let define = (logic[page.id] = {});
          // 存放页面的下钻关系
          if (page.digPageStack) {
            define.pageStack = page.digPageStack;
          }
          if (page.digCustom) {
            define.digCustom = page.digCustom;
          }
        }
        this.digLogic = logic;
      },
    },
    state() {
      if (this.state === 1 || this.state === 2) {
        IDE._screenDigPageState = true;
      } else {
        IDE._screenDigPageState = false;
      }
      if (window.MyType === "inner") {
        window.parent.IDE._screenDigPageState = IDE._screenDigPageState;
      }
      this.$emit("stateChange", this.state);
    },
    // 触发动画效果
    // isLoading() {
    //   if (this.isLoading) {
    //     setTimeout(() => {
    //       this.$refs.process.style.width = "95%";
    //     }, 1000);
    //   } else {
    //     this.$refs.process.style.width = "0%";
    //   }
    // },
  },
  data() {
    return {
      // 当前编排页面下钻关系
      digLogic: {},
      // 当前显示页面 此数组只存放一个页面并且渲染它 单纯为了 keep-alive 而存在的数组
      plays: [],
      // 当前下钻栈  可能会集合 序列的下钻和单独的下钻
      playStack: null,
      playPoint: -1, // 整个播放栈指针
      // def 缓存
      defCache: {},
      // 当前状态 ： 0没有下钻 1序列下钻 2独立下钻  状态的切换会有不同的行为
      state: 0,
      isBlocking: false, // 阻塞标识
      isLoading: false,
      singeDeep: 0, // 单独打开的页面下钻深度

      loadingText: "正在下载页面",
      process: 0,
    };
  },
  methods: {
    handleDigPage(config) {
      this.requireDigPage(config);
    },
    handleProcess(data) {
      let { now, index, all } = data;
      if (index === 0) {
        this.process = 0;
      }
      if (now && all) {
        this.process = parseInt((index / all) * 100);
        this.loadingText = `渲染 ${(now.dataBasket && now.dataBasket.title) || now.name}`;
      }
    },
    handleDigCustom({ componentID } = {}) {
      console.log("[screenDig] 接受处理自定义下钻请求：", componentID);
      if (this.state === 0) {
        let define = this.digLogic[this.activePageId].digCustom;
        if (define && define.self && define.self[componentID]) {
          this.requireDigPage({ id: define.self[componentID].pageId });
        } else {
          console.warn("[screenDig] 匹配不到组件自定义的下钻页面：", define, componentID);
        }
      } else if (this.state === 1) {
        let define = this.digLogic[this.activePageId].digCustom;
        let digPageid = this.playStack[this.playPoint].id;
        if (define && define.digPages && define.digPages[digPageid] && define.digPages[digPageid][componentID]) {
          this.requireDigPage({ id: define.digPages[digPageid][componentID].pageId });
        } else {
          console.warn("[screenDig] 匹配不到组件自定义的下钻页面：", define, componentID);
        }
      }
    },
    /**
     * 触发下钻页面
     */
    requireDigPage({ id, extensionData } = {}) {
      if (this.isBlocking || this.isLoading) return;
      if (!this.playStack) {
        this.playStack = (this.activeDigStack || []).map((v) => {
          return { id: v, params: {} };
        });
      }
      if (id) return this.openSingePage({ id, extensionData });
      this.playPoint++;
      let pid = this.playStack[this.playPoint] && this.playStack[this.playPoint].id;
      if (!pid) {
        this.playPoint--;
        return console.warn("[screenDig] 当前页面没有下钻！");
      }
      this.playStack[this.playPoint].params = extensionData || {};
      this.updatePlay();
      this.state = 1;
    },
    /**
     * 单独打开的页面
     */
    openSingePage({ id, extensionData }) {
      this.isBlocking = true;
      this.playPoint++;
      this.singeDeep++;
      this.state = 2;
      let stackItem = {
        id: id,
        params: extensionData || {},
      };
      if (this.playPoint === -1) {
        this.pageStack.push(stackItem);
      } else {
        this.playStack.splice(this.playPoint, 0, stackItem);
      }
      this.updatePlay();
    },
    /**
     * 更新视图
     */
    async updatePlay() {
      const { id, params } = this.playStack[this.playPoint] || {};
      const self = this;
      if (id) {
        if (!this.defCache[id]) await this.getPageDef(id);
        let def = JSON.parse(JSON.stringify(this.defCache[id]));
        def.__screenParams = params;
        let obj = {
          uid: id,
          pageDef: def,
          active: true,
        };
        this.updatePageActive(() => {
          self.plays = [obj];
          self.isBlocking = false;
        });
        console.log("[screenDig] 渲染页面", def);
      } else {
        this.updatePageActive(() => {
          self.plays = [];
          self.isBlocking = false;
        });
      }
      setTimeout(() => (this.isLoading = false), 10000);
    },

    // 触发页面active的属性变化
    updatePageActive(cb) {
      if (this.plays.length > 0) {
        this.plays[0].active = false;
        setTimeout(cb, 1000);
        return;
      }
      cb();
    },

    getPageDef(id) {
      const self = this;
      self.isLoading = true;
      self.loadingText = "正在下载页面";
      self.process = 0;
      return new Promise((resolve, reject) => {
        this.axios
          .get(`${getPageDefUrl}?pageId=${id}`, {})
          .then(async (res) => {
            this.loadingText = "下载成功，正在解析页面";
            try {
              let pageDef = JSON.parse(res.obj || {});
              if (pageDef.structure && pageDef.structure.children) {
                let previewComponent = await IDE.getDefComponent(pageDef.structure.children, id);
                await IDE.loadPreviewComponent(id, previewComponent);
              }

              self.defCache[id] = pageDef;
              resolve(pageDef);
            } catch (error) {
              throw new Error(error);
            }
          })
          .catch((err) => {
            console.log("[screenDig]获取或解析下钻页面失败！", err);
            this.loadingText = "解析页面失败！";
            reject(err);
          });
      });
    },

    closeDigPage() {
      if (this.state === 0) return;
      this.playPoint--;
      if (this.playPoint <= -1) {
        this.clear();
        return;
      }
      if (this.state === 1) {
        this.updatePlay();
      }
      if (this.state === 2) {
        // 移除掉单独播放的页面  它只能暂时存在在定义的页面栈堆中
        this.singeDeep--;
        if (this.singeDeep <= 0) {
          this.state = 1;
        }
        this.playStack.splice(this.playPoint + 1, 1);
        this.updatePlay();
      }
    },

    clear() {
      this.playPoint = -1;
      this.state = 0;
      this.playStack = null;
      this.updatePageActive(() => {
        this.plays = [];
      });
    },

    // 四指向上滑动关闭下钻
    bindGestures(nums = 4) {
      let el = this.$refs.container;
      let self = this;
      let distance = 200;
      el.addEventListener("touchstart", (e) => {
        if (self.state == 0 || e.touches.length != nums) return;
        let startY = e.touches[0].clientY;
        let isClose = false;
        const move = (e) => {
          if (isClose) return;
          let current = e.touches[0].clientY;
          if (startY - current > distance) {
            self.closeDigPage();
            isClose = true;
          }
        };
        const dispose = (e) => {
          el.removeEventListener("touchmove", move);
          el.removeEventListener("touchend", dispose);
        };
        el.addEventListener("touchmove", move);
        el.addEventListener("touchend", dispose);
      });
    },
  },
  mounted() {
    window.IDE = window.IDE || {};
    IDE.closePage = this.closeDigPage;
    IDE.openPage = this.requireDigPage;
    if (window.parent !== window) {
      window.parent.IDE.closePage = this.closeDigPage;
      window.parent.IDE.openPage = this.openPage;
    }
    this.$nextTick(()=>{
      this.bindGestures(4)
    })
  },
};
</script>
