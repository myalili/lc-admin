<template>
  <div class="cst-search-component">
    <div class="cst-search-ctn">
      <i class="aupIconfont aupiconsearch search-icon"></i>
      <div
        class="cst-search-ctt"
        v-on:keyup.enter="
          submitSearchItem(searchItemKey, searchItemName, searchItemValue)
        "
      >
        <span
          v-for="(item, index) in searchLists"
          :key="index"
          class="cst-search-reslut-item"
          ><i
            class="icon icon-public-jingque accurate"
            v-if="item.isAccurateSearch"
          ></i>
          <span>{{ item.searchItem }}:</span>
          <span>{{ item.searchValue }}</span>
          <i class="el-icon-close close" @click="removeSearchResult(item)"></i>
        </span>
        <span
          class="cst-search-reslut-item cst-search-accurate"
          v-if="searchItemName && !notNeedSearchType"
        >
          <el-checkbox v-model="accurateChecked"
            >精确匹配
            <el-tooltip
              class="item"
              effect="dark"
              content="勾选后为精确匹配，不勾选则为模糊匹配"
              placement="top"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </el-checkbox>
        </span>
        <div class="select-ctn" v-on:keyup.delete="focusDelete">
          <div class="select-input">
            <span class="cst-current-item" v-if="searchItemName"
              >{{ searchItemName }}:</span
            >
            <el-input
              type="text"
              placeholder="请输入条件，然后按回车键查询数据"
              v-model="searchItemValue"
              ref="refSearchItemValue"
              v-if="!inputVisible"
              @focus="showOption = true"
            ></el-input>

            <el-select
              v-model="searchItemValue"
              v-if="searchItemType === 'select'"
              class="select-value-input"
              placeholder="请选择下拉框选项，然后按回车键查询数据"
              @change="submitSearchItem(searchItemKey, searchItemName, searchItemValue)"
            >
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :value="isSelectGetValue ? item.value : item.label"
                :label="item.label"
              ></el-option>
            </el-select>
            <div v-if="searchItemType === 'section'" class="section-ctn">
              <el-input
                v-model="sectionStart"
                @blur="checkCount($event, 'sectionStartIsCount')"
                :class="{ notCount: sectionStartIsCount }"
                clearable
              ></el-input>
              <span>-</span>
              <el-input
                v-model="sectionEnd"
                @blur="checkCount($event, 'sectionEndIsCount')"
                :class="{ notCount: sectionEndIsCount }"
                clearable
              ></el-input>
            </div>
          </div>
          <ul v-if="showOption && searchItemNameOptionsUse.length > 0">
            <li
              v-for="(item, index) in searchItemNameOptionsUse"
              :key="item.key + index"
              @click="selectItem(item)"
            >
              {{ item.value }}
            </li>
          </ul>
        </div>
      </div>
      <i
        class="el-icon-close close-icon"
        v-if="searchLists.length > 0"
        @click="removeAllSearchResult"
      ></i>
      <div class="cst-search-type" v-if="queryTypeVisible">
        <el-select v-model="queryType" @change="queryTypeChange">
          <el-option
            key="match_phrase"
            label="精确匹配"
            value="match_phrase"
          ></el-option>
          <el-option key="match" label="模糊匹配" value="match"></el-option>
        </el-select>
      </div>
    </div>
    <div
      v-if="searchItemType === 'date'"
      class="search-time-ctn search-detail-ctn"
    >
      <div>
        <div class="grayColor">选择时间范围</div>
        <ul>
          <li
            v-for="(value, key) in timeRange"
            :key="key"
            @click="selectRange(value, key)"
            :class="key === selectRangeKey ? 'active' : ''"
          >
            {{ value }}
          </li>
        </ul>
      </div>
      <div class="search-date-ctn">
        <div class="label grayColor">自定义时间范围</div>
        <el-date-picker
          v-model="searchDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <div style="margin-top:10px;">
          <el-button
            type="primary"
            @click="getSelectTime"
            :disabled="!(selectRangeKey || searchDate)"
            >确定</el-button
          >
          <el-button @click="resetTime">取消</el-button>
        </div>
      </div>
    </div>
    <slot v-if="searchItemName === '时间范围'"></slot>
  </div>
</template>

