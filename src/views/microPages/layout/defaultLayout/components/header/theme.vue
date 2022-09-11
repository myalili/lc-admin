<template>
  <el-dropdown trigger="hover" @command="handleCommand">
    <i class="iconfont icon-a-daimakuanghuanfuqianse text-muted mr-4"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in themes"
        :command="item.value"
        :key="item.value"
        class="flex items-center"
        :class="{'is-active':item.value===activeTheme}"
      >
        <span class="theme-block inline-block mr-2 " :style="{'background-color':item.color}"></span>
        {{ item.name }}</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      activeTheme: "",
      themes: [
        {
          name: "默认主题",
          value: "",
          color: "white",
        },
        {
          name: "暗黑",
          value: "theme-dark",
          color: "rgb(48,50,68)",
        },
        {
          name: "科技蓝",
          value: "theme-blue",
          color: "rgb(69,118,206)",
        },
        {
          name: "夕阳红",
          value: "theme-red",
          color: "#f8f1f1",
        },
      ],
    };
  },
  methods: {
    handleCommand(command) {
        this.activeTheme=command
      document.body.className = command;
    },
  },
};
</script>
<style scoped lang="less">
.theme-block {
  width: 60px;
  height: 25px;
}
</style>