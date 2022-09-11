<template>
  <div class="code-less-skeleton">
    <!-- <div v-for="(item, i) in 6" :key="i" class="code-less-skeleton-div"></div> -->
  </div>
</template>
<script>
export default {
  name: 'skeleton',
  data() {
    return {};
  },
};
</script>

<style scoped>
.code-less-skeleton {
  width: 100%;
  height: 100%;

  border-radius: 6px;
  background: linear-gradient(90deg, #f9fafc 25%, #eee 37%, #f9fafc 63%);
  background-size: 400% 100%;
  -webkit-animation: ant-skeleton-loading 1.4s ease infinite;
  animation: ant-skeleton-loading 1.4s ease infinite;
}
</style>
