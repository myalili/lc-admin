<template>
  <el-select
    v-model="vModel"
    filterable
    :placeholder="placeholder"
    @change="handleChange"
    size="mini"
    clearable=""
  >
    <el-option
      :value="computedOption(item).value"
      :label="computedOption(item).label"
      v-for="item in dataOptions"
      :key="computedOption(item).value"
    >
      {{ computedOption(item).label }}
    </el-option>
  </el-select>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  mixins: [listMixin],
  inject: ["root"],
  name: "v2ASelect",
  props: {
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      },
    },
  },
  data() {
    return {
      dataOptions: [],
      pck,
    };
  },
  mounted() {},
  watch: {},
  methods: {
    filterOption(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0;
    },
    handleChange(e) {
      const ctx = this;
      // console.log("选中的值", e);
    },
  },
};
</script>

<style>
</style>