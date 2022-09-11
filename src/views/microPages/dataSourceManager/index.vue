<template>
  <div class="data-source-manager w-full h-full">
    <div class="flex w-full rounded-md h-full bg-white">
      <data-source-list></data-source-list>
      <data-source-content></data-source-content>
    </div>
  </div>
</template>

<script>
import dataSourceList from "./components/dataSourceList.vue"
import dataSourceContent from "./components/dataSourceContent.vue"
export default {
  components: {
    dataSourceList,
    dataSourceContent
  },
  data(){
    return{

    }
  },
  mounted() {
    // console.log(this.projectId);
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
.data-source-manager{
  ::v-deep .icon-jiahao {
        font-size: 12px;
        transform: scale(0.8);
      }
}
</style>