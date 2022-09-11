<template>
  <div style="height:100%; width: 100%">
    <iframe :src="externalUrl"  style="height:100%; width: 100%;" scrolling="no"></iframe>

  </div>
</template>

<script>
export default {
  props: {
    externalUrl: {
        type: String,
      },
  },
  data() {
    return {}
  },
  mounted() {
  }
}
</script>

<style lang="less">

</style>
