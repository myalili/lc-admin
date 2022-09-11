<template>
    <el-date-picker
      style="width: 300px; border-radius: 4px;"
      type="daterange"
      start-placeholder='开始日期'
      end-placeholder='结束日期'
      v-model="vModelFormat"
      :format="dateFormatList"
      valueFormat="timestamp"
      :picker-options="ranges"
      @change="onChange"
      size="mini"
    />
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2ARangePicker',
  props: {
    value: {
      type: Array,
      default: ()=> { 
        return []
      }
    },
  },
  mounted() {
  },
  data() {
    return {
      dataValue: this.value || '',
      dateFormatList: 'yyyy-MM-DD',
      ranges: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
    }
  },
  
  methods: {
    onChange(dates, dateStrings) {
      // console.log(dates, dateStrings);
      this.$emit('change', dates, dateStrings);
    },

    valueGet(val) {
      return JSON.parse(val) || []
    },
    valueSet(val) {
      return JSON.stringify(val)
    },
  },
  watch: {
  },

}
</script>

<style>

</style>