<template>
  <div class="v2-a-container">
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AContainer",
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
.v2-a-container {
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
}
</style>
