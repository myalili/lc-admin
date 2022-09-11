<template>
  <div class="v2-a-work-notice">
    <div class="top">
      <div class="top-left">
        <codeless-icon
          v-if="config.titleIcon"
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
      <!-- <div class="top-right-more" @click="openMorePage">更多</div> -->
    </div>
    <div class="notice-list">
      <template v-if="list.length">
        <div
          class="list-item relative"
          v-for="(item, index) in sortList"
          :key="index"
          @mouseover="item.hoverIndex = 1"
          @mouseout="item.hoverIndex = -1"
          @click="openPage(page.path || null, page.syncParams || null, index)"
        >
          <div class="list-item-left">
            <div
              style="
                width: 52px;
                height: 52px;

                border-radius: 14px;
              "
              :style="{ background: config.contentBgColor || '#fff' }"
              class="flex items-center justify-center"
            >
              <codeless-icon
                :icon="config.contentIcon"
                style="font-size: 10px"
              ></codeless-icon>
            </div>
            <div class="item-content">
              <h4 class="item-title notice-title">
                {{
                  config.fields.contentField.dictionaryItem ? item[
                    config.fields.contentField.dictionaryItem.engNameShort
                  ] : item["TITLE"]
                }}
              </h4>
              <p
                class="item-time whitespace-nowrap overflow-hidden"
                style="color: #a4aeb4"
              >
                {{
                  config.fields.contentField.dictionaryItem ?  item[
                    config.fields.createTimeField.dictionaryItem.engNameShort
                  ] : item["TIME"]
                }}
              </p>
            </div>
          </div>
          <div class="list-item-right" v-if="item.hoverIndex === 1">
            <i class="el-icon-more transform rotate-90"></i>
          </div>
          <div class="item-bottom absolute bottom-0"></div>
        </div>
      </template>
      <el-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
// 时间转换
function formatDate(date, format, timezoneOffset = true) {
  if (!date) return "";
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    if (typeof Number(date) === "number") {
      date = new Date(Number(date));
    }
  }
  if (date instanceof Date) {
    if (timezoneOffset === false) {
      const offsetHours = date.getTimezoneOffset() / 60;
      date.setHours(date.getHours() + offsetHours);
    }
    const o = {
      "M+": date.getMonth() + 1, // 月
      "D+": date.getDate(), // 日
      "H+": date.getHours(), // 时
      "m+": date.getMinutes(), // 分
      "S+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "f+": date.getMilliseconds(), // 毫秒
    };
    if (/(Y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        // @ts-ignore
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return format;
  }
}

export default {
  _options: pck.docs,
  mixins: [window.codelessMixins.customDialog],
  name: "v2AWorkNotice",
  inject: ["root"],
  filters: {
    dateFilter(v) {
      return formatDate(v, "YYYY-MM-DD");
    },
  },

  props: {
    config: {},
    page: {},
  },

  data() {
    return {
      list: [
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "“上周工作总结” 发送成功",
            TIME: "20分钟前",
            ID: "WORK_NOTICE-0VQMSDht",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "项目经理给你分配了一项任务",
            TIME: "3分钟前",
            ID: "WORK_NOTICE-6sDh6X5P",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "系统：每日工作进度提醒",
            TIME: "1小时前",
            ID: "WORK_NOTICE-BSmxFYDi",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "关于2021年第二季度考核工作及相关明细",
            TIME: "12分钟前",
            ID: "WORK_NOTICE-GCKN5oMU",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "信息技术部软件升级提醒",
            TIME: "1小时前",
            ID: "WORK_NOTICE-MYen1ipz",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "你收到一份工作周报",
            TIME: "1分钟前",
            ID: "WORK_NOTICE-UazrypjT",
            ICON: "",
          },
        ],
    };
  },

  mounted() {
    this.getData();
  },
  computed: {
    sortList() {
      if (this.config.entityId) {
        const sortField =
          this.config.fields.createTimeField.dictionaryItem.engNameShort;
        function func(a, b) {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (a[sortField] == b[sortField]) {
            return 0;
          } else {
            return 1;
          }
        }
        return this.list.sort(func);
      } else {
        return [
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "“上周工作总结” 发送成功",
            TIME: "20分钟前",
            ID: "WORK_NOTICE-0VQMSDht",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "项目经理给你分配了一项任务",
            TIME: "3分钟前",
            ID: "WORK_NOTICE-6sDh6X5P",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "系统：每日工作进度提醒",
            TIME: "1小时前",
            ID: "WORK_NOTICE-BSmxFYDi",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "关于2021年第二季度考核工作及相关明细",
            TIME: "12分钟前",
            ID: "WORK_NOTICE-GCKN5oMU",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "信息技术部软件升级提醒",
            TIME: "1小时前",
            ID: "WORK_NOTICE-MYen1ipz",
            ICON: "",
          },
          {
            DEPT_ID: null,
            USER_ID: "usr-aUUFk2HH",
            ROLE_ID: null,
            TITLE: "你收到一份工作周报",
            TIME: "1分钟前",
            ID: "WORK_NOTICE-UazrypjT",
            ICON: "",
          },
        ];
      }
    },
  },

  methods: {
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
            this.list = res.response.content.map((i) => {
              return {
                ...i,
                hoverIndex: -1,
              };
            });
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
    openPage(page, syncParams, index) {
      console.log(page, syncParams, index);
      const ctx = this;
      if (!page) return;
      let item = page;
      console.log("要跳转的页面", item);
      let syncParamsObj = {};
      if (syncParams) {
        syncParams.forEach((i) => {
          if (i.current) {
            if (i.isComponent) {
              ctx.$set(syncParamsObj, i.target, ctx.list[index][i.current]);
            } else {
              ctx.$set(
                syncParamsObj,
                i.target,
                eval("ctx.root.args." + i.current)
              );
            }
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
  },
};
</script>

<style lang="less" scoped>
.v2-a-work-notice {
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
      // font-size: 16px;
      font-family: Source Han Sans CN;
      // font-weight: bold;
      line-height: 34px;
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
    .top-right-more {
      width: 56px;
      height: 23px;
      background: rgba(248, 241, 241, 0.39);
      opacity: 1;
      border-radius: 4px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 19px;
      color: #eb4141;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .notice-list {
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
    box-sizing: border-box;
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
      height: 80px;
      padding: 12px 23px 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
      &:hover {
        background: rgba(250, 250, 250, 0.39);
      }
      &-left {
        width: 90%;
        display: flex;
        align-items: center;
        .item-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          width: 70%;
          h4,
          p {
            margin-bottom: 0;
            color: #333333;
          }
          p {
            margin-top: 5px;
            color: #666666;
          }
        }
        &:nth-last-child(1) {
          border-bottom: 0;
        }
      }
      .item-bottom {
        width: 90%;
        height: 1px;
        background: #edf1f2;
      }
    }
    .notice-title {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      cursor: pointer;
      // &:hover {
      //   color: var(--color-primary);
      // }
    }
  }
}
</style>
