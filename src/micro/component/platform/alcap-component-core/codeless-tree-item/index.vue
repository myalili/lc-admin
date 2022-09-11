<template>
  <div class="app-tree-item">
    <div
      class="app-tree-item-title"
      @click="toggle(model)"
      :class="{ active: $route.query.pageId === model.pageId }"
      @mousemove="mousemove(model)"
      @mouseleave="mouseleave(model)"
    >
      <i
        class="toggle-icon"
        :class="[open ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"
        v-if="!model.pageId"
      ></i>
      <codeless-icon class="v2-a-svgicon" :icon="model.icon || 'icon-kuaijierukou3'"></codeless-icon>
      <span class="title">{{ model.title }}</span>
      <div class="delete" v-show="currentId == model.id">
        <span style="margin-right: 10px">
          <i class="el-icon-edit" @click.stop="update(model)"></i>
        </span>
        <span>
          <i class="el-icon-delete" @click.stop="deleteModel(model)"></i>
        </span>
      </div>
    </div>
    <div class="app-tree-subitem" v-if="model.children" v-show="open">
      <tree-item
        :model="item"
        v-for="item in model.children"
        :key="item.id"
        @tree-click="toggle(item)"
        @update-tree="update"
        @delete-tree="deleteModel"
      ></tree-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "treeItem",
  props: ["model"],
  data() {
    return {
      open: true,
      currentId: "",
      width: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    mousemove(model) {
      this.width = 100;
      this.currentId = model.id;
    },
    mouseleave(model) {
      this.width = 0;
      this.currentId = "";
    },
    update(model) {
      console.log(model);
      this.$emit("update-tree", model);
    },
    deleteModel(model) {
      this.$emit("delete-tree", model);
    },
    toggle(model) {
      if (!model.pageId) {
        this.open = !this.open;
      } else {
        this.$emit("tree-click", model);
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="less" scoped>
.app-tree-item {
  .v2-a-svgicon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    margin-left: 28px;
  }
}

.app-tree-item-title {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  user-select: none;
  position: relative;
  &.active {
    background-color: #e3f2fc;
  }
  .toggle-icon {
    color: #a4aeb4;
    position: absolute;
    top: 8px;
    left: 10px;
  }
  .title {
    display: inline-block;
    vertical-align: middle;
  }
}
.app-tree-subitem {
  .app-tree-item-title {
    padding-left: 18px;
    .toggle-icon {
      left: 28px;
    }
  }
}
.delete {
  float: right;
  width: 50px;
  // transition: width .5s;
}
</style>
