<template>
   <div class="document w-full h-full">
    <div class="flex w-full rounded-md h-full bg-white">
      <schema-list></schema-list>
      <schema-content></schema-content>
    </div>
  </div>
</template>
<script>
import schemaList from "./components/schemaList.vue"
import schemaContent from "./components/schemaContent.vue"
export default {
  name:"dataStructure",
  data() {
    return {
    };
  },
  components:{
      schemaList,
      schemaContent
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    
  },
};
</script>
<style lang="scss" scoped>
.document{
  ::v-deep .icon-jiahao {
        font-size: 12px;
        transform: scale(0.8);
      }
}
  
</style>