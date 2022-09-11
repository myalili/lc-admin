<template>
  <el-tree
    class="filter-tree"
    :data="config.listData"
    default-expand-all
    :props="config.defaultProps"
    node-key="ID"
    ref="tree"
    @node-click="nodeClick"
  >
  </el-tree>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },

  },
  data() {
    return {
      active: ''
    }
  },
  mounted() {
    console.log(this.config);
  },

  methods: {
    nodeClick(data) {
      const ctx = this;
      ctx.active = data.label;
      ctx.$emit("change", data.label === '全部'? '': ctx.active);
    },
  }
}
</script>

<style>

</style>