<template>
  <el-date-picker
    clearable
    type="daterange"
    style="width: 230px"
    value-format="yyyy-MM-dd HH:mm:ss"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    range-separator="~"
    :picker-options="pickerOptions"
    v-bind="$attrs"
    v-on="$listeners"
    class="resetclass-el-date-picker"
  />
</template>

<script>
export default {
  name: 'AopsDatePicker',
  computed: {
    pickerOptions: () => ({
      disabledDate(date) {
        return date.getTime() > Date.now();
      }
    })
  }
};
</script>
<style >
.resetclass-el-date-picker >  .el-range__icon {
   line-height: 20px !important;
  }
</style>
