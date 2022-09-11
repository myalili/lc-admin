<template>
  <div class="array" v-if="isShow">
    <div class="string_input">
      {{ item.desp }}
      <i class="el-icon-circle-plus cursor-pointer text-blue-400 text-lg" @click="add(obj.model[item.name].length)"></i>
    </div>
    <div class="" >
      <!-- <div class="flex items-center">
        <span class="flex items-center justify-center" style="width:120px">标签名</span>
        <span class="flex items-center justify-center" style="width:150px">标签值</span>
      </div> -->
      <div class="flex justify-between w-full" v-for="(itemi, indexi) in obj.model[item.name]" :key="indexi">
        <div class="w-full">
          <base-component
            :option="attrInEachElement"
            v-for="item in attrInEachElement"
            :key="item.name"
            :item="item"
            :obj="itemi"
          ></base-component>
          <div class="">
            <i class="el-icon-remove cursor-pointer text-red-500 text-lg" @click="del(itemi, indexi)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { require } from './mixins'
export default {
  mixins: [ require ],
  props: {
    obj: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    item: {
      type: Object,
      default: ()=> {
        return {};
      }
    }
  },
   data() {
    return {
      attrInEachElement: []
    }
  },
  created() {
    console.log(this.item);
    console.log(this.obj);
    this.attrInEachElement = this.item.attrInEachElement
  },
  computed: {

  },
  methods: {
    add(indexi) {
      const ctx = this;
      let attrObj = { model: {} }
      ctx.item.attrInEachElement.forEach(e => {
        attrObj.model[e.name] = e.defaultValue
      });
      ctx.obj.model[ctx.item.name].push(attrObj)
    },
    del(itemi, indexi){
      const ctx = this;
      ctx.obj.model[ctx.item.name].splice(indexi, 1);
    }
  }
}
</script>

<style lang="less" scoped>
.array {
  .string_input {
    width: 100%;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 27px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

</style>