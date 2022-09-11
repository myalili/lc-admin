<template>
  <div class="v2-a-json w-full h-full overflow-scroll">
    <json-viewer
    :value="jsonData"
    style="background: transparent; padding: 0"
  ></json-viewer>
  </div>
</template>

<script>
import pck from "./package.json";
import JsonViewer from "vue-json-viewer";
Vue.use(JsonViewer);
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  mixins: [listMixin],
  inject: ["root"],
  name: "v2AJson",
  props: {},
  data() {
    return {
      dataOptions: [],
      pck,
    }
  },
  computed: {
    jsonData() {
      return this.dataOptions || null
    }
  },
  methods: {},
};
</script>

<style>
</style>