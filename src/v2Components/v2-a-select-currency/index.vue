<template>
  <el-select
    filterable
    style="width: 150px"
    v-model="vModel"
    placeholder="请选择币种"
    :disabled="disabled"
    @change="handleChange"
    size="mini"
  >
    <el-option v-for="item in options" :key="item.value">
      {{ item.label }}
    </el-option>
  </el-select>
</template>

<script>
// 数据类型和类型： 绑定值: '', 选项:[{  label: "label", value: 'value' }]
import pck from "./package.json";
const { listMixin } = window.codelessMixins
export default {
  _options: pck.docs,
  mixins: [ listMixin ],
  name: 'v2ASelectCurrency',
  props: { 
    options: {
      type: Array,
      default: ()=> { 
        return [
          {
            value: 'ch',
            label: '人民币'
          },
          {
            value: 'en',
            label: '美元'
          }
        ];
      }
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataValue: this.value,
      dataOptions: [],
      pck
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value);
    },
  },
}
</script>

<style>

</style>