<template>
  <div
    class="pc-toolbar w-full"
    @click="select"
    @mouseenter="hoverIndex = 1"
    @mouseleave="hoverIndex = -1"
  >
    <div
      class="pc-toolbar-buttons absolute right-2 hover:bg-gray-300"
      style="top: -13px"
      v-show="hoverIndex === 1"
    >
      <el-button
        class="pc-toolbar-button"
        type="text"
        @click.stop="handler('fullScreen')"
        title="全屏"
        @mouseover="hoverIndex = 1"
        ><i class="el-icon-full-screen"></i
      ></el-button>
      <el-button
        class="pc-toolbar-button"
        type="text"
        @click.stop="handler('remove')"
        title="删除"
        @mouseover="hoverIndex = 1"
        ><i class="el-icon-delete"></i
      ></el-button>
      <el-button
        class="pc-toolbar-button"
        type="text"
        @click.stop="handler('edit')"
        title="编辑"
        @mouseover="hoverIndex = 1"
        ><i class="el-icon-edit-outline"></i
      ></el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["componentList", "index"],
  computed: {
    selectBorder() {
      if (this.componentList[this.index].isSelected) {
        return {
          border: "3px solid #4A8BFD",
        };
      } else {
        return {};
      }
    },
  },
  data() {
    return {
      isSelected: false,
      hoverIndex: -1,
    };
  },
  methods: {
    handler(key) {
      this.$emit(key);
    },
    select() {
      const ctx = this;
      let selectedIndex = ctx.componentList.findIndex((i) => i.isSelected);
      if (selectedIndex > -1)
        ctx.componentList[selectedIndex].isSelected = false;
      ctx.$set(ctx.componentList[ctx.index], "isSelected", true);
      ctx.handler("select");
    },
  },
};
</script>
<style scoped>
.pc-toolbar {
  position: absolute;
  /* float: right; */
  top: 0px;
  right: 0px;
  font-size: 10px;
  /* line-height:10px; */
  /* padding:2px 5px; */
  /* margin-right: 5px; */
  /* height:20px; */
  transition: background 0.5s linear;
  z-index: 700;
  height: 100%;
  box-sizing: border-box;

  /* border: 3px solid #4A8BFD; */
  /* border: 3px solid transparent; */
}
.pc-toolbar:hover {
  /* background: rgba(22, 22, 22,.2); */
  /* border: 1px solid #4A8BFD; */
}

.pc-toolbar-buttons {
  height: 26px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px rgba(55, 78, 113, 0.22);
  opacity: 1;
  border-radius: 222px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  z-index: 701;
  cursor: pointer;
}
.pc-toolbar-button {
  padding: 0 !important;
}
</style>
