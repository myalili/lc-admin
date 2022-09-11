<template>
  <div class="string_input">
    {{ item.desp }}
    <div class="" >
      <div class="flex items-center">
        <span class="flex items-center justify-center" style="width:120px">属性名</span>
        <span class="flex items-center justify-center" style="width:150px">属性值</span>
      </div>
      <div class="flex items-center " v-for="(itemi, indexi) in item.attrInEachElement" :key="indexi">
        <span class="flex items-center justify-center" style="width:120px">{{ itemi.desp }}</span>
        
        <el-input size="mini" style="width: 120px" class="mr-4" v-model="obj.model[item.name][itemi.name]"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    return {}
  },
  created() {
    console.log(this.item);
    console.log(this.obj);
  },
  computed: {

  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.string_input {
  width: 100%;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
}
</style>