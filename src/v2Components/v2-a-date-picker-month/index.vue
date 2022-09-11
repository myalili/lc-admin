<template>
    <el-date-picker
      style="width: 300px"
      type="month"
      v-model="vModel"
      placeholder="选择月份"
      value-format="timestamp"
      :disabled="disabled"
      @change="onChange"
      size="mini"
    />
</template>

<script>
// 数据类型和类型： 绑定值:''
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2ADatePickerMonth',
  props: {
    value: {
      type: String,
      default: ()=> { 
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    valueFormat: {
      type: String,
      default: ()=> { 
        return 'timestamp'
      }
    }

  },
  mounted() {
  },
  data() {
    return {
      dataValue: this.value,
    }
  },
  
  methods: {
    onChange(dates, dateStrings) {
      console.log(dates, dateStrings);
      this.dataValue = dates.toString()
      this.$emit('change', dates, dateStrings);
    },
  },
  watch: {
    "dataValue": {
      handler(n) {
        this.$emit('update:value', n.toString());
      }
    },
    "value": {
      handler(n) {
        this.dataValue = Number(n);
      }
    }
  },

}
</script>

<style>

</style>