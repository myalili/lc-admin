<template>
  <div class="v2-a-work-links">
    <div class="links-head">
      <div style="font-weight: bold">{{ config.title }}</div>
    </div>
    <div class="links-wrap">
      <div class="link-item" v-for="(link, index) of config.links" :key="index">
        <el-button @click="openPage(link)">{{ link.name }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  mixins: [window.codelessMixins.customDialog],
  _options: pck.docs,
  name: "v2AWorkLinks",

  props: {
    config: {},
  },

  methods: {
    openPage(link) {
      if (!link.page) return;
      const item = link.page;
      let params = {
        title: '',
        pageId: item.prototypeId,
        prototypeId: item.prototypeId,
        runtime: true,
        syncParamsObj
      };

      let option = {
        title: item.title || '',
        path: 'openSinglePage/render',
        params
      }

      ctx.v2ComponentOpen(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-links {
  width: 100%;
  padding: 8px;
  background: white;
  border-radius: 4px;

  .links-head {
    padding: 8px 0;
  }

  .links-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    border-top: 1px solid #e0e0e0;

    .link-item {
      width: 250px;
      margin-top: 16px;

      button {
        width: 100%;
      }
    }
  }
}
</style>
