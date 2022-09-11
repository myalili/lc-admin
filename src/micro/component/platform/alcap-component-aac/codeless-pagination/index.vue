<template>
  <div class="custom-pagination-wrap" v-show="total !== 0">
    <span class="total-count">共{{ total }}条</span>
    <div class="custom-pager-right-ctn">
      <el-select
        v-model="pageSizeC"
        placeholder="请选择"
        class="pagesize-select"
        popper-class="pagesize-popver"
        @change="sizeChange"
      >
        <el-option
          v-for="item in pageSizes"
          :key="item"
          :label="item + '条/页'"
          :value="item"
        >
        </el-option>
      </el-select>
      <div class="custom-pager-ctn">
        <el-button
          :disabled="currentPageC === 1"
          class="custom-prev-btn"
          icon="el-icon-arrow-left"
          @click="prevPage"
        ></el-button>
        <el-select
          v-model="currentPageC"
          placeholder="请选择"
          class="pagesize-select"
          popper-class="pagesize-popver"
          @change="pageChange"
        >
          <el-option
            v-for="page in pagerOption"
            :key="page"
            :label="page + '/' + pagerCount"
            :value="page"
          >
            <span style="float: left">{{ page }}</span>
          </el-option>
        </el-select>
        <!-- <el-popover trigger="click" placement="bottom-start" popper-class="custom-page-popover" 
                v-model="visible"
                @hide="hidePagerPop" 
                @show="showPagerPop">
                <el-radio-group v-model="currentPageC" class="pager-group" @change="pageChange">
                    <el-radio-button v-for="page in pagerOption" :label="page" :key="page">{{page}}</el-radio-button>
                </el-radio-group>
                <div slot="reference" class="current-page-wrap">
                    <span class="current-page">{{currentPageC}}/{{pagerCount}}<i class="page-arrow-icon" :class="[arrowClass]"></i></span>
                    </div>
            </el-popover> -->
        <el-button
          :disabled="currentPageC === pagerCount"
          class="custom-next-btn"
          icon="el-icon-arrow-right"
          @click="nextPage"
        ></el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "pagination",
  props: {
    total: {
      type: Number,
      value: 1,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100];
      },
    },
    currentPage: {
      type: Number,
      default() {
        return 1;
      },
    },
    pageSize: {
      type: Number,
      default() {
        return 10;
      },
    },
  },
  data() {
    return {
      arrowClass: "el-icon-arrow-down",
      pageSizeC: 10,
      pageSizesC: [],
      currentPageC: 1,
      pagerOption: [],
      pagerCount: 1,
      visible: false,
      //  totalCount:this.total
    };
  },
  watch: {
    pageSize: {
      handler(val, oldVal) {
        this.pagerOption = [];

        this.pagerCount = Math.ceil(this.total / val);
        this.pagerCount < this.currentPageC &&
          (this.currentPageC = this.pagerCount);
        for (let i = 0; i < this.pagerCount; i++) {
          this.pagerOption.push(i + 1);
        }
      },
      immediate: true
    },
    total: {
      handler(val, oldVal) {
        this.pagerOption = [];
        this.pagerCount = Math.ceil(val / this.pageSizeC);
        this.currentPageC = this.pagerCount > 0 ? this.currentPageC : 0;
        for (let i = 0; i < this.pagerCount; i++) {
          this.pagerOption.push(i + 1);
        }
      },
      immediate: true
    },
  },
  methods: {
    nextPage() {
      ++this.currentPageC;
      this.$emit("current-change", this.currentPageC);
    },
    prevPage() {
      --this.currentPageC;
      this.$emit("current-change", this.currentPageC);
    },
    sizeChange(value) {
      this.currentPageC = 1;
      this.$emit("size-change", value);
    },
    pageChange(page) {
      this.visible = false;

      this.$emit("current-change", page);
    },
    showPagerPop() {
      this.arrowClass = "el-icon-arrow-up";
    },
    hidePagerPop() {
      this.arrowClass = "el-icon-arrow-down";
    },
    // resetCurrentPage(){
    //   this.currentPageC = this.currentPage;
    // }
  },
  mounted() {
    this.currentPageC = this.currentPage;
    this.pageSizeC = this.pageSize;
    this.pageSizesC = this.pageSizes;
  },
};
</script>
<style lang="scss">
.custom-pagination-wrap {
  &:after {
    content: "";
    clear: both;
    display: block;
    height: 0;
    visibility: hidden;
  }
  .total-count {
    float: left;
    color: #7f8c93;
  }
  .custom-pager-right-ctn {
    float: right;
   
    .pagesize-select {
      width:120px;
    }

    .custom-pager-ctn{
       .pagesize-select{
          width:100px;
        }
    }

    .pagesize-select,
    .pagination-select {
      position: relative;
      // width: 94px !important;
      margin-right: -1px;
      vertical-align:bottom;
      z-index: 1;
      .el-input__inner {
        margin-left: -1px;
        height: 24px;
        line-height: 24px;
        color: #333;
        border-color: #c8d0d4;
        &:hover {
          border-color: #374e71;
        }
      }
      .is-focus .el-input__inner {
        border-color: #374e71;
      }
    }
    .el-select__caret {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .custom-pager-ctn {
      display: inline-flex;
      align-items: center;
      margin-left: 10px;
      .pagesize-select {
        .el-input__inner {
          border-radius: 0px;
        }
      }
      .current-page-wrap {
        display: inline-block;
        height: 24px;
        min-width: 56px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(200, 208, 212, 1);
        border-left: 0;
        border-right: 0;
        box-sizing: border-box;
        line-height: 22px;
        padding-left: 8px;
        position: relative;
        padding-right: 22px;
        &:hover {
          cursor: pointer;
        }
        .page-arrow-icon {
          position: absolute;
          right: 8px;
          top: 6px;
        }
        .current-page {
          color: #333;
        }
      }
      .custom-next-btn,
      .custom-prev-btn {
        position: relative;
        width: 24px;
        height: 24px;
        padding: 0;
        background: rgba(255, 255, 255, 1);
        border: 1px solid #c8d0d4 !important;
        border-radius: 0px 4px 4px 0px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        box-sizing: border-box;
        vertical-align: top;
        z-index: 0;
        &:hover {
          cursor: pointer;
          border-color: #374e71 !important;
          color: #374e71 !important;
          &:not(.is-disabled) {
            z-index: 2;
          }
        }
        &:focus,
        &:active {
          color: #374e71;
        }
        &.is-disabled {
          cursor: not-allowed;
          background: #e7ecef !important;
          border-color: #c8d0d4 !important;
          color: #7f8c93 !important;
        }
      }
      .custom-next-btn {
        position: relative;
        margin-left: -1px;
      }
      .custom-prev-btn {
        border-radius: 4px 0px 0px 4px;
        border-right: none !important;
        &:not(.is-disabled) {
          &:hover {
            + .pagesize-select {
              .el-input__inner {
                border-left-color: #374e71;
              }
            }
          }
        }
      }
    }
  }
}
.custom-page-popover {
  width: 66px;
  min-width: 66px;
  //height:150px;
  padding: 0;
  //overflow: auto;
  .pager-group {
    max-height: 150px;
    overflow: auto;
    width: 100%;
    .el-radio-button {
      width: 100%;
      .el-radio-button__inner {
        width: 100%;
        padding: 0 8px;
        text-align: left;
        height: 24px;
        line-height: 24px;
        color: #333;
        border: 0;
        &:hover {
          background-color: #e9f4fa;
        }
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #e9f4fa;
    }
  }
}
.pagesize-popver {
  .el-select-dropdown__item {
    height: 24px;
    line-height: 24px;
    color: #333;
    &.selected {
      background-color: #e9f4fa;
      color: #333;
    }
  }
}
</style>
