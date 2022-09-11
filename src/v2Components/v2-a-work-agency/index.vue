<template>
  <div class="v2-a-work-agency">
    <div class="agency-work">
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
      <div class="agency-list">
        <template v-if="list.length">
          <div
            class="agency-content"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="left-color"></div>
            <div class="agency-title">
              <span class="title">{{
                config.fields.titleField.dictionaryItem ? item[config.fields.titleField.dictionaryItem.engNameShort] : item['NAME']
              }}</span>
              <!-- <span
                class="time"
                v-if="
                  item[
                    config.fields.createTimeField.dictionaryItem.engNameShort
                  ]
                "
              >
                {{
                  item[
                    config.fields.createTimeField.dictionaryItem.engNameShort
                  ] | dateFilter
                }}
              </span> -->
            </div>
            <div
              class="agency-desc"
              v-if="item['STATUS']"
            >
              <span class="span1">状态：</span>
              <span class="span2">{{
                config.fields.titleField.dictionaryItem ? item[config.fields.statusField.dictionaryItem.engNameShort] : item['STATUS']
              }}</span>
            </div>
            <div
              class="agency-desc"
              v-if="item['DESCRIPTION']"
            >
              <span class="span1">任务描述：</span>
              <span class="span2">{{
                config.fields.titleField.dictionaryItem ? item[config.fields.taskDespField.dictionaryItem.engNameShort] : item['DESCRIPTION']
              }}</span>
            </div>
          </div>
        </template>
        <el-empty description="暂无数据" v-else />
      </div>
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
  name: "v2AWorkAgency",

  props: {
    config: {},
  },

  filters: {
    dateFilter(v) {
      return formatDate(v, "MM-DD HH:mm");
    },
  },

  data() {
    return {
      list: [
        {
          USER_ID: "usr-aUUFk2HH",
          STATUS: "",
          DESCRIPTION: "",
          ID: "TODO_TASK-9wu6G6yC",
          NAME: "本周工作汇总报表",
        },
        {
          USER_ID: "usr-aUUFk2HH",
          STATUS: "普通",
          DESCRIPTION: "机构相关设置",
          ID: "TODO_TASK-BlRDWRvO",
          NAME: "银行机构",
        },
        {
          USER_ID: "usr-aUUFk2HH",
          STATUS: "",
          DESCRIPTION: "",
          ID: "TODO_TASK-i3xNOkuv",
          NAME: "上周工作汇总",
        },
        {
          USER_ID: "usr-aUUFk2HH",
          STATUS: "",
          DESCRIPTION: "",
          ID: "TODO_TASK-k1UNOens",
          NAME: "新员工培训安排",
        },
        {
          USER_ID: "usr-aUUFk2HH",
          STATUS: "",
          DESCRIPTION: "",
          ID: "TODO_TASK-KeV3Cwrg",
          NAME: "企业客户签约安排事宜",
        },
      ],
    };
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
            "ALCAP_LIST",
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
.v2-a-work-agency {
  width: 400px;
  background: #ffffff;
  opacity: 1;
  border-radius: 6px;
  padding: 19px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .agency-work {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-right: 1px solid #edf1f2;

    .agency-list {
      width: 100%;
      height: calc(100% - 34px);
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      ::v-deep .el-empty {
        padding: 8px 0;
        .el-empty__image {
          width: 120px;
        }
      }
      .agency-content {
        cursor: pointer;
        --bgColor: #00d5ba;
        width: 92%;
        background: #ffffff;
        box-shadow: 0px 0px 10px rgba(55, 78, 113, 0.2);
        border-radius: 6px;
        box-sizing: border-box;
        padding: 16px 16px 12px 16px;
        margin: 10px auto;
        position: relative;
        overflow: hidden;
        .left-color {
          width: 3px;
          height: 100%;
          background: var(--bgColor);
          position: absolute;
          left: 0;
          top: 0;
        }
        .agency-title {
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .title {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            line-height: 32px;
            color: #333333;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1; //在第几行显示...
            -webkit-box-orient: vertical;
          }
          .time {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 32px;
            color: #a4aeb4;
            opacity: 1;
          }
        }
        .agency-desc {
          margin-top: 12px;
          span {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 14px;
            opacity: 1;
          }
          .span2 {
            color: #333333;
          }
          .span1 {
            color: #7f8c93;
          }
        }
      }
    }
  }

  .top {
    width: 92%;
    height: 16px;
    box-sizing: border-box;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top-left {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 32px;
      color: #333333;
      opacity: 1;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    .top-right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 400;
      line-height: 36px;
      color: #a4aeb4;
      &:hover {
        color: #3698f2;
        cursor: pointer;
      }
      .time-item {
        width: 38px;
        height: 24px;
        opacity: 1;
        color: #374e71;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: #50a8ff;
          color: #ffffff;
        }
      }
      .actived {
        background: #50a8ff;
        color: #ffffff;
      }
    }
  }
}
</style>
