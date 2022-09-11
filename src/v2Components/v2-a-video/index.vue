<template>
  <video :src="src" controls autoplay class="video" ref="video" width="100%"></video>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AVideo',
  props: {
    src: {
      type: String,
      default: ()=> {
        return ''
      }
    },
  }
}
</script>

<style lang="less" scope>

</style>