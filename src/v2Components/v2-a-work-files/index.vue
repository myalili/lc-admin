<template>
  <div class="v2-a-work-files">
    <div class="top">
      <div class="top-left">
        <codeless-icon
          :icon="config.titleIcon"
          style="margin-right: 6px"
        ></codeless-icon>
        {{ config.title }}
      </div>
      <div class="top-right" @click="openMorePage">
        查看全部
        <i
          class="el-icon-arrow-right"
          style="font-size: 10px; margin-left: 6px"
        ></i>
      </div>
    </div>
    <div class="notice-list">
      <template v-if="list.length">
        <div
          class="list-item"
          v-for="(item, index) in list"
          :key="index"
          @click="handlePreview(item)"
        >
          <i class="el-icon-document mr-4"></i>
          <div class="item-content">
            <h4 class="item-title notice-title">
              {{ item[config.fields.contentField.dictionaryItem.engNameShort] }}
            </h4>
            <p class="item-time whitespace-nowrap overflow-hidden">
              {{
                item[config.fields.createTimeField.dictionaryItem.engNameShort]
              }}
            </p>
          </div>
        </div>
      </template>
      <el-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  _options: pck.docs,
  mixins: [window.codelessMixins.customDialog],
  name: "v2AWorkFiles",

  props: {
    config: {},
  },

  data() {
    return {
      list: [],
    };
  },

  mounted() {
    this.getData();
  },

  watch: {
    config: {
      handler(n) {
        this.getData();
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    handlePreview(file) {
      
      let f = JSON.parse(file[this.config.fields.url.dictionaryItem.engNameShort].replaceAll('&quot;', "\"")) ;
      console.log(
        file,
        f
      );
      let url = `${axios.bff}/file/download?filePath=${f.path}`;
      let link = document.createElement("a"); //创建a标签
      link.style.display = "none"; //将a标签隐藏
      link.href = url; //给a标签添加下载链接
      link.setAttribute("download", f.name); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
      document.body.appendChild(link);
      link.click();
    },
    async getData() {
      try {
        if (this.config.entityId) {
          const res = await pipe.entity.getEntityData(
            this.config.entityId,
            "ALCAP_PAGEING",
            {
              entityId: this.config.entityId,
              orders: [],
              pageNum: 1,
              pageSize: 10000,
              query: {},
              ranges: [],
              retrieveId: "paging",
            }
          );
          if (res.response) {
            this.list = res.response.content;
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    openMorePage() {
      if (!this.config.viewAllPage) return;
      const item = this.config.viewAllPage;

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
  },
};
</script>

<style lang="less" scoped>
.v2-a-work-files {
  width: 381px;
  background: #ffffff;
  opacity: 1;
  border-radius: 6px;
  overflow: hidden;
  .top {
    width: 100%;
    height: 16px;
    box-sizing: border-box;
    padding: 0 23px 0 18px;
    margin: 21px 0 18px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    .top-left {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 32px;
      color: #333333;
      opacity: 1;
      display: flex;
      align-items: center;
    }
    .top-right {
      font-size: 14px;
      font-weight: 400;
      line-height: 36px;
      color: #a4aeb4;
      opacity: 1;
      display: flex;
      align-items: center;
      &:hover {
        color: #3698f2;
        cursor: pointer;
      }
    }
  }
  .notice-list {
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 0 16px;
    &::-webkit-scrollbar {
      display: none;
    }
    ::v-deep .el-empty {
      margin-top: 100px;
      padding: 16px 0;
      .el-empty__image {
        width: 120px;
      }
    }
    .list-item {
      width: 100%;
      height: 72px;
      padding: 12px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      .item-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        h4,
        p {
          margin-bottom: 0;
        }
        p {
          margin-top: 5px;
          color: #a4aeb4;
        }
      }
      &:nth-last-child(1) {
        border-bottom: 0;
      }
    }
    .notice-title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
