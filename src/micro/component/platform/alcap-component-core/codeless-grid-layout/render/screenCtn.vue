<template>
  <div
    class="screenCtn"
    :style="{ height: currentSize.height, width: currentSize.width }"
    id="screenCtn"
  >
    <!-- <el-carousel :autoplay="false" @change="changedPageIndex" ref="screenCtn-carousel" height="100%" arrow="always">
      <el-carousel-item v-for="(item,index) of pageList" :key="index">
        <screen :pageDef="item" />
      </el-carousel-item>
    </el-carousel> -->

    <div class="screen-carousel">
      <div
        ref="screen_mark"
        style="position: fixed;height:100%;width:100%;left:0;top:0;z-index:999"
        v-show="showMark"
      ></div>
      <div class="screen-carousel-wrap" ref="test_ref">
        <div
          class="screen-carousel-item animated"
          :style="{ width: currentSize.width + 'px' }"
          v-for="(item, i) of pageList"
          :key="i"
          :class="item.animate"
          v-show="i === index"
        >
          <div>
            <pc-screen-page
              v-if="item.mark === '0' && renderPages[i] && mode == 'pc'"
              @digCustom="handleDigCustom"
              @digPage="handleDigPage"
              :isActivePage="i === index && !hasDigPage"
              :pageDef="item.def"
              :ref="item.id"
            ></pc-screen-page>
            <v2-screen-page
              v-else-if="item.mark === '0' && renderPages[i]"
              @digCustom="handleDigCustom"
              @digPage="handleDigPage"
              :isActivePage="i === index && !hasDigPage"
              :pageDef="item.def"
              :ref="item.id"
            />
          </div>
          <iframe
            v-if="item.loaded && item.mark === '1' && renderPages[i]"
            :src="item.url"
            style="margin: 0;padding:0;box-sizing: border-box;overflow: hidden;height: 100%;width: 100%;"
          />
          <!-- <div style="height:500px;background-color:#000;">1</div> -->
        </div>
      </div>
      <div
        v-show="showArrow"
        class="screen-carousel-btn left-btn"
        style="left:15px;"
        @click="move(-1)"
      >
        <i class="ideicon ideicon-fanhui1"></i>
      </div>
      <div
        v-show="showArrow"
        class="screen-carousel-btn right-btn"
        style="right:15px;transform:rotateZ(180deg);"
        @click="move(1)"
      >
        <i class="ideicon ideicon-fanhui1"></i>
      </div>
    </div>
    <v2-screen-dig
      :pageList="pageList"
      @stateChange="handleDigChange"
      :activeIndex="index"
      ref="screenDig"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    mode: {
      default() {
        return "screen";
      },
    },
  },
  data() {
    return {
      currentSize: {
        // width: 1920,
        // height: "100%",
      },
      index: 0,
      pageList: [],
      renderPages: [], //页面渲染的标识集合
      lock: false,
      iframeTimer: null,
      hasDigPage: false,
      timer: null,
      ctnState: "static",
      moveTimer: null,
    };
  },
  computed: {
    showArrow() {
      if (
        !(this.pageList.length && this.pageList.length > 1 && !this.hasDigPage)
      ) {
        return false;
      }
      if (this.ctnState === "static") {
        return false;
      }
      return true;
    },
    showMark() {
      const item = this.pageList[this.index] || {};
      const flag = item.loaded && item.mark === "1";
      if (flag && this.$refs.screen_mark) {
        this.$refs.screen_mark.style["z-index"] = 999;
      }
      return flag;
    },
  },
  methods: {
    handleDigChange(state) {
      this.hasDigPage = state === 1 || state === 2 ? true : false;
    },
    handleDigPage(config) {
      this.$refs.screenDig.requireDigPage(config);
    },
    handleDigCustom(config) {
      this.$refs.screenDig.handleDigCustom(config);
    },
    setPageData(pageId, extendParams) {
      if (this.$refs[pageId]) {
        const dataDistributor = this.$refs[pageId][0].dataDistributor;
        for (const key in extendParams) {
          dataDistributor[key] = extendParams[key];
        }
        return dataDistributor;
      } else {
        console.log("未找到对应的页面", this.$refs, pageId);
      }
    },
    /* move by arrow */
    move(num) {
      const self = this;
      const maxIndex = self.pageList.length - 1;
      let nIndex = self.index + num;
      if (nIndex < 0) {
        nIndex = maxIndex;
      }
      if (nIndex > maxIndex) {
        nIndex = 0;
      }
      self.moveByIndex(nIndex);
    },
    /* from arrow or eventhook */
    moveByIndex(nIndex) {
      const self = this;
      if (nIndex < 0 || nIndex > self.pageList.length - 1) {
        console.log("跳转失败");
        return false;
      }
      if (nIndex === self.index) return false;

      const page = self.pageList[nIndex];

      if (page.id && page.carouselInfo && !self.lock) {
        self.pageList[self.index].animate =
          self.pageList[self.index].carouselInfo.outAnimate;
        self.lock = true;
        setTimeout(() => {
          self.lock = false;
          page.animate =
            (page.carouselInfo && page.carouselInfo.inAnimate) || "";
          /* make sure index changed before emit the eventhook */
          self.index = nIndex;
          IDE.eventhook.emit("pagemove.screenStatus", nIndex);
          IDE.eventhook.emit("Scheduler.playChange", nIndex);
        }, 1200);
      }
    },
    /* render iframe gradually*/
    renderIframe() {
      const self = this;

      if (self.iframeTimer) {
        clearInterval(self.iframeTimer);
      }
      const handler = () => {
        for (let item of self.pageList) {
          if (!item.loaded) {
            item.loaded = true;
            console.log("[screenCtn]开始加载iframe", item);
            return;
          }
          clearInterval(self.iframeTimer);
        }
      };
      self.iframeTimer = setInterval(handler, 5000);
    },
    /* handle window message */
    handleWindowMsg(res) {
      try {
        const self = this;
        const data = res.data;
        /* get the pages data */
        if (data.type === "setPageList.screenCtn") {
          let res = [];
          const { pageList, carouselInfo, digMap, digCustom } = data.content;
          /* put all data to one obj */
          pageList.forEach((item, index) => {
            // item.def && (item.def.digPageStack = digMap[item.id]);
            res.push({
              mark: item.mark,
              id: item.id,
              url: item.url,
              def: item.def,
              carouselInfo: carouselInfo[item.id],
              animate:
                (carouselInfo[item.id] && carouselInfo[item.id].inAnimate) ||
                "",
              loaded: item.mark === "0" ? true : false,
              digPageStack: digMap[item.id] || [],
              digCustom: digCustom[item.id] || {},
            });
          });
          self.pageList = res;
          self.renderPages = Array(res.length).fill(false);
          self.renderPage();
          self.renderIframe();
        }
        /* when the playingpage change */
        if (
          data.type === "setPlayIndex.screenCtn" &&
          typeof data.content === "number"
        ) {
          self.moveByIndex(data.content);
        }
      } catch (e) {
        console.error("处理window message失败", e);
      }
    },

    watchImgLoading() {
      let imgs = $(this.$el)
        .children()
        .find("img");
      if (imgs.length <= 0) {
        IDE.$Scheduler.run();
        return;
      }
      let replyTime = 0;
      let self = this;
      self.timer = setInterval(() => {
        replyTime++;
        for (let i = imgs.length - 1; i > 0; i--) {
          if (imgs[i].complete) {
            imgs.splice(i, 1);
          }
        }
        console.log("[screenCtn] 剩余图片未加载数量：" + imgs.length);
        if (imgs.length <= 1 || replyTime > 30) {
          replyTime > 30 &&
            console.log("[screenCtn] 超出等待限制，开始加载数据...");
          imgs.length <= 1 &&
            console.log("[screenCtn] 图片加载完毕，开始加载数据...");
          clearInterval(self.timer);
          self.timer = null;
          //恢复队列的加载
          console.log(
            "%c [ScreenCtn] Render finish, Start Data Request...",
            "color:#fff;background-color:#D32D26;padding:3px;border-radius:4px"
          );
          IDE.$Scheduler.run();
        }
      }, 2000);
    },

    async renderPage() {
      let timeout = (time) =>
        new Promise((resolve) => setTimeout(resolve, time));
      for (let i = 0; i < this.renderPages.length; i++) {
        console.log(
          "%c [ScreenCtn] Ready to render the page of " + (i + 1),
          "color:#fff;background-color:#D32D26;padding:3px;border-radius:4px"
        );
        this.$set(this.renderPages, i, true);
        await timeout(3333);
      }
      this.watchImgLoading();
    },

    //此事件的作用在于实现事件的穿透和手势的捕获
    touchEvent(e) {
      const el = this.$refs.screen_mark;
      el.style["pointer-events"] = "none";
      setTimeout(() => {
        el.style["pointer-events"] = "auto";
      }, 666);
    },
    mouseMoveEvent(e) {
      const el = this.$refs.screen_mark;
      el.style["z-index"] = -999;
    },

    showCarouselWidget(e) {
      this.moveTimer && clearTimeout(this.moveTimer);

      this.ctnState === "static" && (this.ctnState = "moving");
      this.moveTimer = setTimeout(() => {
        this.ctnState = "static";
        clearTimeout(this.moveTimer);
        this.moveTimer = null;
      }, 3000);
    },
  },
  created() {
    const self = this;
    window.addEventListener("message", self.handleWindowMsg.bind(self), false);
    window.IDE = window.IDE || {};
    window.IDE.setPageData = (...arg) => {
      self.setPageData(...arg);
    };
  },
  mounted() {
    window.screenCtn = this;
    /* get the pages data */
    if (window.parent !== window || window.MyType !== "inner") {
      window.parent.postMessage({ type: "getPageDefList", content: "" }, "*");
    } else {
      IDE.getDef().then((res) => this.handleWindowMsg(res));
    }

    if (window.MyType !== "inner" && window.frames.length > 0) {
      this.targetWindow = window.frames[0].contentWindow;
    } else {
      this.targetWindow = window;
    }
    const el = this.$refs.screen_mark;
    el.addEventListener("touchstart", this.touchEvent);
    el.addEventListener("mousemove", this.mouseMoveEvent);

    window.addEventListener("mousemove", this.showCarouselWidget);
    window.addEventListener("touchstart", this.showCarouselWidget);

    // 将当前window加入ide的手势中
    window.top.document.dispatchEvent(
      new CustomEvent("add_touchstart", { detail: { target: window } })
    );
  },
  beforeDestroy() {
    const el = this.$refs.screen_mark;
    el.removeEventListener("touchstart", this.touchEvent);
    clearInterval(this.timer);

    this.moveTimer && clearTimeout(this.moveTimer);
    window.removeEventListener("mousemove", this.showCarouselWidget);
    window.removeEventListener("touchstart", this.showCarouselWidget);
  },
  destroyed() {
    if (this.iframeTimer) {
      clearInterval(this.iframeTimer);
      this.iframeTimer = null;
    }
    window.removeEventListener("message", self.handleWindowMsg);
    window.removeEventListener("mousemove", self.mouseMoveEvent);
  },
};
</script>
<style lang="scss">
.screenCtn {
  height: 100%;
  background-color: #fff;
  .el-carousel {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .el-carousel-wrap {
      position: absolute;
      left: 0;
      display: flex;
      .el-carousel-item {
        height: 100%;
        width: 100%;
      }
    }
  }
  .screen-digPage {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
* {
  appearance: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
</style>
