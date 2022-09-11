<template>
  <el-tree
    ref="tree"
    class="resource-tree"
    node-key="id"
    :props="props"
    default-expand-all
    expand-on-click-node
    highlight-current
    :filter-node-method="filterNodeMethod"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <span class="tree-node" slot-scope="slotScope">
      <slot v-bind="slotScope">
        <i class="node-icon aupIconfont aupiconfolder"></i>
        <span class="node-text">{{ slotScope.data.name }}</span>
      </slot>
    </span>
  </el-tree>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    filterText: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        }
      }
    }
  },
  data() {
    return {}
  },
  watch: {
    filterText(val) {
      if (!this.$refs.tree) {
        return
      }
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    contextmenu() {
      this.$emit('contextmenu')
    },
    filterNodeMethod(value, node) {
      if (!value || value.length === 0) {
        return true
      }
      return node.name.toLowerCase().includes(value.toLowerCase())
    },
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },
    setCurrentKey(id) {
      this.$refs.tree.setCurrentKey(id)
    }
  }
}
</script>

<style lang="scss" scoped>
// 树形结构
.resource-tree {
  background: transparent;
  // height: 100%;
  // padding-bottom: 20px;
  overflow: auto;
  // translate: height 0.2s;
  .tree-node {
    // position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    .node-icon {
      color: #95a3aa;
      padding-right: 6px;
    }
    .node-text {
      color: #5b5b5b;
      flex-grow: 1;
      overflow: hidden;
      width: 100%;
      padding-right: 14px;
    }
  }
  ::v-deep {
    // 树型界面展开的icon
    $icon-color: #7f8c93;

    .el-tree-node.is-current > .el-tree-node__content {
      background: #E6F4FF;
      // .node-icon {
      //   color: white;
      // }
      // .node-text {
      //   color: white;
      // }
    }
    .el-tree-node__content {
      position: relative;
      //border-radius: 4px;
      overflow: hidden;
    }
  }
}
</style>
