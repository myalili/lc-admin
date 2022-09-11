<template>
  <div>
      <el-input v-model="structure.name" placeholder="键" style="width:300px" size="small" :readonly="disabled">
        <el-select v-model="structure.type" slot="append" placeholder="请选择" style="width:100px" size="small" @change="changeItem" :disabled="disabled">
          <el-option label="string" value="string"></el-option>
          <el-option label="array" value="array"></el-option>
          <el-option label="object" value="object"></el-option>
          <el-option label="map" value="map"></el-option>
          <el-option label="boolean" value="boolean"></el-option>
        </el-select>
      </el-input>
       <div @click.stop="delItem(keys, order)" class="delIcon w-4 h-4 text-center leading-4 cursor-pointer" v-show='!disabled' title='删除子项'>
         <i class='inline-block el-icon-minus'></i>
       </div>
       <div
          @click.stop="addItem(keys, order)"
          v-if="canAddItem"
          class="addIcon w-4 h-4 text-center leading-4 text-white cursor-pointer bg-primary"
          v-show='!disabled'
        >
         <!-- <i class='iconfont icon-jiahao inline-block'></i> -->
          <i class='el-icon-plus inline-block font-bold' title='新增子项'></i>
      </div>
    <div style="margin-left: 20px;margin-top:15px">
      <test-item
         v-for="(item,index) in structure.children"
        :key ="index"
        :structure ="item"
        :disabled="disabled"
        @delItem="handleItem(index)"
      ></test-item>
    </div>
    
  </div>
</template>
<script>
export default {
  name: "test-item",
  props: ["disabled","structure"],
  data() {
    return {
       count:1
    };
  },
  create() {
    
  },
  mounted() {
   
  },
  computed:{
    canAddItem(){
      switch(this.structure.type){
        case "array":
        case "map":
        case "object":
          return true
        default:
          return false
         
      }
    },
  },
  methods: {
    addItem() {
      let newItem = {
          name:'',
          type:'string'
      }

      switch(this.structure.type){
        case "object":
          newItem.name =`newKey${this.count}`;
          this.count++
          break
      }
     if(Array.isArray(this.structure.children)){
       this.structure.children.push(newItem)
     }else{
       this.$set( this.structure,"children",[newItem])
     }
      
    },
    delItem() {
      this.$emit("delItem");
    },
    handleItem(index) {
      this.structure.children.splice(index,1)
    }
    
  },
};
</script>
<style scoped lang='scss'>
.addIcon {
  border-radius: 50% !important;
  margin-left: 10px;
  float: right;
  margin-top:7px;
  i{
    font-size:12px;
    // display: inline-block;
    transform: scale(.7);
  }
  
}
.delIcon{
  border-radius: 50% !important;
  margin-left: 10px;
  border:1px solid #AABEC8;
  float: right;
  color:#AABEC8;
  margin-top:7px;
  i{
    font-size:12px;
    // display: inline-block;
    transform: scale(.8);
  }

}

::v-deep .el-input-number__decrease{
    line-height:28px;
    height:28px;
}
::v-deep .el-input-number__increase {
  line-height:28px;
  height:28px;
}
::v-deep .el-input__inner{
  //border: 1px solid #DCDFE6 !important;
  color:#333333;
  height:30px;
  line-height:30px;

}
</style>