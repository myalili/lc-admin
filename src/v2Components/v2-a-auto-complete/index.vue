<template>
  <el-autocomplete
    class="inline-input"
    v-model="vModel"
    :value-key="label || config.label"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    @select="handleSelect"
    size="mini"
  ></el-autocomplete>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  mixins: [ listMixin ],
  name: "v2AAutoComplete",
  props: {
    value: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
    url: {
      type: Object,
      default: () => {
        return {};
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "请输入";
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
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dataValue: this.value,
      dataOptions: [
        { value: "三全鲜食（北新泾店）", label: "长宁区新渔路144号" },
        {
          value: "Hot honey 首尔炸鸡（仙霞路）",
          label: "上海市长宁区淞虹路661号",
        },
        {
          value: "新旺角茶餐厅",
          label: "上海市普陀区真北路988号创邑金沙谷6号楼113",
        },
      ],
      timeout: null,
      pck
    };
  },
  methods: {
    querySearch(queryString, cb) {
      const ctx = this;
      console.log('dataOptions',dataOptions);
      let dataOptions = ctx.dataOptions
      let results = queryString
        ? dataOptions.filter(ctx.createStateFilter(queryString))
        : dataOptions;

      // 调用 callback 返回建议列表的数据
      clearTimeout(ctx.timeout);
      ctx.timeout = setTimeout(() => {
        cb(results);
      }, 2000 * Math.random());
    },
    createStateFilter(queryString) {
      return (field) => {
        return (field.label.indexOf(queryString) > -1);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
  },
  created() {
    const ctx = this;
  },
};
</script>

<style></style>
