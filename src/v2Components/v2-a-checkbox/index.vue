<template>
  <el-checkbox-group v-model="vModelFormat" @change="change" size="mini">
    <component
      :is="computedCheckboxType"
      :label="computedOption(item).value"
      v-for="item in dataOptions"
      :key="computedOption(item).value"
    >
      {{ computedOption(item).label }}
    </component>
  </el-checkbox-group>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  mixins: [listMixin],
  name: "v2ACheckbox",
  props: {
    checkboxType: {
      type: String,
      default: () => {
        return "el-checkbox";
      },
    },
  },
  data() {
    return {
      dataOptions: [],
      pck,
    };
  },
  created() {
    const ctx = this;
  },
  computed: {
    computedCheckboxType() {
      return this.config?.component?.checkboxType || this.checkboxType;
    },
  },
  methods: {
    valueGet(val) {
      return JSON.parse(val) || [];
    },
    valueSet(val) {
      return JSON.stringify(val);
    },
    change(e) {
      console.log(e);
    },
  },
};
</script>

<style>
</style>