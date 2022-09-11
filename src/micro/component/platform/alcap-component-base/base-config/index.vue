<template>
  <div class="base-config" :id="id">
    <div :class="['drawer', placement, visible ? 'open' : 'close']">
      <div ref="drawer" class="content">
        <div class="config-content" v-if="obj.model">
          <!-- {{ obj.model.href + " [" + obj.model.wid + "]" }}
          <el-divider /> -->
          <div class="sub-title justify-between" style="font-weight: 400">
            <!-- <span>组件标题</span><el-input size="mini" style="width:180px" v-model="obj.model.name" /> -->
            <div class=" flex items-center">
              {{ obj.model.name }}
              <img
                class="ml-2 w-3 cursor-pointer"
                src="./img/icon-info.png"
                alt=""
                srcset=""
                :title="obj.model.href + '@' + obj.model.version"
              />
            </div>
            <i class="el-icon-d-arrow-right cursor-pointer mr-2" style="color: #9db3be;" @click="toggle"></i>
          </div>
          <!-- <el-divider /> -->
          <el-tabs
            v-model="activeName"
            type="border-card"
            @tab-click="handleClick"
            class="base-config-tabs"
          >
            <el-tab-pane label="数据配置" name="data">
              <div class="w-full h-full">
                <base-component
                  :option="option"
                  v-for="item in option"
                  :key="item.name"
                  :item="item"
                  :obj="obj"
                ></base-component>
                <general-component
                  :item="item"
                  :obj="obj"
                ></general-component>
              </div>
            </el-tab-pane>
            <el-tab-pane label="样式配置" name="style">
              <base-style :obj="obj" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div
        :class="['handler-container', placement, visible ? 'open' : 'close']"
        ref="handler"
        @click="toggle"
      >
        <!-- <div class="handler-close">
          <i :class="visible ? 'el-icon-close' : 'el-icon-setting'"></i>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import BaseComponent from "../base-component/index.vue";
import BaseStyle from "../base-style/index.vue";

import generalComponent from './components/general-component.vue';

export default {
  name: "baseConfig",
  components: {
    BaseComponent,
    BaseStyle,
    generalComponent
  },
  model: {
    prop: "visible",
    event: "change",
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    placement: {
      type: String,
      required: false,
      default: "right",
    },
    array: {
      type: Array,
      default: () => {
        return [];
      },
    },
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },

    id: {
      type: String,
      default: "",
    },
    isSub: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showHandler: false,

      activeName: "data",
    };
  },
  watch: {
    visible: {
      handler(n, o) {
        if (n) {
          this.showHandler = true;
        }
      },
    },
    obj: {
      deep: true,
      handler(v) {
        // console.log('component:base-config', v);
      },
    },
  },

  methods: {
    open() {
      this.$emit("change", true);
    },
    close() {
      this.$emit("change", false);
    },
    toggle() {
      this.$emit("change", !this.visible);
    },
  },

  computed: {
    option() {
      const ctx = this;
      return pipe.component.getComponentOptions(ctx.obj.model);
    }
  },
};
</script>
<style lang="scss" scoped>
.base-config {
  position: absolute;
  top: 0;
  .drawer {
    position: fixed;
    transition: all 0.5s;
    height: 100%;
    z-index: 900;
    .config-content {
      width: 317px;
      height: 100%;
      background: #ffffff;
      // box-shadow: 0px 0px 15px rgba(55, 78, 113, 0.3);
      opacity: 1;
      // border-radius: 6px;
      // overflow-y: scroll;
      box-sizing: border-box;
      // padding: 18px 25px 30px 18px;
      padding: 0 0 30px 0;
      .base-config-tabs {
      }
      ::v-deep .el-tabs--border-card {
        box-shadow: 0 0 0 #fff;
        border: 0;
      }
      &::v-deep .el-tabs {
        height: calc(100% - 30px);
        .el-tabs__nav {
          width: 100%;
        }
        .el-tabs__item {
          width: 50%;
          text-align: center;
          height: 30px;
          line-height: 30px;
          font-size: 13px;
          font-family: Source Han Sans CN;
          opacity: 1;
          border-radius: 0px 0px 0px 6px;
        }
        .el-tabs__item.is-active {
          color: #4a8bfd;
          font-weight: bold;
          border-radius: 0;
        }
        .el-tabs__content {
          height: calc(100% - 30px);
          overflow: scroll;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
    &.right {
      right: 0px;
      .content {
        float: right;
      }
      &.open {
        .content {
          // box-shadow: -2px 0 15px rgba(55, 78, 113, 0.3);
          border-top: 1px solid #e7ecef;
          border-left: 1px solid #e7ecef;
        }
      }
      &.close {
        transform: translateX(100%);
      }
    }
  }
  .content {
    display: inline-block;
    height: 100%;
  }
  .handler-container {
    position: absolute;
    display: inline-block;
    text-align: center;
    transition: all 0.5s;
    cursor: pointer;
    top: 200px;
    z-index: 998;
    .handler-close {
      height: 40px;
      width: 40px;
      background: #f9fafc;
      font-size: 26px;
      // box-shadow: -5px 2px 8px rgba(0, 0, 0, 0.15);
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: inherit;
    }
    &.left {
      right: -40px;
      .handler-close {
        border-radius: 0 5px 5px 0;
      }
    }
    &.right {
      left: -40px;
      .handler-close {
        border-radius: 5px 0 0 5px;
      }
    }
  }
  .sub-title {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    line-height: 27px;
    box-sizing: border-box;
    padding-left: 12px;
    font-size: 13px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 32px;
    color: #304156;
    border: 1px solid #cdd3db;
  }

  ::v-deep.el-divider--horizontal {
    margin: 10px 0;
  }
}
</style>
