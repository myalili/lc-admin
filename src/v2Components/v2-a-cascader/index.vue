<template>
  <el-cascader
    v-model="vModelFormat"
    :placeholder="placeholder"
    :options="compOption"
    :props="props"
    :show-search="{ filter }"
    @change="onChange"
    size="mini"
  />
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  mixins: [listMixin],
  name: "v2ACascader",
  props: {
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      },
    },
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
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
    parentId: {
      type: String,
      default: () => {
        return "";
      },
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      fieldNames: { label: "label", value: "value", children: "children" },
      dataValue: this.value,
      dataOptions: [],
      pck,
    };
  },
  computed: {
    compOption() {
      console.log(
        "转换后的",
        this.transformMenu(
          this.dataOptions,
          this.config?.component?.parentId || this.parentId
        )
      );
      return this.transformMenu(
        this.dataOptions,
        this.config?.component?.parentId || this.parentId
      );
    },
    props() {
      console.log("显示字段和值", this.config?.component?.label || this.label);
      return {
        label: this.config?.component?.label || this.label,
        value: this.config?.component?.labelValue || this.labelValue,
      };
    },
  },

  methods: {
    valueGet(val) {
      return JSON.parse(val);
    },
    valueSet(val) {
      return JSON.stringify(val);
    },
    onChange(value) {
      console.log(value);
      this.$emit("change", value);
    },
    filter(inputValue, path) {
      console.log(inputValue, path);
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },
    transformMenu(data, parentField = "PARENT_ID") {
      //函数内直接用ctx代替this访问vue页面的数据。
      console.log("parentField", parentField);
      const ctx = this;
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach((item) => {
        delete item.children;
      });
      let map = {};
      data.forEach((item) => {
        map[item["ID"]] = item;
      });
      data.forEach((item) => {
        let parent = map[item[parentField]];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
  },
};
</script>

<style>
</style>