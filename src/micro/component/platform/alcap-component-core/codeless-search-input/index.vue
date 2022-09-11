<template>
  <el-input
    v-model="searchVal"
    placeholder="搜索关键词"
    @input="input"
    @keydown.enter.native="enter"
    size="mini"
    style="width:180px"
    class="codeless-search-input"
    clearable
  >
    <codeless-icon
      icon="icon-sousuo"
      style="margin-top: 0px; width: 14px; height: 14px;"
      slot="prefix"
    ></codeless-icon>
  </el-input>
</template>

<script>
export default {
  name: 'codelessSearchInput',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    searchVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      }
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val);
    },
    enter() {
      this.$emit('keydown', this.searchVal);
    }
  }
}
</script>

<style lang="scss" scoped>
.codeless-search-input {
  ::v-deep .el-input__inner {
    border-radius: 222px;
    height: 26px;
  }
  ::v-deep .el-input__prefix {
    display: flex;
    align-items: center;
  }
}
::v-deep .el-input {
  
}
</style>