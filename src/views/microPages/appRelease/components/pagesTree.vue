<template>
  <tree-component title="页面" :data="data" :checkedNodes="checkedNodes" :defaultProps="defaultProps" />
</template>

<script>
  import treeComponent from './treeComponent.vue';

export default {
  components: {
    treeComponent
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedNodes: []
    };
  },
  watch: {

  },
  created() {
    const ctx = this;
    ctx.getPageList();
  },
  computed: {
    getStore(){
      if(this.store){
        return this.store
      }else{
        return this.$store
      }
    },
    tenantId() {
      return this.getStore.getters["user/tenantId"];
    }
  },
  methods: {
    async getPageList() {
      const ctx = this;
      let params = {
        tenantId: ctx.tenantId,
        parentId: "root",
      };
      ctx.data = await ctx.getStore.dispatch(
        "page/getReleasePageList",
        params
      );
      console.log('ctx.data', ctx.data);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>