<template>
  <div>
    <el-popover
      trigger="manual"
      v-model="visible"
      popper-class="multiple-search-select-popper"
    >
      <div
        class="multiple-search-select el-select"
        :id="selectId"
        slot="reference"
        @click="visible = !visible"
      >
        <div class="el-select__tags">
          <drag-down
            v-for="(item, index) in selectedList"
            :key="index + '-selectedList'"
            :info="item"
            :config.sync = "configAry"
            v-bind="$attrs"
            @removeItem="selectItem(item)"
            @changeShowName="changeShowName(index)"
          >
          </drag-down>
        </div>
        <div
          class="el-input el-input--suffix"
          :class="{ 'is-focus': selecting }"
        >
          <input
            tabindex="-1"
            type="text"
            readonly="readonly"
            autocomplete="off"
            :placeholder="selectedList.length == 0 ? '请选择' : ''"
            class="el-input__inner select-input"
            :id="selectId + 'Input'"
            style="height: 40px"
          />
          <span
            class="el-input__suffix"
            @mouseover="handleHoverIcon(true)"
            @mouseleave="handleHoverIcon(false)"
            ><span class="el-input__suffix-inner"
              ><i
                v-show="!showEmptyIcon"
                :class="{
                  'is-reverse': visible,
                  'el-select__caret el-input__icon el-icon-arrow-up': true,
                }"
              ></i>
              <i
                v-show="selectedList.length != 0 && showEmptyIcon"
                @click="empty"
                class="el-select__caret el-input__icon el-icon-circle-close"
              ></i></span
          ></span>
        </div>
      </div>

      <div class="search-ul-wrap">
        <div class="el-scrollbar">
          <div class="el-select-dropdown__wrap el-scrollbar__wrap">
            <ul class="el-scrollbar__view el-select-dropdown__list">
              <li
                :class="{
                  'el-select-dropdown__item': true,
                  selected: values.indexOf(item.value) != -1,
                }"
                v-for="(item, index) in optionList"
                @click="selectItem(item)"
                :key="index + '-optionList'"
              >
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-popover>

    <el-popover
      placement="top"
      width="180"
      trigger="manual"
      v-model="inputVisible">
        <!-- <div v-if="showNameIndex >= 0 && configAry">原名: {{ defaultName }}</div> -->
        <el-input size="small" v-model="inputValue" style="marign-top:10px"></el-input>
        <div class="btn-box">
          <el-button slot="reference" size="mini" @click="inputVisible = !inputVisible" >取消</el-button>
          <el-button slot="reference" size="mini" @click="handleShowName">确认</el-button>
        </div>
    </el-popover>

  </div>
</template>

