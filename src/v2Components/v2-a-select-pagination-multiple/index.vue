<template>
  <codeless-select-pagination 
    :config="config"
    :multiple="true"
    :label="label"
    :labelValue="labelValue"
    :placeholder="placeholder"
    :entityId="entityId"
    :value.sync="vModelFormat"
    @handleChange="change"
  />
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2ASelectPaginationMultiple",
  props: {
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    entityId: {
      type: String,
      default: ()=> {
        return '';
      }
    },
    label: {
      type: String,
      default: () => {
        return "";
      },
    },
    labelValue: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    const ctx = this;
  },
  methods: {
    change(e) {
      console.log(e);
    },
    valueGet(val) {
      return JSON.parse(val) || []
    },
    valueSet(val) {
      return JSON.stringify(val)
    },
  },
};
</script>

<style></style>
