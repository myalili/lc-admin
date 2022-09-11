<template>
  <div class="v2-a-step w-full h-full flex items-center">
    <el-steps :active="Number(vModel)" align-center size="mini" class="w-full">
      <el-step :title="item.model.title" v-for="item in stepArr" :key="item.model.title"></el-step>
    </el-steps>
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  inject: ["root"],
  name: "v2AStep",
  props: {
    stepArr: {
      type: Array,
      default: ()=> {
        return []
      }
    }
  },
  data() {
    return {
      pck,
    }
  },
  watch: {
    stepArr: {
      handler(e) {
        console.log(e);
      },
      deep: true,
      immediate:true
    }
  },
  computed: {
  },
  methods: {},
};
</script>

<style>
</style>