<template>
    <el-date-picker
      v-model="vModel"
      type="date"
      :value-format="compValueFormat"
      :placeholder="placeholder"
      :picker-options="pickerOptions"
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
  name: 'v2ADatePicker',
  props: {
    value: {
      type: String,
      default: ()=> { 
        return ''
      }
    },
    placeholder: {
      type: String,
      default: ()=> { 
        return '请选择日期'
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    format: {
      type: String,
      default: ()=> { 
        return 'yyyy-MM-dd' 
      }
    },
    valueFormat: {
      type: String,
      default: ()=> { 
        return 'timestamp'
      }
    },
    config: {
      type: Object,
      default: ()=> { 
        return {}
      }
    }

  },
  computed: {
    compValueFormat() {
      console.log('this.config', this.config);
      if (JSON.stringify(this.config) !== '{}' && this.config.component.valueFormat) {
        return this.config.component.valueFormat
      } else {
        return this.valueFormat
      }
      
    }
  },
  mounted() {
  },
  data() {
    return {
      dataValue: this.value,

      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  
  methods: {
    onChange(dates, dateStrings) {
      console.log(dates, dateStrings);
      this.$emit('change', dates, dateStrings);
    },
  },
  watch: {
    "dataValue": {
      handler(n) {

        if ((JSON.stringify(this.config) !== '{}' && this.config.component.valueFormat === 'timestamp') || !isNaN(n)) {
          this.$emit('update:value', n.toString());
        } else {
          this.$emit('update:value', n);
        }
      }
    },
    "value": {
      handler(n) {
        if ((JSON.stringify(this.config) !== '{}' && this.config.component.valueFormat === 'timestamp') || !isNaN(n)) {
          this.dataValue = Number(n);
        } else {
          this.dataValue = n;
        }
        
      }
    }
  },

}
</script>

<style>

</style>