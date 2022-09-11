<template>
  <div class="v2-a-work-carousel">
    <el-tabs v-model="active" size="mini" v-if="config.title">
      <el-tab-pane :label="config.title" :name="config.title" disabled>
      </el-tab-pane>
    </el-tabs>
    <el-carousel
      :type="type"
      :loop="loop"
      :arrow="arrow"
      :height="height"
      :trigger="trigger"
      :autoplay="autoplay"
      :interval="interval"
      :direction="direction"
      :initialIndex="initialIndex"
      :indicatorPosition="indicatorPosition"
      :style="{ '--height': config.title ? 'calc( 100% - 40px )': '100%' }"
    >
      <el-carousel-item v-for="(item, index) in imgList" :key="index">
        <el-image
          class="img-link"
          style="width: 100%; height: 100%"
          :src="item.src"
   
          v-if="item.link"
          @click.native="
            openPage(page.path || null, page.syncParams || null, index)
          "
        ></el-image>
        <el-image
          style="width: 100%; height: 100%"
          :src="item.src"
      
          v-else
        ></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  _options: pck.docs,
  name: "v2AWorkCarousel",
  mixins: [window.codelessMixins.customDialog],
  inject: ['root'],
  props: [
    "config",
    "height",
    "initialIndex",
    "trigger",
    "autoplay",
    "interval",
    "indicatorPosition",
    "arrow",
    "type",
    "loop",
    "direction",
    "page",
  ],

  data() {
    return {
      entityCarouselList: [],
      active: this.config.title,
    };
  },

  computed: {
    imgList() {
      if (this.config.entityId) {
        const sortField = this.config.fields.sortField.dictionaryItem.engNameShort
        function func(a,b){
            if (a[sortField] > b[sortField]) {
              return -1;
            } else if (a[sortField] == b[sortField]) {
              return 0;
            } else {
              return 1;
            }
        }
        if (this.config.num) {
          return this.entityCarouselList.filter(i=>i.src).sort(func).splice(0, Number(this.config.num));
        }else {
          return this.entityCarouselList.filter(i=>i.src).sort(func);
        }
        
      } else {
        return this.config.nodeConfig.list;
      }
    },
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      try {
        if (this.config.entityId) {
          const res = await pipe.entity.getEntityData(
            this.config.entityId,
            "ALCAP_PAGEING",
            {
              query: {},
              orders: [],
              ranges: [],
              pageNum: 1,
              pageSize: 10000,
              retrieveId: "paging",
              entityId: this.config.entityId,
            }
          );
          if (res.response) {
            console.log(
              "res.response",
              this.config.fields.imgField.dictionaryItem.engNameShort
            );
            this.entityCarouselList = res.response.content.map((t) => {
              return {
                src: this.parseImgPath(
                  t[this.config.fields.imgField.dictionaryItem.engNameShort]
                ),
                link: this.config.fields.linkField.dictionaryItem.engNameShort
                  ? t[this.config.fields.linkField.dictionaryItem.engNameShort]
                  : "",
                ...t,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    openLink(item) {
      window.open(item.link);
    },
    openPage(page, syncParams, index) {
      console.log(page, syncParams, index);
      const ctx = this;
      if (!page) return;
      let item = page;
      console.log("要跳转的页面", item);
      let syncParamsObj = {};
      if (syncParams) {
        syncParams.forEach((i) => {
          if (i.isComponent) {
            ctx.$set(
              syncParamsObj,
              i.target,
              ctx.entityCarouselList[index][i.current]
            );
          } else {
            ctx.$set(
              syncParamsObj,
              i.target,
              eval("ctx.root.args." + i.current)
            );
          }
        });
      }
      console.log("参数", syncParamsObj);

      let params = {
        title: '',
        pageId: item.prototypeId,
        prototypeId: item.prototypeId,
        runtime: true,
        syncParamsObj
      };

      let option = {
        title: item.title || '',
        path: 'openSinglePage/render',
        params
      }

      ctx.v2ComponentOpen(option);
    },

    parseImgPath(src) {
      if (typeof src === "string") {
        if (src.indexOf("{") > -1) {
          try {
            const jsonObj = JSON.parse(src.replaceAll("&quot;", '"'));
            if (jsonObj.path) {
              return `${axios.bff}${jsonObj.path}` || "";
            } else {
              return src;
            }
          } catch (error) {
            return src;
          }
        } else {
          return `${axios.bff}${src}`;
        }
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-carousel {
  background: #fff;
  padding: 10px 20px;
  border-radius: 4px;

  ::v-deep .el-carousel {
    padding: 16px 0;
    box-sizing: border-box;
    height: var(--height);
    .el-carousel__container {
      height: 100%;
    }
    .el-carousel__item {
      .el-image {
        cursor: pointer;
      }
    }
  }
  ::v-deep.el-tabs {
    .el-tabs__header {
      margin-bottom: 0;
      .el-tabs__nav-wrap::after {
        height: 0 !important;
      }
    }
  }
  ::v-deep .el-tabs__nav {

    .el-tabs__item {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
    }
  }
}
</style>
