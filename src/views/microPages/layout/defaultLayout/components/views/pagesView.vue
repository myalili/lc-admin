<template>
  <div>
    <page-toggle-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <iFrame
        v-if="$route.meta && $route.meta.iframeUrl"
        :externalUrl="externalUrl"
      ></iFrame>
      <!-- <keep-alive v-else-if="isRouterAlive">
        <router-view></router-view>
      </keep-alive> -->
      <keep-alive v-else-if="$route.meta && $route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </page-toggle-transition>
  </div>
</template>
<script>
import pageToggleTransition from "./pageToggleTransition.vue";
import iFrame from "../iframe/index.vue";
const { getToken } = window.alcapCoreUtils;

export default {
  components: {
    pageToggleTransition,
    iFrame,
  },
  data() {
    return {};
  },
  computed: {
    externalUrl() {
      return (
        (this.$route.meta && this.$route.meta.iframeUrl) +
        "?token=" +
        getToken()
      );
    },
    // info() {
    //   return this.$store.getters["project/GET_PROJECT_INFO"];
    // },
    // isRouterAlive() {
    //   return this.info["keep-alive"];
    // },
    animate() {
      let default_a = {
        disabled: false,
        name: "bounce",
        direction: "left",
      };

      return default_a;
    },
  },
  mounted() {},
};
</script>

<style  lang="less">
</style>