<template>
  <codeless-editor :value.sync="html"  :is-json="true" style="height: 450px"/>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AEditor",
  props: {
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  mounted() {},
  data() {
    return {
    };
  },
  computed: {
    html: {
      get() {
        // console.log('编辑器内容', this.value);
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },

  methods: {

  },
};
</script>

<style>
</style>