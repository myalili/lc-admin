<template>
  <div class="h-full">
    <div v-if="table" class="dfilter" @click="showPanel = false">
      <div class="header"> 
        筛选出符合以下
        <el-select class="type-select" v-model="screenType">
          <el-option value="and" label="所有"> 所有 </el-option>
          <el-option value="or" label="任一"> 任一 </el-option>
        </el-select>
        条件的数据
      </div>
      <div class="body">
        <span class="screen-btn" @click.stop="showPanel = true"
          >+ 添加筛选条件
          <div @click.stop="" v-show="showPanel" class="group-selecte-box">
            <div
              v-for="item in tableOptions"
              @click="chooseItem(item)"
              :key="item.value"
              class="group-select-list"
              :class="{ 'checked-item': isSelect(item) }"
            >
              {{ item.label }}
            </div>
          </div>
        </span>

        <div
          class="screen-msg flex-between"
          v-for="(item, i) in screenMsg"
          :key="i"
        >
 
          <el-input class="name" size="small" readonly="" :value="item.label"> </el-input>

          <el-select size="small" @change="setBindSet" v-model="item.from" class="type">
            <el-option
              v-for="option in screenOption.filter((option) =>
                option.type.includes(item.type)
              )"

              :key="option.value"
              :value="option.value"
              :label="option.label"
            >
            </el-option>
          </el-select>

          <filter-input
            :filterValue="item.filterValue"
            @value="setValue(item, $event)"
            :type="item.type"
            :from="item.from"
          ></filter-input>

          <i
            style="cursor: pointer"
            @click="removeItem(i)"
            class="el-icon-delete"
          ></i>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-center error-text" style="height: 100%">
      请将一个已配置好的节点接连至本节点
    </div>
  </div>
</template>

<script>
import filterInput from "./components/dfilter/filterInput.vue";
export default {
  components: { filterInput },
  props: ["selectNode"],
  watch: {
    "selectNode.nodeId"() {
      this.init();
    },
    "screenType"(){
      this.setBindSet()
    }
  },
  data() {
    return {
      showPanel: false,
      screenType: "and",
      screenMsg: [],
      screenOption: [
        { value: "equals", label: "等于", type: ["string", "time", "number"] },
        {
          value: "notEquals",
          label: "不等于",
          type: ["string", "time", "number"],
        },
        { value: "isNull", label: "为空", type: ["string", "time", "number"] },
        {
          value: "notNull",
          label: "不为空",
          type: ["string", "time", "number"],
        },

        { value: "in", label: "等于任一个", type: "string" },
        { value: "notIn", label: "不等于任一个", type: "string" },
        { value: "like", label: "包含", type: "string" },
        { value: "notLike", label: "不包含", type: "string" },

        { value: "greaterThan", label: "大于", type: ["number", "time"] },
        {
          value: "equalsOrGreaterThan",
          label: "大于等于",
          type: ["number", "time"],
        },
        { value: "lessThan", label: "小于", type: ["number", "time"] },
        {
          value: "equalsOrLessThan",
          label: "小于等于",
          type: ["number", "time"],
        },
        { value: "range", label: "选择范围", type: ["number", "time"] },
      ],
      tableOptions: [
        { value: "num", label: "编号", isSelect: false },
        { value: "name", label: "名称", isSelect: false },
        { value: "cool", label: "分数", isSelect: false },
        { value: "test", label: "名次", isSelect: false },
      ],
      searchString: "",
    };
  },
  methods: {
    setValue(item, v) {
      item.filterValue = v;
      this.setBindSet();
    },
    removeItem(i) {
      this.screenMsg[i].isSelect = false;
      this.tableOptions = JSON.parse(JSON.stringify(this.tableOptions));
      this.screenMsg.splice(i, 1);
      this.setBindSet();
    },
    chooseItem(item) {
      item.isSelect = true;
      this.tableOptions = JSON.parse(JSON.stringify(this.tableOptions));
      const target = this.screenMsg.find((ele) => ele.value === item.value);
      if (!target) {
        this.screenMsg.push(item);
      }
      this.setBindSet();
    },
    setBindSet() {
      let table = {
        name: this.table.name + "-过滤",
        schema: this.table.schema,
      };
      let expressions = this.screenMsg.map((item) => {
        return {
          field: item.alias || item.value,
          operator: item.from,
          value:  item.filterValue||'',
          values: Array.isArray(item.filterValue) ? item.filterValue : []
        };
      });
      this.selectNode.setBindTable(table);
      this.selectNode.setBindSet({
        expressions: expressions,relation:this.screenType,
        vueData: {
          screenMsg: this.screenMsg,
        },
      });
    },
    init() {
      if (this.table) {
        this.tableOptions = this.table.schema.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        });
      }
      if (this.selectNode.bindSet?.vueData) {
        this.screenMsg = this.selectNode.bindSet.vueData.screenMsg;
      } else {
        this.screenMsg = [];
      }
    },
  },
  computed: {
    isSelect() {
      return (item) => {
        return this.screenMsg.find((el) => el.value === item.value && el.alias === item.alias);
      };
    },
    filterOption() {
      let arr = [];
      arr = this.tableOptions.filter(
        (data) =>
          !this.searchString ||
          data.label
            .toString()
            .toLowerCase()
            .includes(this.searchString.toString().toLowerCase())
      );
      return arr;
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
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.el-select-dropdown__item.hover {
  color: var(--color-primary);
}
.el-select-dropdown__item.selected {
  background-color: var(--color-primary);
  color: #fff;
}
.search-input {
  ::v-deep.el-input__inner {
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #ccc;
  }
}
.selsect-list {
  padding: 5px 10px 5px 20px;
  &:hover {
    color: var(--color-primary);
    cursor: pointer;
    background-color: #eee;
  }
}

.group-selecte-box {
  max-height: 192px;
  width: 230px;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.15);
  position: absolute;
  border-radius: 4px;
  z-index: 100;
  background-color: white;
}
.group-select-list {
  padding: 7px;
  cursor: pointer;
  color: #333;
  font-weight: 400;
  font-size: 14px;
  line-height: 30px;
  width: 230px;
  &:hover {
    background-color: #e6f6f4;
  }
}
.checked-item {
  color: #ccc;
  cursor: default;
}

.dfilter {
  padding: 5px 10px;

  .header {
        color: #5e6d82;
        font-size: 14px;
    .type-select {
      padding: 0px;

      ::v-deep.el-input__suffix {
        right: -7px;
        display: none;
        .el-select__caret {
          color: var(--color-primary);
          color: white;
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
  }

  .body {
    padding-bottom: 55px;
    .screen-btn {
      color: var(--color-primary);
      &:hover {
        cursor: pointer;
      }
    }

    .screen-msg {
      width: 950px;
      margin-top: 20px;
      align-items: center;
      ::v-deep.el-input__suffix {
        right: -7px;
        .el-select__caret {
          color: var(--color-primary);
        }
      }
      .name {
        width: 300px;
        // border: 1px solid #ddd;
        // padding: 10px 150px 10px 20px;
        border-radius: 4px;
      }

      .type {
        margin: 0 10px;
        width: 110px;
        ::v-deep.el-input__inner {
          border: none;
          padding-left: 0px;
          color: var(--color-primary);
          font-size: 16px;
          width: 110px;
          user-select: none;
          padding-right: 0px;
        }

        ::v-deep.el-input__suffix {
          right: -7px;
          .el-select__caret {
            color: var(--color-primary);
          }
        }
      }

      .condition {
        width: 300px;
        border: 1px solid #ccc;
        height: 40px;
        border-radius: 4px;
      }
    }
  }
}
</style>