<template>
  <div class="v2-a-work-trends">
    <div class="agency-chart">
      <div class="top">
        <div class="top-left">
          <codeless-icon
            icon="icon-chuliqushi-gongzuotai"
            style="margin-right: 6px"
          ></codeless-icon>
          处理趋势
        </div>
        <div class="top-right">
          <div
            class="time-item"
            v-for="item in dateArr"
            :key="item"
            :class="{ actived: timeActived === item }"
            @click="timeActived = item"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="charts" ref="elBox">
        <div
          class=""
          style="width: null; height: 100%"
          ref="chart"
          id="chart"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  _options: pck.docs,
  name: "v2AWorkTrends",

  data() {
    return {
      chart: null,
      timeActived: "天",
      dateArr: ["时", "天", "周", "月", "年"],
    };
  },

  computed: {
    option() {
      /** @type {V2ViewType} */
      let ctx = this;
      let data = [];

      for (let i = 0; i < 20; i++) {
        data.push([
          +new Date() + i * 10000,
          parseInt(Math.random() * (100 - 80 + 1) + 80, 10),
        ]);
      }

      let markPoint = null;
      let pointLineData = null;
      let formatTime =
        ctx.pointData &&
        ctx.pointData.replace &&
        ctx.pointData.replace(/"|'/g, "");
      let time = new Date(formatTime || ctx.pointData);
      if (time != "Invalid Date") {
        pointLineData = time;
        markPoint = data.find((v) => +new Date(v[0]) === time.getTime());
      }
      let option = {
        grid: {
          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "8%",
        },
        xAxis: {
          type: "time",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#C3C8CF",
            formatter: function (value, index) {
              // 格式化成月/日
              var date = new Date(value);
              var texts = [date.getMonth() + 1, date.getDate()];
              return texts.join("/");
            },
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "ragba(0,0,0,0)",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#C3C8CF",
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",

              color: "rgba(0,0,0,0.1)",
            },
          },
        },
        series: [
          {
            data: data,
            type: "line",
            lineStyle: {
              color: "#3698F2",
              width: 2,
              shadowColor: "rgba(0,0,0,0.3)",
              shadowBlur: 10,
              // shadowOffsetY: 2
            },
            itemStyle: {
              opacity: 0,
            },
            markPoint: {
              data: [
                {
                  coord: markPoint || [],
                  value: (markPoint && markPoint[1]) || "",
                  symbol: "circle",
                  symbolSize: [20, 20],
                  label: {
                    show: true,
                    color: "#fff",
                    position: "bottom",
                    backgroundColor: "rgba(118, 213, 215, 1.00)",
                    padding: [6, 25, 6, 25],
                    borderRadius: 5,
                    shadowBlur: 5,
                    shadowColor: "rgba(0,0,0,0.2)",
                  },
                  itemStyle: {
                    color: "rgba(118, 213, 215, 1.00)",
                    shadowBlur: 15,
                    shadowColor: "rgba(118, 213, 215, 1.00)",
                  },
                },
              ],
            },
            markLine: {
              lineStyle: {
                width: 1,
                type: "solid",
                opacity: 0.1,
                color: "#eee",
                shadowBlur: 4,
                shadowColor: "rgba(0,0,0,0.1)",
              },
              symbol: "none",
              data: [
                {
                  xAxis: pointLineData || "",
                  name: "1",
                  label: {
                    show: false,
                  },
                },
              ],
              animation: false,
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(207, 221, 241, 1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(207, 221, 241, 0)",
                  },
                ],
              },
            },
          },
        ],
      };

      return option;
    },
  },

  mounted() {
    const ctx = this;
    setTimeout(() => {
      ctx.setChartWidth();
      ctx.$nextTick(() => {
        ctx.getMap();
      });
    });
    window.addEventListener("resize", this.resize);
  },

  methods: {
    resize() {
      const ctx = this;
      setTimeout(() => {
        ctx.setChartWidth();
        ctx.chart && ctx.chart.resize && ctx.chart.resize();
      }, 200);
    },
    getMap() {
      this.chart = this.$echarts.init(this.$refs.chart, "purple-passion");
      this.chart.setOption(this.option || {}, true);
      this.chart.resize();
    },
    setChartWidth() {
      //根据自己需要调节图形大小,我的图形是放在<div class="main">中
      if (this.$refs.elBox.hasOwnProperty("offsetWidth")) {
        let mainWidth = this.$refs.elBox.offsetWidth;
        document.getElementById("chart").style.width = mainWidth + "px";
      }
    },
  },

  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
};
</script>

<style lang="less" scoped>
.v2-a-work-trends {
  width: 1239px;
  background: #ffffff;
  opacity: 1;
  border-radius: 6px;
  padding: 19px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .agency-chart {
    width: 100%;
    height: 100%;
    .top {
      // width: 96%;
    }
    .charts {
      width: 100%;
      height: calc(100% - 24px);
    }
  }

  .top {
    width: 100%;
    height: 16px;
    box-sizing: border-box;
    padding: 0 23px 0 18px;
    margin-bottom: 8px;
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
          @apply bg-primary;
          color: #ffffff;
        }
      }
      .actived {
        @apply bg-primary;
        color: #ffffff;
      }
    }
  }
}
</style>
