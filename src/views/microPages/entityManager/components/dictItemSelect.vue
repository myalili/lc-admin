<template>
  <div class="dict-item-container">
    <div class="dict-item-container-body">
      <dict-selector :singleSelect="false" :filterText="searchInput" @selection-change="selectionChange"></dict-selector>
    </div>
  </div>
</template>

<script>
import dictSelector from "./dictSelector/index.vue"
export default {
    components:{dictSelector},
  props: {
    selectedList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    searchInput:{
        type:String,
        default:""
    }
  },
  data() {
    return {
    };
  },
  methods: {
      selectionChange(val){
          this.$emit("update-dictItem",this.selectedList.concat(val))
      },
    
  }
};
</script>

<style lang="scss" scoped>
.dict-item-container {
  border: 1px solid #c8d0d4;
  border-radius: 4px;
  // height: 550px;
  width: 100%;
  .search-header {
    border-bottom: 1px solid #c8d0d4;
    text-align: center;
    &-input {
      padding: 10px;
      width: 600px;
      ::v-deep .el-input__inner {
        border-radius: 18px;
      }
    }
  }
  &-body {
    height: 498px;
    display: flex;
    &-tree {
      height: 100%;
      width: 300px;
      border-right: 1px solid #c8d0d4;
      .dict-tree {
        height: 497px;
        overflow: auto;
      }
    }
  }
}
</style>