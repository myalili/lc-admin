<template>
  <div class="my-page">
    <!-- <remote-js cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/js/plugin.js"></remote-js>
    <remote-js cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/luckysheet.umd.js"></remote-js>
     
    <remote-css cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/css/pluginsCss.css"></remote-css>
    <remote-css cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/plugins.css"></remote-css>
    <remote-css cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/css/luckysheet.css"></remote-css>
    <remote-css cdn="https://cdn.jsdelivr.net/npm/luckysheet/dist/assets/iconfont/iconfont.css"></remote-css> -->

    <!-- <remote-js cdn="file/luckyExcel/plugins/js/plugin.js"></remote-js>
    <remote-js cdn="file/luckyExcel/luckysheet.umd.js"></remote-js>
     
    <remote-css cdn="file/luckyExcel/plugins/css/pluginsCss.css"></remote-css>
    <remote-css cdn="file/luckyExcel/plugins/plugins.css"></remote-css>
    <remote-css cdn="file/luckyExcel/css/luckysheet.css"></remote-css>
    <remote-css cdn="file/luckyExcel/assets/iconfont/iconfont.css"></remote-css> -->
  </div>
</template>
<script>
export default {
  components: {
    "remote-js": {
      render(createElement) {
        return createElement("script", {
          attrs: {
            type: "text/javascript",
            src: this.cdn,
          },
        });
      },
      props: {
        cdn: {
          type: String,
        },
      },
    },
    "remote-css": {
      render(createElement) {
        return createElement("link", {
          attrs: {
            rel: "stylesheet",
            type: "text/css",
            href: this.cdn,
          },
        });
      },
      props: {
        cdn: {
          type: String,
        },
      },
    },
  },
};
</script>

<style>
</style>