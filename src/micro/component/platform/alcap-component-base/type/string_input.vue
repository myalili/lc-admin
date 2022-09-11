<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <!-- <el-select v-model="syncParam[item.name]" style="width: 180px;" placeholder="请选择" size="mini" @change="handleChange" v-if="item.sync">
      <el-option-group
        v-for="group in root.argsArr"
        :key="group.name"
        :label="group.desc">
        <el-option
          v-for="item in group.children"
          :key="item.id"
          :label="item.name"
          :value="group.name + '.' + item.id">
        </el-option>
      </el-option-group>
    </el-select> -->
    <sync-param style="width: 180px" :is-custom="true" :target-params="root.argsArr" :value.sync="syncParam[item.name]" :componentName="obj.model.name" v-if="item.sync && isSync"/>
    <el-input style="width: 180px;" v-model="obj.model[item.name]" @input="change"  size="mini" v-else />
    <i class=" cursor-pointer" :class="isSync ? 'el-icon-open' : 'el-icon-turn-off'" @click="isSync = !isSync" title="变量绑定开关"  v-if="item.sync"></i>
  </div>
</template>

<script>
import { require } from './mixins'
export default {
  mixins: [ require ],
  inject: [ 'root' ],
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
      isSync: this.item.sync
    }
  },
  mounted() {
    const ctx = this;
    if (ctx.obj.model[ctx.item.name]) {
      ctx.isSync = false
    }
  },
  computed: {
    syncParam: {
      get() {
        
        return this.obj.model.syncParam
      },
      set(val) {
        this.obj.model.syncParam = val
      }
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
    },
    handleChange(e) {
      console.log(e);
      const ctx = this
      msgHub.$emit("syncParam", e);
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