<script>
// import moment from "moment";
export default {
  name:"search",
  components: {},
  props: {
    // 下拉绑定的为value还是label，默认label
    isSelectGetValue: {
      type: Boolean,
      default() {
        return false;
      }
    },
    searchItemNameOptions: {
      type: Array,
      default() {
        //return {};
        return [];
      }
    },
    isRepeatSearch: {
      type: Boolean,
      default() {
        return false;
      }
    },
    queryTypeVisible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      accurateChecked: false,
      searchItemNameOptionsCopy: [],
      searchItemNameOptionsUse: [],
      queryType: "match_phrase", //匹配模式
      searchDate: "", //自定义时间段范围
      selectRangeItem: "", //选择时间范围
      selectRangeKey: "",
      searchItemValue: "", //搜索框输入内容
      searchLists: [], //搜索项集合
      searchItemName: "", //选择的搜索项名称
      notNeedSearchType: false, //单个搜索项是否需要精确模糊搜索模式
      notAllowMultiple:true,//单个搜索项是否为多选，默认为多选状态
      searchItemType: "", //选择的搜索项类型，是input框类型，select框类型，日期类型，区间类型等
      selectOptions: [],
      inputVisible: false, //输入框的可编辑性
      sectionStart: undefined,
      sectionEnd: undefined,
      searchItemKey: "",
      timeRange: {
        "10|m": "最近 10 分钟",
        "30|m": "最近 30 分钟",
        "1|h": "最近 1 小时",
        "2|h": "最近 2 小时",
        "3|h": "最近 3 小时",
        "5|h": "最近 5 小时",
        "10|h": "最近 10 小时",
        "1|d": "最近 1 天",
        "3|d": "最近 3 天",
        "7|d": "最近 一 周"
      },
      showOption: false, //显示搜索下拉框
      deleteSearchItemName: true,
      deleteSearchListItem: false,
      sectionStartIsCount: false, //校验失败时控制样式
      sectionEndIsCount: false //校验失败时控制样式
    };
  },
  methods: {
    //确定单个搜索项
    submitSearchItem(itemKey, itemName, itemValue, startTime, endTime) {
      let self = this;
      if (!itemKey && !!itemValue) {
        itemName = "关键字";
        itemKey = "log";
        this.accurateChecked = false;
      }
      if (
        itemKey &&
        (!!itemValue ||
          !!startTime ||
          !!endTime ||
          (!!this.sectionStart && !!this.sectionEnd))
      ) {
        //如果此搜索项不为多选，先删除前面的选择，再添加后面的选择
        if(this.notAllowMultiple){
          let self = this;
          this.searchLists.forEach(element => {
            if(element.searchKey === itemKey){
              this.searchLists.splice(self.searchLists.indexOf(element), 1)
            }
          })
        }
        //单项选择
        let defalutSearchListItem = {
          isAccurateSearch: !self.notNeedSearchType && self.accurateChecked, //是否为精确搜索项
          searchItem: itemName,
          searchKey: itemKey,
          searchValue: itemValue,
          startTime: startTime,
          endTime: endTime,
          sectionStart: undefined,
          sectionEnd: undefined
        };
        if (!this.isRepeatSearch) {
          this.searchLists.forEach((element, index) => {
            if (element.searchKey === itemKey) {
              self.searchLists.splice(index, 1);
            }
          });
        }
        if (this.searchItemType === "section") {
          defalutSearchListItem.sectionStart = this.sectionStart;
          defalutSearchListItem.sectionEnd = this.sectionEnd;
          defalutSearchListItem.searchValue =
            this.sectionStart + "~" + this.sectionEnd;
        }
        this.searchLists.push(defalutSearchListItem);

        this.removeOption();
        this.searchItemName = undefined;
        this.searchItemKey = undefined;
        this.searchItemValue = "";
        this.searchItemType = "";
        this.sectionStart = undefined;
        this.sectionEnd = undefined;
        this.inputVisible = false;
        this.accurateChecked = true;
      }
      //搜索
      this.$emit("update-search", this.searchLists, this.queryType);
      this.$refs.refSearchItemValue && this.$refs.refSearchItemValue.focus();
    },
    //选择搜索时间项
    selectRange(value, key) {
      this.selectRangeItem = value;
      this.selectRangeKey = key;
    },
    queryTypeChange() {
      this.$emit("update-search", this.searchLists, this.queryType);
    },
    //获取时间范围
    getSelectTime() {
      let date = "",
        time,
        startTime,
        endTime;
      if (this.searchDate) {
        startTime = window.moment(this.searchDate[0]).valueOf();
        endTime = window.moment(this.searchDate[1]).valueOf();
        date =
          window.moment(this.searchDate[0]).format("YYYY-MM-DD HH:mm:ss") +
          "~" +
          window.moment(this.searchDate[1]).format("YYYY-MM-DD HH:mm:ss");
      } else if (this.selectRangeKey) {
        endTime = window.moment().valueOf();
        let array = this.selectRangeKey.split("|");
        startTime = window.moment()
          .subtract(array[0], array[1])
          .valueOf();
      }
      time = date ? date : this.selectRangeItem;
      if (time) {
        this.searchLists.forEach(element => {
          if (element.searchKey === "timeLimit") {
            this.removeSearchResult(element);
          }
        });
        this.submitSearchItem(
          this.searchItemKey,
          this.searchItemName,
          time,
          startTime,
          endTime
        );
        this.resetTime();
      }
      this.removeOption();
      this.showOption = true;
      this.searchItemType = "";
      this.inputVisible = false;
      if (this.$refs.refSearchItemValue) {
        this.$refs.refSearchItemValue.blur();
      }
    },
    //取消时间范围
    resetTime() {
      this.resetOption();
      this.searchDate = undefined;
      this.selectRangeItem = "";
      this.selectRangeKey = "";
      this.searchItemName = undefined;
      this.searchItemKey = undefined;
      this.showOption = true;
      this.searchItemType = "";
      this.inputVisible = false;
    },
    //删除搜索项
    removeSearchResult(item) {
      let form = this.searchLists,
        index = form.indexOf(item);
      if (index !== -1) {
        this.searchLists.splice(index, 1);
      }
      this.$emit("update-search", this.searchLists);
      this.resetOption();
      if (item.startTime) {
        this.searchDate = undefined;
        this.selectRangeItem = "";
      }
    },
    //单选情况下选了一个搜索项后，把搜索项从下拉框中移除
    removeOption() {
      if (!this.isRepeatSearch) {
        let self = this;
        this.searchItemNameOptionsUse.forEach((element, index) => {
          if (element.value === self.searchItemName) {
            self.searchItemNameOptionsUse.splice(index, 1);
          }
        });
      }
    },
    //删除搜索项后在下拉框中回填搜索项
    resetOption() {
      if (!this.isRepeatSearch) {
        let searchItemNameOptionsReset = JSON.parse(
          JSON.stringify(this.searchItemNameOptionsCopy)
        );
        this.searchLists.forEach(element => {
          searchItemNameOptionsReset.forEach((obj, index) => {
            if (element.searchItem === obj.value) {
              searchItemNameOptionsReset.splice(index, 1);
            }
          });
        });
        this.searchItemNameOptionsUse = searchItemNameOptionsReset;
      }
    },
    removeAllSearchResult() {
      this.searchLists.splice(0);
      this.$emit("update-search", this.searchLists, this.queryType);
      this.searchItemType = "";
      this.inputVisible = false;
      this.searchItemName = undefined;
      this.searchItemKey = undefined;
      this.searchItemValue = "";
      this.searchItemNameOptionsUse = JSON.parse(
        JSON.stringify(this.searchItemNameOptionsCopy)
      );
    },
    //选择搜索项
    selectItem(item) {
      this.searchItemType = item.type;
      this.searchItemName = item.value;
      this.searchItemKey = item.key;
      item.notNeedSearchType
        ? (this.notNeedSearchType = item.notNeedSearchType)
        : (this.notNeedSearchType = false);
      item.notAllowMultiple? (this.notAllowMultiple = item.notAllowMultiple)
        : (this.notAllowMultiple = false);
      this.$refs.refSearchItemValue.focus();
      if (item.type !== "input") {
        this.showOption = false;
      }
      if (item.type === "select") {
        this.selectOptions = item.options;
      }
      this.searchItemType === "input"
        ? (this.inputVisible = false)
        : (this.inputVisible = true);
    },
    //输入框为focus状态下，可按取消键取消条件
    focusDelete() {
      if (this.showOption) {
        let length = this.$refs.refSearchItemValue.value.length;
        if (length > 0) {
          this.deleteSearchListItem = false;
        }
        if (this.deleteSearchItemName && this.searchItemName && length === 0) {
          this.searchItemName = "";
          this.deleteSearchListItem = false;
        }
        if (this.searchItemName && length === 0) {
          this.deleteSearchItemName = true;
        } else if (
          this.searchLists.length > 0 &&
          this.deleteSearchListItem &&
          length === 0
        ) {
          this.removeSearchResult(
            this.searchLists[this.searchLists.length - 1]
          );
          this.resetOption();
        }
        if (length === 0) {
          this.deleteSearchListItem = true;
        }
      }
    },
    //校验整数
    checkCount(event, isCount) {
      var value = event.target.value;
      if (!/^([-+]?)[1-9][0-9]*$/.test(value)) {
        this[isCount] = true;
      } else {
        this[isCount] = false;
      }
    },
    switchSearchItemNameOptions(val) {
      this.searchItemNameOptionsCopy = JSON.parse(JSON.stringify(val));
      this.searchItemNameOptionsUse = JSON.parse(JSON.stringify(val));
    }
  },
  mounted() {
    //点击下拉框之外收起下拉框
    let self = this;
    document.addEventListener("click", e => {
      if (!self.$el.contains(e.target)) {
        self.showOption = false;
      }
    });
    this.searchItemNameOptionsCopy = JSON.parse(
      JSON.stringify(this.searchItemNameOptions)
    );
    this.searchItemNameOptionsUse = JSON.parse(
      JSON.stringify(this.searchItemNameOptions)
    );
  },
  watch: {
    searchItemValue() {
      if (this.searchItemValue.length > 0) {
        this.deleteSearchItemName = false;
      }
    }
  }
};
</script>

