<template>
  <div class="v2-a-text w-full h-full">
    <p class="flex" :style="pStyle" v-if="!checkHtml(vModel)">
      {{ vModel }}
    </p>
    <div class="w-full h-full" v-html="vModel" v-else></div>
  </div>
</template>

<script>
// const { convertCurrency } = window.codelessUtils;
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AText",
  props: {
    value: {
      type: String || Number,
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
    align: {
      type: String,
      default: () => {
        return "left";
      },
    },
    vertical: {
      type: String,
      default: () => {
        return "flex-start";
      },
    },
  },
  computed: {
    pValue() {
      if (!isNaN(this.value) && this.value.indexOf(".") > -1) {
        let value = Number(this.value).toFixed(2);
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return this.value;
      }
    },
    pStyle() {
      if (this.value && !isNaN(this.value) && this.value.indexOf(".") > -1) {
        return {
          fontSize: "16px",
          fontWeight: "400",
          color: "#f1545d",
          margin: 0,
          "justify-content": this.align,
          "align-items": this.vertical,
        };
      } else {
        return {
          fontSize: this.fontSize,
          color: this.color,
          margin: 0,
          "justify-content": this.align,
          "align-items": this.vertical,
        };
      }
    },
  },
  methods: {
    // convertCurrency
    checkHtml(htmlStr) {
      var reg = /<[^>]+>/g;
      return reg.test(htmlStr);
    },
  },
};
</script>

<style>
</style>