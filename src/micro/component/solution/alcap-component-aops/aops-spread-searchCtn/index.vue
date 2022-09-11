<template>
  <span>
    <span v-show="spread"><slot></slot></span>
    <el-button
      type="text"
      style="position:absolute;right:20px;top:0;line-height:48px"
      :icon="spread ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
      @click="spread = !spread"
      >{{ spread ? '收起' : '展开' }}</el-button
    >
  </span>
</template>

<script>
export default {
  name:'SpreadSearchCtn',
  props: {
    value: Boolean
  },
  data() {
    return {
      spread: this.value
    };
  }
};
</script>
