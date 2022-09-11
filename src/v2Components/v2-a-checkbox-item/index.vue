<template>
<div style="display:flex">
   <el-checkbox size="mini" :checked="vModel" @change="handleChange" :disabled="disabled">
      {{label}}
    </el-checkbox>
    <p v-show="vModel" style="margin-left:12px; color:red">{{tip}}</p>
</div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2ACheckboxItem',
  props: {
    value: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    label:{
      type:String,
      default:''
    },
    tip:{
       type:String,
       default:''
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    }
  },
  data() {
    return {
      dataSource: [],
      dataValue: this.value,
    }
  },
  watch: {
    "dataValue": {
      handler(n) {
        if (this.$parent.config) {
          this.$parent.config.value = n;
        } else {
          this.$emit('update:value', n);
        }
      }
    },
    "value": {
      handler(n) {
        this.dataValue = n;
      }
    }
  },
  methods:{
    handleChange(e) {
      this.dataValue = e.target.checked;
    }
  }
}
</script>

<style>

</style>