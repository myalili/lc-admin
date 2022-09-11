<template>
  <div class="h-full">
    <div
      v-if="table"
      @click="
        show1 = false;
        show2 = false;
      "
      class="flex"
      style="height: 100%"
    >
      <div class="border-right group-box">
        <p>分组字段</p>
        <div style="position: relative">
          <a @click.stop="show1 = true"
            ><i class="el-icon-plus"></i> 添加分组字段</a
          >
          <div @click.stop="" v-show="show1" class="group-selecte-box">
            <div
              @click="addGroupList(item)"
              v-for="(item,i) in groupList"
              :key="i"
              class="group-select-list"
              :class="{ 'checked-item': item.checked }"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="dimension-list">
          <div
            class="dimension-item"
            v-for="(item,i) in checkedGroupList"
            :key="i"
          >
            <el-input size="small" :value="item.label"></el-input>
            <i
              style="cursor: pointer"
              @click="removeGroupList(item)"
              class="el-icon-delete"
            ></i>
          </div>
        </div>
      </div>
      <div class="group-box">
        <p>添加汇总字段</p>
        <div style="position: relative">
          <a @click.stop="show2 = true">
            <i class="el-icon-plus"></i> 添加汇总字段</a
          >
          <div @click.stop="" v-show="show2" class="group-selecte-box">
            <div
              @click="addGroupList(item)"
              v-for="(item,i) in calList"
              :key="i"
              class="group-select-list"
              :class="{ 'checked-item': item.checked }"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="dimension-list">
          <div
            class="dimension-item"
            v-for="(item,i) in checkedCalList"
            :key="i"
          >
            <el-input size="small" :value="item.label"></el-input>

            <div class="combo-value"  @click="showPanel($event,item)">
              {{ item.summaryMethod.label }}
              <div class="selector"  :style="{ left: left, top: bottom }" v-show="item.showPanel">
                <div
                  @click.stop="chooseMethod(item, method)"
                  class="selector-item"
                  v-for="(method,i) in summaryMethod"
                  :key="i"
                >
                  {{ method.label }}
                </div>
              </div>
            </div>
            <i
              style="cursor: pointer"
              class="el-icon-delete"
              @click="removeCalList(item)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-center error-text" style="height: 100%">
      请将一个已配置好的节点接连至本节点
    </div>
  </div>
</template>

<script>
export default {
  props: ["selectNode"],
  data() {
    return {
      show1: false,
      show2: false,
      screenType: "all",
      groupList: [],
      bottom:0,
      left:0,
      calList: [],
      summaryMethod: [
        { label: "求和", value: "sum" },
        { label: "计数", value: "count" },
        { label: "去重计数", value: "distinctCount" },
        { label: "最大值", value: "max" },
        { label: "最小值", value: "min" },
        { label: "平均值", value: "avg" },
      ],
    };
  },
  methods: {
    chooseMethod(item, method) {
      item.summaryMethod = method;
      item.showPanel = false;
      this.calList = JSON.parse(JSON.stringify(this.calList));
      this.setBindset();
    },
    showPanel(e,item) {
      this.calList.forEach((item) => (item.showPanel = false));
      item.showPanel = true;
      this.calList = JSON.parse(JSON.stringify(this.calList));
      const pos = e.target.getBoundingClientRect();
      this.bottom = pos.top - 130 + "px";
      this.left = pos.left + "px";
      this.setBindSet();
    },
    
    addCalList(item) {
      item.checked = true;
      this.calList = JSON.parse(JSON.stringify(this.calList));
      this.setBindset();
    },
    removeCalList(item) {
      item.checked = false;
      this.calList = JSON.parse(JSON.stringify(this.calList));
      this.setBindset();
    },
    addGroupList(item) {
      item.checked = true;
      this.groupList = JSON.parse(JSON.stringify(this.groupList));
      this.setBindset();
    },
    removeGroupList(item) {
      item.checked = false;
      this.groupList = JSON.parse(JSON.stringify(this.groupList));
      this.setBindset();
    },
    setBindset() {
      let groupByList = this.checkedGroupList.map((item) => {
        return {
          name: item.alias || item.value,
          alias: item.alias,
        };
      });
      let summaryList = this.checkedCalList.map((item, i) => {
        return {
          name: item.alias || item.value,
          alias: (item.alias || item.value) + "-" + item.summaryMethod.value,
          summaryMethod: item.summaryMethod.value,
        };
      });
      this.selectNode.setBindSet({
        groupByList,
        summaryList,
        vueData: {
          groupList: this.groupList,
          calList: this.calList,
        },
      });
      let table = {
        name: this.selectNode.tables[0].name + "-汇总",
        schema: [
          ...this.checkedGroupList.map((item) => {
            return {
              label: item.label,
              value: item.alias || item.value,
              type: item.type,
            };
          }),
          ...this.checkedCalList.map((item) => {
            return {
              label: item.label + `(${item.summaryMethod.value})`,
              value:
                (item.alias || item.value) + "-" + item.summaryMethod.value,
              groupBy: item.value,
              alias:
                (item.alias || item.value) + "-" + item.summaryMethod.value,
              type: "number",
            };
          }),
        ],
      };
      this.selectNode.setBindTable(table);
    },
  },
  computed: {
    checkedGroupList() {
      return this.groupList.filter((item) => item.checked);
    },
    checkedCalList() {
      return this.calList.filter((item) => item.checked);
    },
    table() {
      if (this.selectNode.tables.length) {
        return this.selectNode.tables[0];
      } else {
        return null;
      }
    },
  },
  created() {
    console.log(this.selectNode);
    if (this.selectNode.tables.length) {
      let table = this.selectNode.tables[0];
      let groupList = table.schema;
      let calList = JSON.parse(JSON.stringify(table.schema));
      calList.forEach((item) => {
        item.checked = false;
        item.showPanel = false;
        item.summaryMethod = {
          label: "计数",
          value: "count",
        };
      });
      groupList.forEach((item) => (item.checked = false));
      this.groupList = groupList;
      this.calList = calList;
      this.groupList = this.selectNode.bindSet?.vueData?.groupList || groupList;
      this.calList = this.selectNode.bindSet?.vueData?.calList || calList;
    }
  },
};
</script>

