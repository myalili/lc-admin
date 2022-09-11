<template>
  <div class="base-style">
    <!-- <div class="style-item">
      宽度
      <el-input
        style="width: 180px"
        type="number"
        v-model.number="obj.model._gridlayout.w"
        size="mini"
        placeholder=""
      ></el-input>
     
       <el-select
        v-model="obj.model._gridlayout.wunit"
        style="width: 80px"
        size="mini"
      >
         <el-option
          :value="i"
          :label="i"
          v-for="i in units"
          :key="i"
        >
          {{ i }}
        </el-option>
      </el-select>
    </div>
    <div class="style-item">
      高度
      <el-input
        style="width: 180px"
        type="number"
        v-model.number="obj.model._gridlayout.h"
        size="mini"
        placeholder=""
      ></el-input>
      <el-select
        v-model="obj.model._gridlayout.hunit"
        style="width: 80px"
        size="mini"
      >
        <el-option
          :value="i"
          :label="i"
          v-for="i in units"
          :key="i"
        >
          {{ i }}
        </el-option>
      </el-select>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "baseStyle",
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data(){
    return{
          units:['%','px']

    }
  },
  watch:{
      obj:{
        deep:true,
        handler(v){
      }
    }
  },
  computed: {
    // model() {
    //   return this.obj.model &&this.obj.model._gridlayout || {};
    // },
  },
};
</script>

<style lang="scss" scoped>
.base-style {
  width: 100%;
  .style-item {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 27px;
    color: #333333;
  }
}
</style>