<style lang="scss">
.cst-search-component {
  $height: 28px;
  margin: 0 auto;
  position: relative;
  font-size: 12px;
  .cst-search-ctn {
    display: flex;
    width: 100%;
    min-height: $height;
    border: 1px solid #ebeef5;
    border-radius: 18px;
    background: #ffffff;
    align-items: center;
    > i {
      margin-left: 14px;
      color: #C0C4CC;
    }
    .close-icon {
      padding: 4px;
      margin-right: 8px;
      border-radius: 18px;
      color: #fff;
      background: #a9bdc7;
      transform: scale(0.9);
      cursor: pointer;
    }
    .cst-search-ctt {
      position: relative;
      padding: 0 10px;
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > .cst-search-reslut-item {
        margin-right: 10px;
        margin-top: 2px;
        margin-bottom: 2px;
        padding: 3px 10px;
        border-radius: $height;
        display: inline-block;
        color: #fff;
        background-color: #357aa0;
        > span {
          margin-right: 4px;
        }
        > i {
          font-size: 12px;
          cursor: pointer;
          + span {
            margin-left: 6px;
          }
          &.accurate {
            padding-right: 6px;
            border-right: 1px solid #83a6bb;
          }
          &.close {
            color: #c6dae6;
          }
        }
      }
      > .cst-search-accurate {
        padding: 2px 8px 2px 12px;
        border-radius: $height 0 0 $height;
        .el-checkbox {
          color: #fff;
          font-weight: normal;
          .el-checkbox__inner {
            width: 12px;
            height: 12px;
            border-color: #fff;
            background-color: transparent;
            &::after {
              top: 0;
              left: 3px;
            }
          }
          .el-checkbox__label {
            padding-left: 4px;
            i {
              margin-left: 2px;
            }
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #fff;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: transparent;
            border-color: #fff;
          }
        }
      }
      > .select-ctn > .select-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        > .el-input {
          height: $height;
          line-height: $height;
          z-index: 1;
          flex: 1;
          > .el-input__inner {
            padding-left: 4px;
            height: $height;
            line-height: $height;
            border: none;
            background-color: #ffffff;
            color: #606266;
            cursor: default;
          }
        }
        > .select-value-input {
          input {
            border: none;
            height: $height;
          }
        }
        > .cst-current-item {
          flex: none;
          line-height: $height;
        }
      }
    }
    //选择搜索项样式
    .select-ctn {
      position: relative;
      height: $height;
      flex: 1;
      min-width: 150px;
      > ul {
        position: absolute;
        width: 300px;
        left: 0;
        top: $height;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #e4e7ed;
        z-index: 1000;
        > li {
          height: 30px;
          padding: 0 20px;
          line-height: 30px;
          list-style: none;
          cursor: pointer;
          &:hover {
            background-color: #f5f7fa;
          }
        }
      }
    }
    .cst-search-type {
      > .el-select {
        height: $height;
        width: 100px;
        .el-input__inner {
          height: $height;
          border-radius: 0;
          border-color: transparent transparent transparent #ebeef5;
        }
      }
    }
  }
  .search-detail-ctn {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: 10px;
    min-width: 670px;
    padding: 10px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 3px 8px #33333324;
    z-index: 1000;
  }
  //区间值样式
  .section-ctn {
    $inputHeight: 26px;
    display: flex;
    align-items: center;
    padding-left: 4px;
    input {
      height: $inputHeight;
      line-height: $inputHeight;
    }
    > span {
      padding: 0 10px;
    }
  }
  //时间范围样式
  .search-time-ctn {
    display: flex;
    ul {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 250px;
      height: 160px;
      li {
        list-style: none;
        line-height: 2.6;
        width: 70px;
        cursor: pointer;
        &.active {
          color: #04bebd;
        }
      }
    }
    .search-date-ctn {
      > .label {
        margin-bottom: 6px;
      }
    }
  }
  //数字校验
  .notCount {
    position: relative;
    &::before {
      position: absolute;
      content: "必须是整数！";
      left: 0;
      top: 30px;
      color: #f12626;
    }
    input {
      border-color: #f12626;
    }
  }
}
</style>
