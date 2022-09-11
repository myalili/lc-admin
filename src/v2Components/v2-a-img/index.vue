<template>
  <img class="img" :src="src" :alt="alt">
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AImg',
  props: {
    src: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    alt: {
      type: String,
      default: ()=> {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scope>
.img {
  width: 100%;
  height: 100%;
}

</style>