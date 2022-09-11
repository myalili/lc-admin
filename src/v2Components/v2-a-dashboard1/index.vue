<template>
  <div
    style="display: block; height: 200px; width: 200px; position: relative"
    ref="v2Container_3"
  >
    <img
      class="v2-component-image-1624781242431"
      style="
        align-self: stretch;
        min-width: 50px;
        min-height: 50px;
        height: 200px;
        width: 200px;
        position: absolute;
      "
      src="./kjdp_left1-2.png"
    />
    <div
      ref="chart"
      style="position: absolute; height: 200px; width: 200px"
    ></div>
  </div>
</template>
<script>
import pck from "./package.json";

/* __V2_DECOMPILABLE__ */
export default {
  _options: pck.docs,
  name: "v2-a-dashboard1",
  components: {},
  props: {
    showData: {
      type: Object,
      default() {
        return {
          title: "应用群组",
          total: "3726",
          value1: "78",
          value2: "0",
        };
      },
    },
  },
  data() {
    return {
      chart: null,
      /* 版本号，请勿修改 */
      __VERSION: 4.0,
    };
  },
  computed: {
    /**
     *  echarts配置项4
     */
    option() {
      /** @type {V2ViewType} */
      let ctx = this;

      let showData = ctx.showData;
      console.log("ctx.showData", ctx.showData);
      // let showData = ctx.showData;
      const toThousands = (num = 0) => {
        return num.toString().replace(/\d+/, function (n) {
          return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
        });
      };
      let rate = showData.value1 / 100;
      let name = showData.title;
      let total = toThousands(showData.total);
      let activeColor = ["#90d5d8", "#90d5d8", "#90d5d8", "#90d5d8"];

      //  绑定数据源
      /* 
                    title =title
                    value1 = 成功率
                    value2 = 失败率
                    value3 = 总量
                */
      if (ctx.source1 && ctx.source1[3]) {
        rate = ctx.source1[3].value2 / 100;
        name = ctx.source1[3].title;
        total = toThousands(ctx.source1[3].value1);
      }

      let color = new ctx.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: activeColor[0], // 0% 处的颜色
        },
        {
          offset: 1,
          color: activeColor[1], // 100% 处的颜色
        },
        // {
        //     offset: 1,
        //     color: "rgba(245,249,255,1)", // 100% 处的颜色
        // },
      ]);
      let colorSet = [
        [rate, color],
        [1, "rgba(0,0,0,0)"],
      ];
      let rich = {
        value: {
          fontSize: 18,
          color: "#90d5d8",
          fontWeight: "500",
          // fontFamily: 'hanyikaku',
          padding: [65, 0, 0, 0],
        },
        unit: {
          fontSize: 22,
          color: "#E5F1FF",
          fontWeight: "500",
          padding: [-60, 0, 0, 0],
        },
        name: {
          height: 80,
          lineHeight: 80,
          padding: [-40, 0, 0, 0],
          fontSize: 12,
          color: "#90d5d8",
        },
      };

      var option = {
        //   backgroundColor: "#0E1327",
        series: [
          {
            type: "gauge",
            radius: "80px",
            startAngle: "242",
            endAngle: "-61",
            // splitNumber: 1,
            pointer: {
              show: false,
            },
            detail: {
              formatter: ["{name|" + name + "}", "{value|" + total + "}"].join(
                "\n"
              ),
              rich: rich,
              offsetCenter: ["0%", "0%"],
            },
            title: {
              show: false,
            },
            axisLine: {
              show: true,
              roundCap: true,
              lineStyle: {
                color: colorSet,
                width: 10,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
      };
      return option;
    },
  },
  watch: {
    showData: {
      handler(n) {
        let ctx = this;
        ctx.chart.setOption(ctx.option || {}, true);
        ctx.chart.resize();
      },
      deep: true
    },
  },
  methods: {},
  beforeCreate() {
    let ctx = this;
  },
  created() {
    /* Mapping */ /* Advanced Watch */ /* Poll Start */ /* User Code */ let ctx =
      this;
  },
  beforeMount() {
    let ctx = this;
  },
  mounted() {
    /* Resume */ /* User Code */ let ctx = this;
    ctx.chart = ctx.$echarts.init(ctx.$refs.chart, "purple-passion");
    ctx.chart.setOption(ctx.option || {}, true);
    ctx.chart.resize();
  },
  beforeUpdate() {
    let ctx = this;
  },
  updated() {
    let ctx = this;
    ctx.chart.setOption(ctx.option || {}, true);
    ctx.chart.resize();
  },
  beforeDestroy() {
    let ctx = this;
  },
  destroyed() {
    let ctx = this;
  },
  deactivated() {
    let ctx = this;
  },
  activated() {
    let ctx = this;
  },
};
</script>
<style lang="scss">
</style>