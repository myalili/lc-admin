<template>
  <span class="back" @click="back">
    <codeless-icon class="v2-a-svgicon" icon="icon-fanhui"></codeless-icon>
  </span>
</template>

<script>
export default {
  name: 'codeless-back',
  methods: {
    back() {
      this.$emit("back");
    },
  },
};
</script>
<style lang="less" scoped>
.back {
  width: 20px;
  height: 20px;
  // background: linear-gradient(316deg, #15c0ff 0%, #00ddaa 100%);
  background-color:var(--color-primary);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  // margin-right: 6px;
  .v2-a-svgicon {
    width: 12px;
    height: 12px;
  }
}
</style>
