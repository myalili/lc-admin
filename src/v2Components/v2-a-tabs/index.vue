<template>
  <div class="v2-a-tabs-render">
    <el-tabs
      v-model="active"
      :type="type"
      :tab-position="tabPosition"
      size="mini"
    >
      <el-tab-pane
        v-for="item in tabList"
        :label="item.title"
        :name="item.title"
        :key="item.title"
      >
        <page-render
          :params="{ page: item.path }"
          page="codeLess/index"
          v-if="item.path"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2ATabs",
  props: {
    value: {
      type: String,
    },

    tabList: {
      type: Array,
      default() {
        return [];
      },
    },
    tabPosition: {
      type: String,
      default: () => {
        return "top";
      },
    },
    type: {
      type: String,
      default: () => {
        return "card";
      },
    },
  },

  data() {
    return {
      pck,
    };
  },
  computed: {
    active: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-tabs-render {
  padding: 10px 20px;
  background: #fff;
  border-radius: 4px;
  ::v-deep .el-tabs {
    height: 100%;

    .el-tabs__content {
      height: calc(100% - 50px);

      .el-tab-pane {
        height: 100%;
        overflow: auto;
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
    .el-tabs__active-bar {
      // background-color: #eb3b3b;

    }
    .el-tabs__item.is-active {

    }
    .el-tabs__item {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
  
      &:hover {

      }
    }
  }
}
</style>
