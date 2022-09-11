<template>
  <sc-ledt-area-base
    class="left-area"
    :data="treeData"
    :filterText="filterText"
    :props="{
      children: 'childs',
      label: 'name',
      isLeaf: 'isLeaf'
    }"
    default-expand-all
    @node-click="handleNodeClick"
  >
    <div class="search-input" slot="top">
      <el-input
        v-model="filterText"
        placeholder="输入关键词进行过滤"
        clearable
        size="mini"
      >
        <codeless-icon
          icon="icon-sousuo"
          style="margin-top: 0px; width: 14px; height: 14px;"
          slot="prefix"
        ></codeless-icon>
      </el-input>
    </div>
    <span slot-scope="{ node, data }" :title="data.name">
      <i
        class="node-icon"
        :class="{
          'aupIconfont aupiconshujuzidian': data.isLeaf === '1',
          'iconfont iconfolder': data.isLeaf === '0'
        }"
      ></i>
      <span class="node-text">{{ node.label }}</span>
    </span>
  </sc-ledt-area-base>
</template>

<script>
const { tree } = window.getBffApi();
import scLedtAreaBase from './scLeftAreaBase.vue'
export default {
  name: 'LeftArea',
  components: { scLedtAreaBase },
  data() {
    return {
      treeData: [],
      filterText: ''
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    getTree() {
      tree('dict').then(data => {
        this.treeData = data ? [data] : []
      })
    },
    handleNodeClick(data) {
      //0是分类，1是字典
      if (data.isLeaf === '1') {
        if (data.type) {
          return
        } else {
          this.$emit('item-click', data)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.left-area {
  .search-input {
    padding: 0 10px;
    ::v-deep {
      .el-input__inner {
        border-radius: 16px;
      }
    }
  }
  .node-icon {
    color: #66b3ff;
    margin-right: 5px;
  }
  ::v-deep {
    .el-tree {
      padding: 0 0;
      .el-tree-node__content {
        border-radius: 0;
      }
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: #e6f4ff;
        .node-icon {
          color: #66b3ff;
        }
        .node-text {
          color: #333;
        }
      }
    }
  }
  ::v-deep .el-input {
    width: 201px;
    .el-input__inner {
      width: 201px;
      border-radius: 222px;
      height: 26px;
    }
    .el-input__prefix {
      display: flex;
      align-items: center;
    }
  }
}
</style>
