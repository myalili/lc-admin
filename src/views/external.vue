<template>
  <router-view></router-view>
</template>
<script>
export default {
  name: "AExternal",
  watch: {
    // $route: {
    //   immediate: true,
    //   handler() {
    //     this.refresh();
    //   },
    // },
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      let external = this.$route.meta && this.$route.meta.externalUrl;
      if (external) {
        window.open(external, external);
      }
    },
  },
};
</script>