<script>
import dragDown from "./dragDown";
export default {
  components: { dragDown },
  name: "MultipleSearchSelect",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    userSelectedList: {
      type: Array,
      default: () => [],
    },
    chartType: {
      type: String,
      default: () => '',
    }
  },
  model: {
    event: "updateValue",
    prop: 'userSelectedList',
  },
  data: () => ({
    visible: false, //下拉展示隐藏状态
    showEmptyIcon: false, //清空选择图标的展示隐藏状态
    selectedList: [], //本组件的已选项
    optionList: [], //本组件的选项
    values: [], //纯数组:已选
    selectId: Math.ceil(Math.random() * 10000), //本组件唯一ID
    selecting: false, //正在选择状态
    isShow: 0,
    configAry:[],
    userConfig: {
      id: '',
      name: '',
      showName: '',
      value: '',
      sort: 'default', //排序
      duplicate: 'summary', //去重
      compute: 'default', //高级计算
    },
    inputVisible: false,
    inputValue: '', //输入框数值
    showNameIndex: 0
  }),
  watch: {
    chartType: {
      immediate: true,
      handler(val) {
        // if(val === 'pie') {
          
        // } else {
        //   if(this.selectedList.length > 2)
        // }
      }
    },
    // 根据已选，筛选纯数组
    copySelectedLists: {
      immediate: true,
      deep: true,
      handler(val, old) {
        this.setConfigAry(val, val.length - old.length)
        this.values = val.map((item) => {
          return item.value;
        });
      }
    },
    userSelectedList:{
      handler(val){
        console.log('val' ,val);
      }
    },
    options: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.optionList = val;
      }
    },
    configAry: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('------');
        console.log(val);
        // this.setConfigAry(val)
        this.$emit("updateValue", val);
      }
    }
  },
  computed: {
    defaultName() {
      return this.configAry[this.showNameIndex].name
    },
    copySelectedLists() {
      return JSON.parse(JSON.stringify(this.selectedList));
    }
  },
  mounted() {
    const t = this;
    this.isShow = -1;
    this.selectedList = this.userSelectedList;
    this.optionList = this.options;

    // 外部点击事件
    const dropdown = document.getElementById(this.selectId);
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!dropdown || !dropdown.childNodes) return;
      if (target === dropdown.children || dropdown.contains(target)) {
        return;
      }
      t.visible = false;
      document.getElementById(t.selectId + "Input") &&
        document.getElementById(t.selectId + "Input").blur();
      t.selecting = false;
    });
    //TODO @XY 下拉器宽度
    // console.log(document.getElementById(t.selectId + 'Input').offsetWidth)
  },
  methods: {
    handleHoverIcon(sign) {
      this.showEmptyIcon = sign ? this.selectedList.length != 0 : sign;
      if (!this.visible) {
        document.getElementById(this.selectId + "Input").blur();
        this.selecting = false;
      }
    },
    //全部清空
    empty() {
      this.selectedList.splice(0, this.selectedList.length);
    },
    // 选单个
    selectItem(selectedItem) {
      document.getElementById(this.selectId + "Input").focus();
      this.selecting = true;
      //   改变已选数组
      if (this.values.indexOf(selectedItem.value) === -1) {
        this.selectedList.push(selectedItem);
      } else {
        this.selectedList.splice(this.values.indexOf(selectedItem.value), 1);
      }
      //如果是搜索后点击，则触发清空搜索，节省用户操作（参照element的交互）
      if (this.searchValue != "") this.searchValue = "";
    },
    showToggle(index) {
      this.isShow = index;
    },
    handleHide() {
      this.isShow = !this.isShow;
    },
    setConfigAry(val, res) {
      if(val && this.configAry.length === 0) {
        val.forEach(item => {
          let config = JSON.parse(JSON.stringify(this.userConfig))
          config.id = item.value
          config.value = item.value
          config.name = item.name
          this.configAry.push(config)
        });
      } else {
        if(res > 0) {
            let copy = JSON.parse(JSON.stringify(this.configAry))
            // this.configAry = []
          val.forEach(i => {
            copy.forEach(s =>{
              let config = JSON.parse(JSON.stringify(this.userConfig))
              if(i.value !== s.value) {
                config.id = i.value
                config.value = i.value
                config.name = i.name
                this.configAry.push(config)
              }
            })
          })
        } else {
          if(val.length === 0) {
            this.configAry = []
          } else {
            let newConfig = this.configAry.filter(item => 
              val.some( ele=> ele.value  ===item.value
              ));
            this.configAry = newConfig
          }
        }
      }
    },
    changeShowName(val){
      this.inputVisible = !this.inputVisible;
      this.showNameIndex = val
    },
    handleShowName() {
      this.configAry[this.showNameIndex].showName = this.inputValue
      this.inputValue = ''
      this.inputVisible = false
    }
  },
};
</script>
<style scoped lang="less">
.multiple-search-select {
  .el-select__tags {
    // flex-wrap: nowrap;
    z-index: 999;
  }
  .el-input__inner {
    padding-right: 5px;
    cursor: pointer;
    .el-select__caret {
      float: right;
      color: #c0c4cc;
      font-size: 14px;
      -webkit-transition: -webkit-transform 0.3s;
      transition: -webkit-transform 0.3s;
      -o-transition: transform 0.3s;
      transition: transform 0.3s;
      transition: transform 0.3s, -webkit-transform 0.3s;
      transition: transform 0.3s, -webkit-transform 0.3s;
      -webkit-transform: rotateZ(180deg);
      -ms-transform: rotate(180deg);
      transform: rotateZ(180deg);
      cursor: pointer;
    }
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #f5f7fa;
    color: #606266;
  }
}
.search-ul-wrap {
  .el-input__inner {
    margin-right: 8px;
    width: 94%;
  }
}
.selected {
  color: var(--color-primary);
  &:after {
    position: absolute;
    right: 20px;
    font-family: element-icons;
    content: "\E6DA";
    font-size: 12px;
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
  }
}
.el-tag.el-tag--info {
  margin-right: 2px;
  display: flex;
  justify-content: space-between;
}
.close-icon {
  position: absolute;
  right: 10px;
  top: 0;
  color: #c0c4cc;
  cursor: pointer;
}

&::-webkit-scrollbar-track-piece {
  background: unset;
}
&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
&::-webkit-scrollbar-thumb {
  transition: 0.3s background-color;
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 20px;
  width: 6px;
  height: 6px;
}
.el-dropdown-menu__item {
  padding-left: 5px;
}
.btn-box{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
