<template>
    <el-date-picker
      style="width: 300px"
      type="daterange"
      start-placeholder='开始日期'
      end-placeholder='结束日期'
      v-model="vModel"
      :format="dateFormatList"
      :valueFormat="dateFormatList"
      :picker-options="ranges"
      @change="onChange"
      size="mini"
    />
</template>

<script>
// 数据类型和类型： 绑定值:[] 0为开始日期，1为结束日期, 快捷选项: {} 参考ranges
// import moment from 'moment';
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2ARangeWork',
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
      dataValue: this.value,
      dateFormatList: 'yyyy-MM-DD',
      ranges: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
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
    moment:window.moment,
    onChange(dates, dateStrings) {
      // console.log('dates',dates );
      // console.log('dateStrings', dateStrings);
      this.$emit('change', dates, dateStrings);
    },
  },
  watch: {
    "dataValue": {
      handler(n, o) {
        console.log("dataValue转换后", n);
        if(n && n.toString() !== o.toString()) {
          if (this.$parent.config) {
            this.$parent.config.value = n;
          } else {
            this.$emit('update:value',n );
          }
        }
      }
    },
    "value": {
      handler(n,o) {
        console.log("value转换后", n);
        if (n && n.toString() !== o.toString()) {
          this.dataValue = n;
        }
        
      }
    }
  },

}
</script>

<style>

</style>