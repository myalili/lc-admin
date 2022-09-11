<template>
  <codeless-select-pagination 
    :config="config"
    :placeholder="placeholder"
    :entityId="entityId"
    :label="label"
    :labelValue="labelValue"
    :value.sync="vModel"
    @handleChange="change"
  />
</template>

<script>

import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2ASelectPagination",
  props: {
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      },
    },
    value: {
      type: String | Number,
      default: () => {
        return "";
      },
    },
    config: {
      type: Object,
      default: ()=> {
        return {};
      }
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
  },
};
</script>

<style></style>
