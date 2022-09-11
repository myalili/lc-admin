<template>
  <div class="sc-left-area-base">
    <slot name="top"></slot>
    <resource-tree-base
      ref="tree"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template slot-scope="scope">
        <slot v-bind="scope"></slot>
      </template>
    </resource-tree-base>
    <slot name="footer" />
  </div>
</template>

<script>
import resourceTreeBase from './resourceTreeBase.vue'
export default {
  name: 'ScLeftAreaBase',
  inheritAttrs: false,
  components: {
    resourceTreeBase
  },
  methods: {
    setCurrentKey(id) {
      this.$refs.tree.setCurrentKey(id)
    },
    updateKeyChildren(...args) {
      this.$refs.tree.updateKeyChildren(...args)
    },
    getNode(key) {
      return this.$refs.tree.getNode(key)
    },
    remove(key) {
      return this.$refs.tree.remove(key)
    },
    append(key) {
      return this.$refs.tree.append(key)
    },
  }
}
</script>

<style lang="scss" scoped>
.sc-left-area-base {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  // border-radius: 8px;
  width: 100%;
  height: 100%;
  & > * + * {
    margin-top: 10px;
  }
}
</style>
