<template>
  <div class="user-logger" v-if="show">
    <div class="mode-btn">
      <div class="model-item left-model" title="简单模式" :class="{ 'mode-active': currentModel === 'simple' }" @click="changeMode('simple')">
        <i class="iconfont icon-tuxingmoshi"></i>
      </div>
      <div class="model-item right-model" title="高级模式" :class="{ 'mode-active': currentModel === 'senior' }" @click="changeMode('senior')">
        <i class="iconfont icon-liebiaomoshi"></i>
      </div>
    </div>
    <el-popover placement="bottom-end" width="769" trigger="click">
      <div class="logger-time-picker">
        <div class="logger-left-quick-select">
          <div class="select-title">选择时间范围</div>
          <div class="select-item" v-for="(time, i) in timeList" :key="i" :class="{ active: time === selectTimeStr }" @click="selectTime(time)">{{ time }}</div>
        </div>
        <div class="logger-right-custom-select">
          <div class="select-title">自定义时间范围</div>
          <el-date-picker
            v-model="timeValue"
            @change="selectTime"
            value-format="timestamp"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div slot="reference" class="select-btn">{{ selectTimeStr }} <i class="el-icon-caret-top"></i></div>
    </el-popover>
    <div class="user-logger-container">
      <div class="timeline-box" v-show="currentModel === 'simple'">
        <div class="timeline-black" v-for="(timeline, i) in timeLineData" :key="i">
          <div class="timeline-label">{{ timeline.label }}</div>
          <el-timeline class="timeline-style">
            <el-timeline-item v-for="(item, index) in timeline.children" :key="index" :type="item.status == 1 ? 'primary' : 'danger'" size="normal">
              <div class="timeline-info">
                <a class="time">{{ item.timestamp }}</a>
                <span class="user-name">{{ (item.createUserName && item.createUserName.substring(0, 1)) || "" }}</span>
                <a class="tips" @click="openDetail(item)">
                  {{ item.content }}
                  <!-- {{ item.createUserName }}
                  <span>{{ item.module }}</span>
                  {{ item.operation }} -->
                </a>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="loading-tips" v-infinite-scroll="scrollLoad" :infinite-scroll-immediate="false" :infinite-scroll-delay="555">
          <span v-show="loading"> <i class="el-icon-loading"></i> 加载中 </span>
          <span v-show="pageNumber == totalPages">
            没有更多数据
          </span>
        </div>
      </div>
      <div class="table-box" v-show="currentModel === 'senior'">
        <loggerTable ref="loggerTable" />
      </div>
      <div class="filter-box">
        <div class="filter-item">
          <div class="filter-title" style="color: #333">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-shaixuanqi"></use>
            </svg>
            筛选器
          </div>
          <div class="filter-content">
            <div class="filter-btn max-btn" :class="{ active: filterNum === 0 }" @click="removeQueryParam">
              全部日志 <a class="tips-nums">{{ totalLogNumber }}</a>
            </div>
          </div>
        </div>
        <div class="filter-item" v-for="(item, i) in filterData" :key="i">
          <div class="filter-title">
            {{ item.title }}
          </div>
          <div class="filter-content">
            <div class="filter-btn" :class="{ active: filter.isActive }" v-for="(filter, i) in item.children" :key="i" @click="clickFilter(item.type, filter, i)">
              <span v-if="filter.name === '成功'" class="success-circle"></span>
              <span v-if="filter.name === '异常'" class="error-circle"></span>
              {{ filter.module || filter.name }} <a class="tips-nums">{{ filter.count }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import tableMixin from '../js/tableMixin.js'
import loggerTable from "./userLoggerTable";
// import moment from 'moment'
import loggerDetailDialog from './loggerDetailDialog.vue'

// const getID = () =>
//   Math.random()
//     .toString(16)
//     .substring(2);
let getObj = () => {
  return {
    label: "",
    children: [],
  };
};
export default {
  components: { loggerTable },
  mixins: [tableMixin,window.V8.mixins],
  props:['show'],
  data() {
    return {
      timeValue: [
        window.moment()
          .add(-3, "day")
          .valueOf(),
        window.moment().valueOf(),
      ],
      sourceData: [],
      filterData: [],
      filterNum: 0,
      currentModel: "simple", // senior
      timeList: ["今日", "最近三天", "最近一周", "最近一个月", "最近一年"],
      selectTimeStr: "最近三天",
      totalLogNumber: 0,
      timer: null,

      // === path ===
      getDataPath: "getLogList",
    };
  },
  watch: {
    timeValue() {
      this.init();
    },
  },
  computed: {
    timeLineData() {
      let result = [],
        timeMap = {};
      for (const item of this.sourceData) {
        let itemTime = window.moment(Number(item.createTime));
        let labelValue = itemTime.format("YYYY-MM-DD");
        if (!timeMap[labelValue]) {
          timeMap[labelValue] = [];
        }
        item.timestamp = itemTime.format("HH:mm:ss");
        timeMap[labelValue].push(item);
      }
      Object.keys(timeMap).forEach((key) => {
        let obj = getObj();
        obj.label = key;
        obj.children = timeMap[key];
        result.push(obj);
      });
      console.log(result);
      return result;
    },
  },
  mounted() {},
  methods: {
    // ==== hook ====
    beforeInitHook() {
      if (this.filterNum == 0) {
        this.getFilterData();
      }
      if (this.currentModel === "senior") {
        this.$nextTick(()=>{
          this.$refs.loggerTable.init();
        })
        return false;
      }
      return true;
    },
    initParams() {
      return Object.assign({ pageNum: this.pageNumber, pageSize: this.pageSize }, this.getQueryParams());
    },
    afterInitHook(result) {
      for (const data of result.obj.content) {
        data.formatTime = window.moment(Number(data.createTime)).format("YYYY-MM-DD HH:mm:ss");
      }
      this.sourceData = this.sourceData.concat(result.obj.content);
    },
    // === custom methods ===
    clickFilter(type, data, index) {
      if (type === "logModuleList") {
        let k = 0;
        data.logOperationList.forEach((e) => e.isActive === false && k++);
        if (k === data.logOperationList.length) {
          if (data.logOperationList[0]) {
            data.logOperationList[0].isActive = true;
            this.filterNum++;
          }
          !data.isActive && this.filterNum++;
          data.isActive = true;
        }
        this.filterData[3].children = data.logOperationList;
      } else if (type === "behavior") {
        data.isActive = !data.isActive;
        data.isActive ? this.filterNum++ : this.filterNum--;
        let i = data.parent.logOperationList.length;
        data.parent.logOperationList.forEach((e) => e.isActive === false && i--);
        if (i == 0) {
          data.parent.isActive = false;
          this.filterNum--;
        } else {
          !data.parent.isActive && this.filterNum++;
          data.parent.isActive = true;
        }
      } else {
        data.isActive = !data.isActive;
        data.isActive ? this.filterNum++ : this.filterNum--;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.sourceData = [];
        this.pageNumber = 1;
        this.init();
      }, 2000);
    },
    changeMode(mode) {
      this.currentModel = mode;
      if (this.filterNum == 0) {
        this.getFilterData();
      }
      if (mode == "senior") {
        this.$nextTick(()=>{
           this.$refs.loggerTable.init();
        })  
      } else {
        this.init();
      }
    },
    selectTime(time) {
      if (Array.isArray(time)) {
        this.selectTimeStr = `${window.moment(time[0]).format("YYYY-MM-DD")} 至 ${window.moment(time[1]).format("YYYY-MM-DD")}`;
      } else {
        this.selectTimeStr = time;
        switch (time) {
          case "今日":
            this.timeValue = [
              window.moment()
                .add(-1, "day")
                .valueOf(),
              window.moment().valueOf(),
            ];
            break;
          case "最近三天":
            this.timeValue = [
              window.moment()
                .add(-3, "day")
                .valueOf(),
              window.moment().valueOf(),
            ];
            break;
          case "最近一周":
            this.timeValue = [
              window.moment()
                .add(-7, "day")
                .valueOf(),
              window.moment().valueOf(),
            ];
            break;
          case "最近一个月":
            this.timeValue = [
              window.moment()
                .startOf("month")
                .valueOf(),
              window.moment()
                .endOf("month")
                .valueOf(),
            ];
            break;
          case "最近一年":
            this.timeValue = [
              window.moment()
                .startOf("year")
                .valueOf(),
              window.moment()
                .endOf("year")
                .valueOf(),
            ];
            break;
          default:
            break;
        }
      }
    },
    getQueryParams() {
      let q = {};
      if (this.filterData.length > 0) {
        //模块 行为
        let model = this.filterData[2].children.filter((e) => e.isActive);
        let userLevels = this.filterData[0].children.filter((e) => e.isActive);
        let status = this.filterData[1].children.filter((e) => e.isActive);
        let behavior = [];
        for (const m of model) {
          behavior = behavior.concat(m.logOperationList.filter((e) => e.isActive));
        }
        if (model.length > 0) {
          q.module = model.map((e) => e.module).join(",");
          q.operation = behavior.map((e) => e.name).join(",");
        }
        if (userLevels.length > 0) {
          q.userLevel = userLevels.map((e) => e.code).join(",");
        }
        if (status.length > 0) {
          q.status = status.map((e) => e.status).join(",");
        }
      }
      return {
        orders: [
          {
            key: "createTime",
            order: "DESC",
          },
        ],
        query: q,
        ranges: [
          {
            key: "createTime",
            from: this.timeValue[0],
            to: this.timeValue[1],
          },
        ],
      };
    },
    removeQueryParam() {
      for (const filter of this.filterData) {
        for (const item of filter.children) {
          item.isActive = false;
          if (item.logOperationList) {
            for (const behavior of item.logOperationList) {
              behavior.isActive = false;
            }
          }
        }
      }
      this.filterNum = 0;
      this.pageNumber = 1;
      this.sourceData = [];
      this.init();
    },
    getFilterData() {
      this.API.request(
        "getLogModuleInfo",
        {
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
        },
        (res) => {
          if (res.success) {
            let result = [];
            let map = {
              logRoleLevelList: "成员",
              logStatusList: "状态",
              logModuleList: "模块",
            };
            Object.keys(res.obj).forEach((key) => {
              if (key !== "total") {
                for (const item of res.obj[key]) {
                  item.isActive = false;
                  if (item.logOperationList) {
                    for (const op of item.logOperationList) {
                      op.isActive = false;
                      op.parent = item;
                    }
                  }
                }
                result.push({
                  type: key,
                  title: map[key],
                  children: res.obj[key],
                  isActive: false,
                });
              }
            });
            result.push({
              title: "行为",
              type: "behavior",
              children: [],
              isActive: false,
            });
            this.filterData = result;
            this.totalLogNumber = res.obj.total;
          } else {
            this.$message.error("获取日志筛选数据失败！");
          }
        },
        (err) => {
          this.$message.error("获取日志筛选数据失败！");
        }
      );
    },
    openDetail(data) {
      let ctx = this;
      ctx.open({
        path:"getLoggerDeatil",
        component:loggerDetailDialog,
        width: "60%", 
        type:'SUB',
        params:{
          response: data.response, 
          params: data.params, 
          loggerData: data, 
          isSingle: !data.keyId 
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        customClass:'codeless-custom-dialog'
        
      })
    //  window.activator.openDialog("loggerDetailDialog", { response: data.response, params: data.params, loggerData: data, isSingle: !data.keyId }, { width: "60%", height: "663px" });
    },
  },
};
</script>

<style lang="scss" scope>
.user-logger {
  // background-color: white;
  height: 95%;
  margin-top: 20px;
  position: relative;
  border-radius: 4px;
  .mode-btn {
    position: absolute;
    width: 84px;
    height: 28px;
    background: #ffffff;
    box-shadow: 0px 3px 6px rgba(55, 78, 113, 0.2);
    border-radius: 22px;
    top: -14px;
    right: 28%;
    z-index: 99;
    .model-item {
      display: inline-block;
      width: 42px;
      height: 28px;
      opacity: 1;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      font-weight: 500;
      color: #333333;
      font-size: 14px;
      i{
        font-size:12px;
      }
    }
    .left-model {
      border-radius: 100px 0px 0px 100px;
    }
    .right-model {
      border-radius: 0 100px 100px 0;
    }
    .mode-active {
      background: #07b6b5;
      color: white;
    }
  }
  .select-btn {
    position: absolute;
    padding: 0 20px;
    height: 32px;
    background: #ffffff;
    box-shadow: 0px 3px 6px rgba(55, 78, 113, 0.2);
    opacity: 1;
    border-radius: 22px;
    top: -14px;
    left: 20px;
    cursor: pointer;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
    color: #374e71;
    z-index: 999;
  }
  .user-logger-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    .timeline-box {
      flex: 0.75;
      height: 100%;
      overflow: auto;
      background-color: white;
      padding-top: 10px;
      border-radius: 4px;
      .timeline-black {
        margin: 20px 0 0 16px;
        .timeline-label {
          width: 115px;
          height: 32px;
          background: #f0f4f7;
          opacity: 1;
          line-height: 32px;
          border-radius: 222px;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          margin-bottom: 20px;
        }
        .timeline-style {
          margin-left: 30px;
          .el-timeline-item__node--normal {
            width: 8px;
            height: 8px;
          }
          .el-timeline-item__tail {
            left: 3px;
          }
          .el-timeline-item__node--danger {
            &::before {
              content: "";
              position: absolute;
              left: -2.5px;
              width: 14px;
              height: 14px;
              background-color: #f6565657;
              border-radius: 50%;
            }
          }
          .el-timeline-item {
            padding-bottom: 30px;
            &:last-child {
              padding-bottom: 0px;
            }
          }
          .el-timeline-item__content {
            position: relative;
            &::after {
              content: "";
              display: block;
              height: 40px;
            }
          }
        }
        .timeline-info {
          height: 40px;
          position: absolute;
          top: -11px;
          a,
          span {
            display: inline-block;
            vertical-align: middle;
          }
          .time {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
          }
          .user-name {
            margin: 0 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #9fbcca;
            text-align: center;
            line-height: 40px;
            font-size: 16px;
            color: #ffffff;
            font-weight: 400;
          }
          .tips {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            opacity: 1;
            cursor: pointer;
            span {
              cursor: pointer;
              margin: 0 5px;
              color: #009aa6;
            }
          }
        }
      }
      .loading-tips {
        width: 100%;
        padding: 10px 0;
        text-align: center;
        margin-bottom: 100px;
      }
    }
    .table-box {
      flex: 0.75;
      height: 100%;
      overflow: auto;
      background-color: white;
    }
    .filter-box {
      flex: 0.25;
      height: 100%;
      overflow: auto;
      padding: 0px 10px 0 20px;

      .filter-item {
        margin-top: 20px;
        .filter-title {
          .svg-icon {
            width:14px;
            height:14px;
            display: inline-block;
            margin-top: -2px;
          }
          font-size: 16px;
          font-weight: 500;
          color: #7f8c93;
          margin-bottom: 15px;
        }
        .filter-content {
          width: 100%;
          .max-btn {
            width: 100%;
          }
          .filter-btn {
            box-sizing: border-box;
            border: 1px solid transparent;
            padding: 0 14px;
            min-width: 30%;
            display: inline-block;
            vertical-align: middle;
            height: 32px;
            background: #d8dfe5;
            border-radius: 222px;
            text-align: center;
            line-height: 32px;
            font-size: 16px;
            font-weight: 400;
            color: #333;
            margin: 5px;
            cursor: pointer;
            .tips-nums {
              display: inline-block;
              vertical-align: baseline;
              padding: 0 8px;
              height: 20px;
              background: #ffffff;
              border-radius: 222px;
              text-align: center;
              font-size: 13px;
              line-height: 20px;
              margin-left: 6px;
            }
            &:hover {
              border: 1px solid #374e71;
            }
          }
          .active {
            background: #e9f4fb;
            border: 1px solid #374e71;
            .tips-nums {
              background: #374e71;
              vertical-align: baseline;
              color: white;
            }
          }
        }
        .success-circle,
        .error-circle {
          width: 8px;
          height: 8px;
          display: inline-block;
          vertical-align: top;
          margin: 11px 4px 0 4px;
          border-radius: 50%;
          background-color: #27c699;
          position: relative;
        }
        .error-circle {
          background-color: #f65656;
          &::after {
            content: "";
            width: 15px;
            height: 15px;
            background-color: #ff5353;
            display: block;
            position: absolute;
            top: -3px;
            left: -3px;
            opacity: 0.35;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.logger-time-picker {
  width: 100%;
  height: 330px;
  display: flex;
  padding-top: 15px;
  .logger-left-quick-select {
    flex: 3;
    height: 100%;
    padding-left: 20px;
  }
  .logger-right-custom-select {
    flex: 7;
    height: 100%;
    padding-left: 20px;
  }
  .select-title {
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #7f8c93;
    margin-bottom: 20px;
  }
  .select-item {
    width: 49%;
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #333333;
    cursor: pointer;
  }
  .active {
    color: #009aa6;
  }
}
</style>
