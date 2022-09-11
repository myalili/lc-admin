<template>
  <span class="v2-a-input-editor">
    <el-input 
      v-model="vModel"
      :max-length="Number(maxLength)"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      size="mini"
    />
  </span>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AInputEditor',
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

<style lang="scss" scoped>
.v2-a-input-editor {
  width: 100%;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
  ::v-deep .el-input__inner {
    font-size: 30px;
    border: 0;
    outline: none;
    height: 40px;
  }
}

</style>