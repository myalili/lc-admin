<template>
  <section class="pagi w-full px-5 flex justify-between items-center" >
    <span class="pagi-total-text">共 {{total}} 条</span>
    <div class="flex flex-center items-center ">
      <div class=" pagi-action" style="margin-right: 10px">
        <el-select @change="sizeChange" size="mini" style="width:95px" v-model="size" placeholder="Select">
          <el-option
            v-for="item in sizerList"
            :key="item.value"
            :label="item + '条 / 页'"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="border h-6 box-border flex flex-center pagi-action-num">
        <div class="pre cursor-pointer w-6 h-6 flex items-center justify-center" :class="{ 'page-change-disabled': preDisabled }">
          <i class="el-icon-arrow-left"></i>
          
        </div>
        <el-select @change="pageChange" size="mini" style="width: 75px;" v-model="pageNum" placeholder="Select">
          <el-option 
            v-for="item in totalPages"
            :key="item"
            :label="'第' + item + '页'"
            :value="item"
          >
          </el-option>
        </el-select>
        <div class="next cursor-pointer w-6 h-6 flex items-center justify-center" :class="{ 'page-change-disabled': nextDisabled }">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props:['total','page'],
  watch: {
    page() {
        this.pageNum = this.page;
    },
  },
  methods:{
      pageChange(){
      this.$emit("numChange", this.pageNum);
      },
      sizeChange(){
      this.pageNum = 1;  
      this.$emit("sizeChange", this.size);
      }
  },
  computed:{
      totalPages(){
          return Math.ceil(this.total/this.size);
      },
      preDisabled() {
        return this.pageNum === 1;
      },
      nextDisabled() {
        return this.pageNum === this.totalPages;
      },
  },
  data() {
    return {
      size: 10,
      pageNum:1,
      sizerList: [10, 15, 30],
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
        {
          value: "Option2",
          label: "Option2",
        },
        {
          value: "Option3",
          label: "Option3",
        },
        {
          value: "Option4",
          label: "Option4",
        },
        {
          value: "Option5",
          label: "Option5",
        },
      ],
      value: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.sizer {
  padding: 5px;
  margin-right: 7px;
  //   height: 40px;
}
.pre {
  border-right: 1px solid #C8D0D4;
}
.next {
  border-left: 1px solid #C8D0D4;
}
.pagi-action {
  position: relative;
  ::v-deep .el-input__inner {
    border: 1px solid #C8D0D4;
    height: 24px;
  }
  ::v-deep .el-input--mini .el-input__icon {
    line-height: 24px;
  }
}
.pagi-action-num {
  position: relative;
  ::v-deep .el-input__inner {
    border: none;
    height: 22px;
    padding-left: 8px
  }
  ::v-deep .el-input--mini .el-input__icon {
    line-height: 22px;
  }
}
.page-change-disabled {
  cursor: not-allowed;
  background: rgba(231, 236, 239, 0.39);
}

.border {
  border: 1px solid #c8d0d4;
  border-radius: 6px;
  letter-spacing: 2px;
}
.poper {
  padding: 0;
  color: red !important;
}

.pagi {
  .pagi-total-text {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 24px;
    color: #7F8C93;
  }
}
</style>