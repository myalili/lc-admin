<template>
  <!-- <span class="data-field mr-4"> -->
    <!-- <el-button type="plain" size="mini" @click="openContent" class='codeless-btn-padding codeless-btn-margin' round
      >数据配置</el-button
    > -->
  <!-- </span> -->
  <div class="codeless-data-field-v2 flex justify-center items-center flex-col" @click="openContent">
    <img style="width: 14px" src="./img/icon-data.png">
    <span>数据配置</span>
  </div>
</template>

<script>
import content from "./content";

export default {
  mixins:[window.codelessMixins.customDialog],
  name: "dataFieldV2",
  inject: ["root"],
  components: {
    content,
  },
  data() {
    return {
      bg: ''
    };
  },
  methods: {
    openContent() {
      const ctx = this;
      this.bg = 'rgba(239, 243, 246, 0.39)'
      ctx.openCustomDialog({
        path: `content`,
        title: `数据配置`,
        width: "70%",
        height: "80%",
        propsData: {
          params: {
            root: ctx.root
          }
        },
        component: ctx.$options.components.content,
        beforeConfirm: () => {
          return true;
        },
        confirmCallback: ($el) => {
          $el.save();
          ctx.root.args = $el.formatObj;
          ctx.root.argsArr = $el.selectEntities;
          ctx.bg = ''
        },
        cancelIdleCallback: ($el) => {
          ctx.bg = ''
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.codeless-data-field-v2 {
  width: 64px;
  height: 50px;
  font-size: 12px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  line-height: 20px;
  color: #7F8C93;
  opacity: 1;
  cursor: pointer;
  img {
    width: 14px;
    margin-bottom: 6px;
  }
}
</style>