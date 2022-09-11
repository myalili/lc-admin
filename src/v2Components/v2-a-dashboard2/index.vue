<template>
  <div style="position: relative; height: 130px; width: 130px">
    <img
      class="v2-component-image-1598412963179"
      style="height: 108px; width: 131px; position: absolute"
      src="./group.png"
    />
    <div
      ref="chart"
      style="height: 130px; position: absolute; width: 131px"
    ></div>
    <div
      class="v2Container-1598514696686 V2Container"
      style="
        display: flex;
        align-items: flex-start;
        align-self: stretch;
        height: 16px;
        box-sizing: border-box;
        justify-content: center;
        position: absolute;
        top: 85px;
        width: 131px;
        flex-direction: row;
      "
      ref="v2Container-2"
    >
      <div
        class="v2Container-1598515290317"
        :class="background"
        style="
          display: flex;
          align-items: flex-start;
          align-self: stretch;
          height: 16px;
          box-sizing: border-box;
          flex-direction: column;
          width: 44px;
          justify-content: center;
        "
        ref="v2Container-3"
      >
        <div
          class="v2-component-text-1598515334433"
          :class="background"
          style="text-align: center; width: 44px; height: 16px; flex-shrink: 0"
          :sub_style="{ textStyle: { 'line-height': '16px' } }"
          component="v2-component-text"
          ref="component-text-1"
        >
          <p :style="{ 'line-height': '16px', 'word-break': 'break-all' }">
            {{ rankText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";

/* __V2_DECOMPILABLE__ */
export default {
  _options: pck.docs,
  name: "v2-a-dashboard2",
  mixins: [],
  components: {},
  data() {
    return {
      /* 数据源1 */
      source1: {},
      /* 版本号，请勿修改 */
      __VERSION: 4.0,
    };
  },
  props: {
    /* showData */
    showData: {
      default: () => {
        return {
          title: "-----",
          value: "32",
          unit: "--",
          icon: "--",
        };
      },
    },
    /* 类名数据 */
    backgroundsData: {
      default: () => {
        return [
          "background1",
          "background2",
          "background3",
          "background4",
          "background5",
          "background6",
        ];
      },
    },
  },
  computed: {
    /**
     *  option
     */
    option() {
      /** @type {V2ViewType} */
      let ctx = this;

      let showData = ctx.showData;

      // let showData = ctx.showData;

      let rate = showData.value / 100;
      let name = showData.title;
      let value = showData.value;
      let activeColor = [
        "rgba(33,138,255,1)",
        "rgba(23,198,255,1)",
        "rgba(34,255,222,1)",
        "rgba(255,255,255,1)",
      ];

      // 数据源填充
      if (ctx.source1 && ctx.source1.data && ctx.source1.data[0]) {
        const targetData = ctx.source1.data[0];
        rate = parseInt(targetData.value) / 100;
        name = targetData.title;
        value = targetData.value;
      }
      console.log("showData", ctx.showData);

      let color = new ctx.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: activeColor[0], // 0% 处的颜色
        },
        {
          offset: 0.85,
          color: activeColor[1], // 100% 处的颜色
        },
        {
          offset: 1,
          color: "rgba(245,249,255,1)", // 100% 处的颜色
        },
      ]);
      let colorSet = [
        [rate, color],
        [1, "rgba(0,0,0,0)"],
      ];
      let rich = {
        value: {
          fontSize: 18,
          color: "#99C9FF",
          fontWeight: "500",
          fontFamily: "hanyikaku",
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
          color: "#99C9FF",
        },
      };

      var option = {
        //   backgroundColor: "#0E1327",
        series: [
          {
            type: "gauge",
            radius: "57px",
            startAngle: "222",
            endAngle: "-42",
            // splitNumber: 1,
            pointer: {
              show: false,
            },
            detail: {
              formatter: ["{name|" + name + "}", "{value|" + value + "}"].join(
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
    /**
     *  背景类名
     */
    background() {
      /** @type {V2ViewType} */
      let ctx = this;
      var className = ctx.backgroundsData[ctx.$attrs._key];
      return className;
    },
    /**
     *  rankText
     */
    rankText() {
      /** @type {V2ViewType} */
      let ctx = this;
      let result = ctx.showData.unit || ctx.showData.rank;
      if (ctx.source1 && ctx.source1.data && ctx.source1.data[0]) {
        result = ctx.source1.data[0].unit;
      }
      return result;
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

    this.chart = this.$echarts.init(this.$refs.chart, "purple-passion");
    this.chart.setOption(this.option || {}, true);
    this.chart.resize();
  },
  beforeUpdate() {
    let ctx = this;
  },
  updated() {
    let ctx = this;
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