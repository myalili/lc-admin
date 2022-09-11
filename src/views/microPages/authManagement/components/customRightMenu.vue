<template>
  <el-tree :data="dataWrapper" default-expand-all>
    <div class="node-wrapper" slot-scope="{ data }">
      <slot :data="data.data"></slot>
      <div class="children-wrapper" v-if="data.leafChildren.length > 0">
        <div v-for="item in data.leafChildren" :key="item.id">
          <slot :data="item.data" :leaf="true"></slot>
        </div>
      </div>
    </div>
  </el-tree>
</template>

<script>
function intoDataWrapper(tree) {
  if (!Array.isArray(tree)) {
    return []
  }
  return tree.map(item => {
    const children = intoDataWrapper(item.children)
    const childrenIsLeaf = children.every(child => child.childrenIsLeaf)
    const wrapper = {
      id: item.id,
      data: item,
      childrenIsLeaf: childrenIsLeaf,
      leafChildren: childrenIsLeaf ? children : [], // 叶子节点
      children: childrenIsLeaf ? [] : children // 树
    }
    return wrapper
  })
}
export default {
  name: 'AuthorityTreeBase',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    dataWrapper() {
      return intoDataWrapper(this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tree-node__content {
    height: auto;
  }
}
.node-wrapper {
  display: flex;
  padding: 10px 0 10px 10px;
  border-left: 1px solid rgb(215, 215, 215);
  .children-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid rgb(215, 215, 215);
    & > * {
      margin-right: 32px;
    }
  }
}
</style>
