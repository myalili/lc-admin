<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="'#' + icon"></use>
  </svg>
</template>

<script>
export default {
  name: "codelessIcon",
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
.svg-icon {
  width: 18px;
  height: 18px;
}
</style>
