<template>
  <el-input 
    v-model="vModel"
    :max-length="Number(maxLength)"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    size="mini"
  />
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AInputTextarea',
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
        return 'textarea';
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
        return '请输入内容';
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    }
  },
  data() {
    return {
      dataValue: this.value
    }
  },
  computed: {
  },
  watch: {
    "dataValue": {
      handler(n) {
        this.$emit('update:value', n);
      }
    },
    "value": {
      handler(n) {
        this.dataValue = n;
      }
    }
  },
  methods: {
    change(n) {
      
    }
  }
}
</script>

<style>

</style>