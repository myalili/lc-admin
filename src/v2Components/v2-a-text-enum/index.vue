<template>
  <p :style="{ fontSize: fontSize, color: color, margin: 0 }">
    {{ enumCodesFilter(value) }}
  </p>
</template>

<script>
import pck from "./package.json";

export default {
  _options: pck.docs,
  name: "v2ATextEnum",

  props: {
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
    enumCode: {
      type: String,
      default: () => {
        return "";
      },
    },
    fontSize: {
      type: String,
      default: () => {
        return "14px";
      },
    },
    color: {
      type: String,
      default: () => {
        return "#000";
      },
    },
  },

  data() {
    return {
      enumCodesObj: [],
    };
  },

  watch: {
    enumCode: {
      immediate: true,
      handler(v) {
        if (v) {
          this.searchEnums(v);
        }
      },
    },
  },

  computed: {
    enumCodesFilter() {
      return (value) => {
        if (!value) return value;
        return (
          (this.enumCodesObj.find((i) => i.value === value) || {}).name || ""
        );
      };
    },
  },

  methods: {
    async searchEnums(enumCode) {
      try {
        const { codeList } = window.getBffApi();
        const res = await codeList({ code: enumCode, pageNum: 1, pageSize: 100000 });
        if (res) {
          this.enumCodesObj = res.pageData;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
