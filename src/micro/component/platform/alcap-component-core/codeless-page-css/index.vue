<template>
  <div class="codeless-page-css">
    <el-popover
      placement="bottom"
      trigger="manual"
      popper-class="codeless-page-css-popover"
      v-model="visible"
    >
      <div
        class="codeless-page-css-btn flex justify-center items-center flex-col"
        slot="reference"
        @click="visible = !visible"
      >
        <img style="width: 14px" src="./img/icon-back.png" />
        <span>页面样式</span>
      </div>

      <div class="codeless-page-css-content">
        <div class="content-item flex items-center">
          <span class="left-label mr-4">页面背景</span>
          <div class="right-content">
            <el-radio-group v-model="pageCss.bg" size="mini" @change="bgChange">
              <el-radio-button
                :label="i.value"
                :value="i.value"
                v-for="i in bg"
                :key="i.value"
              >
                {{ i.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div
          class="el-color-dropdown mt-4"
          style="margin-left: 72px"
          v-if="pageCss.bg === 'color'"
        >
          <div class="el-color-dropdown__main-wrapper">
            <sv-panel ref="sl" :color="color"></sv-panel>

            <div
              class="flex items-center justify-between mt-2"
              style="width: 280px"
            >
              <img src="./img/xiguan.png" class="w-3 h-3" alt="" srcset="" />
              <hue-slider
                ref="hue"
                :color="color"
                class="rounded-sm w-64"
              ></hue-slider>
            </div>

            <alpha-slider class=" mt-2" style="width: 280px" ref="alpha" :color="color"></alpha-slider>

            <color-inputs class="mt-2" :pageCss="pageCss" :color="color" />
          </div>
        </div>
        <div class="mt-4" style="margin-left: 72px" v-if="pageCss.bg === 'img'">
          <bg-upload :value.sync="pageCss.img" />
        </div>
        <div class="content-item flex items-center mt-2">
          <span class="left-label mr-4">组件间距</span>
          <div class="right-content">
            <el-radio-group
              v-model="pageCss.component.padding"
              size="mini"
              @change="paddingChange"
            >
              <el-radio-button
                :label="i"
                :value="i"
                v-for="i in paddings"
                :key="i"
              >
                {{ i }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import Color from "./color";
import SvPanel from "./components/sv-panel";
import HueSlider from "./components/hue-slider";
import AlphaSlider from "./components/alpha-slider";
import Predefine from "./components/predefine";
import bgUpload from "./components/bgUpload.vue";
import colorInputs from "./components/color-inputs.vue";
export default {
  mixins: [window.codelessMixins.customDialog],
  name: "codelessPageCss",
  inject: ["root"],
  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    Predefine,
    bgUpload,
    colorInputs,
  },
  data() {
    const color = new Color({
      enableAlpha:true,
    });
    return {
      pageCss: {
        bg: "color",
        color: "",
        img: "",
        component: {
          padding: 0,
        },
      },
      bg: [
        {
          label: "颜色",
          value: "color",
        },
        {
          label: "图片",
          value: "img",
        },
      ],
      paddings: [0, 5, 8, 12, 16, 20, 24],
      color,
      showPanelColor: false,
      value: "",

      customInput: "",

      visible: false
    };
  },
  // mounted() {
  //   const ctx = this;
  //   if (JSON.stringify(ctx.root.pageCss) !== '{}') {
  //     debugger
  //     ctx.pageCss = ctx.root.pageCss;
  //   }
  // },
  watch: {
    visible: {
      handler(n) {
        if(n) {
            const ctx = this;
            if (JSON.stringify(ctx.root.pageCss) !== '{}') {
              ctx.pageCss = ctx.root.pageCss;
            }
            console.log('pageCss', ctx.pageCss, ctx.root);
        }
      }
    },
    color: {
      deep: true,
      handler(n) {
        this.showPanelColor = true;
        this.pageCss.color = n.value;
      },
    },
    currentColor: {
      immediate: true,
      handler(val) {
        this.customInput = val;
      },
    },
    pageCss: {
      deep: true,
      handler(n) {
        this.color.fromString(n.color);
        this.$set(this.root, 'pageCss', n);
      }
    }
  },
  methods: {
    paddingChange() {

    }
  },
};
</script>

<style lang="scss">
.codeless-page-css {
  &-btn {
    width: 64px;
    height: 50px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 20px;
    color: #7f8c93;
    opacity: 1;
    cursor: pointer;
    img {
      width: 14px;
      margin-bottom: 6px;
    }
  }
}

.codeless-page-css-popover {
  padding: 24px 60px 24px 24px;
  width: 436px;
  // height: 357px;
  box-sizing: border-box;

  .el-radio-group {
    // @apply bg-primary;
    // padding: 1px;
    border-radius: 22px;
    box-sizing: border-box;
    width: 138.35px;
    display: flex;
    align-items: center;

    .el-radio-button:nth-child(1) {
      .el-radio-button__inner {
        border-radius: 22px 0px 0px 22px;
      }
    }
    .el-radio-button:last-child {
      .el-radio-button__inner {
        border-radius: 0 22px 22px 0;
      }
    }
  }
}
</style>