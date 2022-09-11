<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <el-switch v-model="obj.model[item.name]" />
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