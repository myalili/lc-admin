<template>
  <div class="w-full h-full bg-white">
    <div class="app-detail-toolbar flex items-center">
      <codeless-back @back="back" class="mr-2 ml-3"></codeless-back>
      <span class="title">{{ $route.query.title || title }}</span>
    </div>
    <div class="app-detail-content">
      <router-view ref="router"></router-view>
    </div>
  </div>
</template>

<script>
// import back from "../codeLess/components/back.vue";
export default {
  components: {
    // back,
  },
  data() {
    return {
      title: "",
    };
  },
  methods: {
    back() {
      // this.$router.go(-1);
      window.history.back();
    },
  },
  async mounted() {
    const ctx = this;
    const { getPageDetails } = window.getBffApi();
    let res = await getPageDetails({ id: ctx.$route.query.prototypeId });
    if(!res.success) return
    ctx.title = res.obj.name;
  },
};
</script>

<style lang="less" scoped>
.app-detail-toolbar {
  height: 50px;
  border-bottom: 1px solid #eee;
}
.app-detail-content {
  height: calc(100% - 50px);
}
</style>
