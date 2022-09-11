<template>
  <!-- <el-button
    type="primary"
    icon="el-icon-mobile-phone"
    @click="changeMode"
    size="mini"
    style="margin-right: 5px"
  /> -->
  <!-- <div class='codeless-select-item-bg-color cursor-pointer select-item'  @click="changeMode">
    移动端预览
  </div> -->
  <div class="codeless-mobile-btn flex items-center">
    <div
      class="flex items-center justify-center rounded cursor-pointer"
      :style="{
        background: mobile === item.mobile ? 'rgba(231, 236, 239, 0.39)' : '',
        marginLeft: item.marginLeft || '0'
      }"
      @click="changeMode(item.mobile)"
      v-for="item in list"
      :key="item.icon"
    >
      <img :style="{ width: item.width }" :src="item.icon" />
    </div>
  </div>
</template>
<script>
export default {
  name: "mobileBtnV2",
  data() {
    return {
      mobile: false,
      list: [
        {
          icon: require("./img/icon-diannao.png"),
          mobile: false,
          width: "14px",
        },
        {
          icon: require("./img/icon-shouji.png"),
          mobile: true,
          width: "10px",
          marginLeft: '4px'
        },
      ],
    };
  },
  methods: {
    changeMode(flag) {
      this.mobile = flag;
      window.msgHub.$emit("modeChanged", this.mobile);
    },
  },
};
</script>
<style lang="scss" scoped>
.codeless-mobile-btn {
  div {
    width: 30px;
    height: 30px;
    opacity: 1;
    border-radius: 4px;
  }
}
</style>