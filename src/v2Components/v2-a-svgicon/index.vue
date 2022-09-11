<template>
  <codeless-icon  class="v2-a-svgicon" :icon="icon" :align="align" :vertical="vertical"></codeless-icon>
</template>

<script>
import pck from "./package.json";

export default {
  name: "v2ASvgicon",
  _options: pck.docs,

  props: {
    icon: {
      type: String,
      default: () => {
        return "icon-zuhumingcheng";
      },
    },
    align: {
      type: String,
      default: () => {
        return "center";
      },
    },
    vertical: {
      type: String,
      default: () => {
        return "center";
      },
    }
  },

  data() {
    return {};
  },
};
</script>

<style scoped>
.v2-a-svgicon {
  width: 18px;
  height: 18px;
}
</style>
