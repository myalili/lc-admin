<template>
  <!--       :index="JSON.stringify({path:`${tPath}/${item.path}`,name:item.name})"
 -->
  <el-menu-item
    v-if="!item.hidden && !item.children"
    :key="formatKey(item.path)"
    v-bind="$props"
    v-on="$listeners"
    class="hover:bg-secondary"
  >

    <codeless-icon
      class="aweb-menu-icon v2-a-svgicon"
      :icon="item.meta.icon || 'icon-yemianmingcheng2'"
    ></codeless-icon>

    <!-- <i v-if="item.meta && item.meta.icon" class="anticon" :class="item.meta.icon"></i> -->
    <span v-if="item.meta && item.meta.title" class="admin-menu-title text-muted">
      {{ item.meta.title }}
    </span>
  </el-menu-item>

  <el-sub-menu
    v-else-if="!item.hidden"
    :key="formatKey(item.path)"
    :index="formatKey(item.path)"
    v-bind="$props"
    v-on="$listeners"
  >
    <template slot="title">
      <codeless-icon
        class="aweb-menu-icon v2-a-svgicon"
        :icon="item.meta.icon || 'icon-yemianmingcheng2'"
      ></codeless-icon>
      <!-- <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i> -->
      <span v-if="item.meta && item.meta.title" class="admin-menu-title text-muted">
        {{ item.meta.title }}</span
      >
    </template>
    <!--  -->

    <sub-menu
      v-for="sub in item.children"
      :key="formatKey(sub.path)"
      :item="sub"
      :tPath="formatKey(sub.path)"
         class="hover:bg-secondary"

    ></sub-menu>
  </el-sub-menu>
</template>
<style lang="less">
</style>
<script>

export default {
  // isSubMenu: true,
  name: "subMenu",
  props: {

    item: {
      type: Object,
    },
    tPath: {
      type: String,
      default() {
        return "";
      },
    },
  },
  components: {},

  data() {
    return {};
  },
  mounted() {
    // console.log(this.tPath);
  },
  methods: {
    formatKey(value) {
      return `${this.tPath}/${value}`.replace(/\/\//g, "/");
    },
  },
};
</script>