<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <el-radio-group v-model="obj.model[item.name]" v-if="item.despArray.length < 4"  size="mini" @change="change">
      <el-radio-button :label="item.valueArray[index]" :value="item.valueArray[index]" v-for="(i,index) in item.despArray" :key="i">
        {{ i }}
      </el-radio-button>
    </el-radio-group>
    <el-select v-model="obj.model[item.name]" style="width: 180px;" v-else  size="mini">
      <el-option  :value="item.valueArray[index]" :label="i" v-for="(i,index) in item.despArray" :key="i">
        {{ i }}
      </el-option>
    </el-select>
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
    return {}
  },
  computed: {

  },
  methods: {
    change(e) {
      console.log(this.obj);
    }
  }
}
</script>

<style lang="less" scoped>
.string_input {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
}
</style>