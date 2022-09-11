<template>
  <div style="width: 400px">
    <el-input
     style="width:100%"
     size="small"
      v-model="value"
      v-if="
        [
          'equals',
          'notEquals',
          'greaterThan',
          'equalsOrGreaterThan',
          'lessThan',
          'equalsOrLessThan',
          'like',
          'notLike',
        ].includes(from) && type !== 'time'
      "
    ></el-input>
    <el-date-picker
     style="width:100%"
     size="small"
      v-show="
        [
          'equals',
          'notEquals',
          'greaterThan',
          'equalsOrGreaterThan',
          'lessThan',
          'equalsOrLessThan',
          'like',
          'notLike',
        ].includes(from) && type === 'time'
      "
      v-model="value"
      type="datetime"
      placeholder="选择时间"
    >
    </el-date-picker>
    <div  style="width:100%" class="flex flex-center" v-if="from === 'range' && type !== 'time'">
      <el-input v-model="range1"> </el-input> ~ <el-input v-model="range2"> </el-input>
    </div>
    <el-date-picker
    size="small"
     v-model="range"
     style="width:100%"
      v-show="from === 'range' && type === 'time'"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="To"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      align="right"
    >
    </el-date-picker>
      <div class="many-inputs-box" v-if="['in','notIn'].includes(from)">
         <input type="text" @keypress.enter="addInput" @keyup.8="removeInput" v-model="word" placeholder="添加筛选值">
         <span v-for="(item,i) in inputList" :key="i"> {{item}} </span>
      </div>
  </div>
</template>

<script>
export default {
  props: ["from", "type","filterValue"],
  watch:{
      range1(){
        this.$emit('value',[this.range1||'',this.range2||''])
      },
      range2(){
        this.$emit('value',[this.range1||'',this.range2||''])
      },
      value(){
          console.log(this.value);
          this.$emit('value',this.value)
      },
      range(){
          console.log(this.range);
          this.$emit('value',this.range)
      },
      filterValue(){
          console.log(this.filterValue);
          if(Array.isArray(this.filterValue)){
              this.range = this.filterValue
          }else{
              this.value = this.filterValue
          }
      }
  },
  methods:{
    addInput(){
      this.inputList.unshift(this.word)
      this.word = ''
      this.$emit('value',this.inputList)
    },
    removeInput(e){
      if(this.word === ''){
        this.inputList.shift()
        this.$emit('value',this.inputList)
      }
    }
  },
  created(){
         if(Array.isArray(this.filterValue)){
              if(['in','notIn'].includes(this.from)){
                this.inputList = this.filterValue
              }else{
                if(this.type === 'time'){
                this.range = this.filterValue
                }else{
                  this.range1 = this.filterValue[0]
                  this.range2 = this.filterValue[1]
                }
              }
          }else{
              this.value = this.filterValue
          }
  },
  data() {
    return {
      value: "",
      word:"",
      range:[],
      range1:'',
      range2:'',
      inputList:[],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: "",
    };
  },
};
</script>

<style lang="scss" scoped>
  .many-inputs-box{
    border:1px solid #D9D9D9;;
    height: 32px;
    width: 100%;
    display: flex;
    overflow: hidden;
    align-items: center;
    border-radius: 2px;
    input{
      border: 1px dashed #91A1B7;
      padding: 4px;
      margin: 0 3px;
      height: 26px;
    }
    span{
      padding: 4px;
      margin: 0 3px;
      background: #E5F2FB;
      border-radius: 4px;
      white-space: nowrap;
    }
  }
</style>