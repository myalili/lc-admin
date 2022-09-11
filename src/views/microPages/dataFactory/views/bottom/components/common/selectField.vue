<template>
  <el-popover
  :placement="placement"
  :width="width"
  :trigger="trigger">
      <div>
          <el-input v-model="searchString" class="search-input" prefix-icon="el-icon-search"></el-input>
          <div class="select-list">
            <el-checkbox v-model="isCheckAll" @change="checkAll">全部</el-checkbox>
            <el-checkbox v-for="(item, i) in filterOption" :key="i" v-model="item.isCheck">{{ item.label }}</el-checkbox>
          </div>
      </div>

       <div  slot="reference">
         <slot></slot>
       </div>
      <!-- <i class="el-icon-circle-plus"></i>  -->
  </el-popover>
</template>

<script>
export default {
  model:{
    prop: 'tableOptions',
    event: 'change'
  },
  props:{
    tableOptions:{
      type: Array,
      default: () => []
    },
    placement:{
      type: String,
      default: "bottom-start"
    },
    trigger:{
      type: String,
      default: "click"
    },
    width:{
      type: String,
      default: "300"
    }
  },
  data(){
    return {
      searchString: "",
      isCheckAll: true,
      option: JSON.parse(JSON.stringify(this.tableOptions))
    }
  },
  computed:{
    filterOption(){
      let arr = [];
      arr = this.option.filter(data => !this.searchString || data.label.toString().toLowerCase().includes(this.searchString.toString().toLowerCase()))
      return arr;
    },
  },
  methods:{
    checkAll(val){
      if(!val){
        this.option.forEach(item => {
          item.isCheck = false;
        })
      }else{
        this.option.forEach(item => {
          item.isCheck = true;
        })
      }
    },
  },
  watch:{
    option:{
      deep: true,
      immediate: true,
      handler(val){
        let isCheckAll = true
        val.forEach(item => {
          if(!item.isCheck){
            isCheckAll = false
          }
        })
        this.isCheckAll = isCheckAll

        this.$emit("change", val)
        this.$emit("isChange")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select-list{
  display: flex;
  flex-flow: column nowrap;
  .el-checkbox{
    margin: 5px;
  }
}
.search-input{
  ::v-deep.el-input__inner{
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #ccc;
  }
}
</style>