<template>
  <el-radio-group
    v-model="vModel"
    :disabled="disabled"
    size="mini"
    class="flex items-center flex-wrap h-8"
  >
    <component
      :is="computedRadioType"
      :label="computedOption(item).value"
      v-for="item in dataOptions"
      :key="computedOption(item).value"
    >
      {{ computedOption(item).label }}
    </component>
  </el-radio-group>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;

export default {
  _options: pck.docs,
  mixins: [listMixin],
  name: "v2ARadio",

  props: {
    radioType: {
      type: String,
      default: () => {
        return "el-radio";
      },
    },
  },

  data() {
    return {
      pck,
      dataOptions: [
        {
          label: "备选项",
          value: "1",
        },
        {
          label: "备选项",
          value: "2",
        },
      ],
    };
  },
  computed: {
    computedRadioType() {
      return this.config?.component?.radioType || this.radioType;
    },
  },

  methods: {},
};
</script>
