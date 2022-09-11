<template>
  <div class="v2-a-input-account">
    <el-input
      size="mini"
      placeholder="请输入"
      :disabled="disabled"
      style="min-width: 144px"
      v-model="formatDataValue"
      @blur="formatValue"
    />
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  _options: pck.docs,
  name: "v2AInputAccount",

  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },

  data() {
    return {
      formatDataValue: "",
      dataValue: this.value,
    };
  },

  watch: {
    dataValue: {
      handler(n) {
        this.$emit("update:value", n);
      },
    },

    value: {
      immediate: true,
      handler(n) {
        this.dataValue = this.formatDataValue = n;
      },
    },
  },

  methods: {
    formatValue() {
      this.formatDataValue = this.formatDataValue.replace(
        /\B(?=(\d{4})+(?!\d))/g,
        " "
      );
      this.dataValue = this.formatDataValue;
    },
  },
};
</script>

<style lang="less" scoped>
.v2-a-input-account {
  display: inline-block;
}
</style>
