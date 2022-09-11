<template>
  <div class="menus-tree w-full h-full">
    <div class="top w-full h-10 px-4 flex items-center">
      <div class="top-title">{{ title }}</div>
      <div class="top-divider"></div>
      <el-checkbox v-model="all">全选</el-checkbox>
      <div class="top-divider"></div>
      <div class="top-show-toggle">
        <i
          class="el-icon-caret-right cursor-pointer hover:text-primary"
          title="全部收起"
          @click="setAllFold"
        ></i>
        <i
          class="el-icon-caret-bottom cursor-pointer ml-3 hover:text-primary"
          title="全部展开"
          @click="setAllExpand"
        ></i>
      </div>
      <div class="top-divider"></div>
      <el-input
        v-model="searchVal"
        placeholder="搜索关键字"
        prefix-icon="el-icon-search"
        size="mini"
        clearable=""
      ></el-input>
    </div>
    <div class="tree pt-3 w-full">
      <el-tree
        ref="tree"
        :data="data"
        :check-strictly="true"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :filter-node-method="filterNode"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    data: {
      type: Array,
      default: ()=> {
        return []
      }
    },
    checkedNodes: {
      type: Array,
      default: ()=> {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: ()=> {
        return {
          children: "children",
          label: "title",
        }
      }
    },
  },
  data() {
    return {
      all: false,
      searchVal: "",
    };
  },
  watch: {
    all(n) {
      this.selectAll(n);
    },
    searchVal(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //全选
    selectAll(n) {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].checked = n;
      }
    },
    // 折叠所有节点
    setAllFold() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false;
      }
    },
    // 展开所有节点
    setAllExpand() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = true;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.menus-tree {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.39);
  border: 1px solid #c8d0d4;
  opacity: 1;
  border-radius: 6px;
  .top {
    height: 40px;
    background: rgba(247, 250, 251, 0.39);
    opacity: 1;
    border-radius: 5px 5px 0px 0px;
    &-title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 24px;
      color: #333333;
    }
    &-divider {
      width: 1px;
      height: 14px;
      background: rgba(200, 208, 212, 0.39);
      margin: 0 16px;
    }
    &-show-toggle {
    }
    ::v-deep .el-input {
      flex: 1;
      .el-input__inner {
        border: none;
        background: transparent;
        padding-right: 20px;
      }
      .el-input__suffix {
        right: 0;
        i {
          width: auto;
        }
      }
    }
  }
  .tree {
    height: calc(100% - 40px);
    padding: 12px 15px 0;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }

    .el-tree {
      ::v-deep .el-tree-node__content {
        height: 34px;
      }
      ::v-deep .el-tree-node:focus > .el-tree-node__content {
        background: rgba(227, 242, 252, 0.39) !important;
        border-radius: 6px !important;
      }
      ::v-deep .is-current {
        > .el-tree-node__content:hover {
          background: rgba(227, 242, 252, 0.39) !important;
          border-radius: 6px !important;
        }
      }
      ::v-deep .is-focusable {
        > .el-tree-node__content:hover {
          background: rgba(227, 242, 252, 0.39) !important;
          border-radius: 6px !important;
        }
      }
    }
  }
}
</style>