<style scoped lang="scss">
.el-select-dropdown__item.hover {
  color: var(--color-primary);
}
.el-select-dropdown__item.selected {
  background-color: var(--color-primary);
  color: #fff;
}
.group-box {
  padding: 2px 7px;
  min-width: 400px;
  & p {
    color: #5e6d82;
    margin: 6px 0;
    font-size: 14px;
  }
  & a {
    color: var(--color-primary);
    text-decoration: none;
    cursor: pointer;
    font-size: 14px;
  }
  .group-selecte-box {
    max-height: 192px;
    width: 200px;
    overflow: auto;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.15);
    position: absolute;
    border-radius: 4px;
    z-index: 100;
    background-color: white;
  }
}

.group-select-list {
  padding: 7px;
  cursor: pointer;
  color: #333;
  font-weight: 400;
  font-size: 14px;
  line-height: 30px;
  width: 200px;
  &:hover {
    background-color: #e6f6f4;
  }
}
.checked-item {
  color: #ccc;
  cursor: default;
}
.dimension-list {
  padding-top: 10px;

  .dimension-item {
    display: flex;
    align-items: center;
    margin-bottom: 19px;
    padding: 0 7px;
    .type-select {
      padding: 0px 4px;
      ::v-deep.el-input__suffix {
        right: -7px;
        .el-select__caret {
          color: var(--color-primary);
        }
      }

      ::v-deep.el-input__inner {
        border: none;
        padding-left: 0px;
        color: var(--color-primary);
        font-size: 16px;
        width: 45px;
        user-select: none;
        padding-right: 0px;
      }
    }
    & i {
      padding: 0 9px;
    }
  }
}

.combo-value {
  position: relative;
  background: #f5f5f5;
  border: none;
  color: var(--color-primary);
  margin: 0 9px;
  width: 100px;
  cursor: pointer;
  font-size: 13px;
  padding: 5px 6px;
  .selector {
    width: 100px;
    height: 120px;
    overflow: scroll;
    position: fixed;
    bottom: 36px;
    left: 0;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.15);
    background-color: white;
    z-index: 100;
    padding: 7px 0;
    .selector-item {
      height: 18px;
      font-size: 14px;
      padding: 3px;
      color: #333;
      padding: 0 4px;
      height: 30px;
      line-height: 30px;
      &:hover {
        background-color: #e6f6f4;
      }
    }
  }
}
.dropdown-list {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
  padding: 0 4px;
  display: block;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.active-list {
  background-color: var(--color-primary);
  color: #fff;
}
.dropdown-list:hover {
  background-color: #e6f6f4;
  color: #333;
}
::v-deep.el-popover {
  padding: 0;
}
</style>