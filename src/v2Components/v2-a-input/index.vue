<template>
  <el-input 
      v-model="vModel"
      :max-length="Number(maxLength)"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      size="mini"
      clearable=""
    />
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AInput',
  props: {
    maxLength: {
      type: String,
      default: ()=> {
        return '255';
      }
    },
    type: {
      type: String,
      default: ()=> {
        return 'text';
      }
    },
    value: {
      type: String,
      default: ()=> {
        return '';
      }
    },
    placeholder: {
      type: String,
      default: ()=> {
        return '请输入';
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    config: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style>

</style>