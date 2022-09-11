<template>
  <component
    :is="subComponent"
    v-bind="$attrs"
    v-on="$listeners"
    ref="_op_subPage"
    :pageRenderConfig="{ ...params.page, pageId: params.page.prototypeId, runtime: true }"
  />
</template>

<script>
export default {
  name: "pageRender",
  inheritAttrs: false,

  props: {
    page: {
      default: null,
    },
    params: {
      type: [Object, Array],
      default: () => {},
    },
  },

  data() {
    return {
      subComponent: '',
    };
  },

  watch: {
    page() {
      this.getPage();
    },
  },

  created() {
    // this.$nextTick(async () => {
    //   const subComponent = await this.subComponent();
    //   subComponent.resume && subComponent.resume.call(this.$refs._op_subPage);
    //   this.$refs._op_subPage &&
    //     this.$refs._op_subPage.__resume &&
    //     this.$refs._op_subPage.__resume();
    // });
  },
  mounted() {
    this.getPage();
  },

  async destroyed() {
    // const subComponent = await this.subComponent();
    // subComponent.pause && subComponent.pause.call(this.$children[0]);
    // this.$children.length &&
    //   this.$children[0].__pause &&
    //   this.$children[0].__pause();
  },

  methods: {
    reload(page) {
      this.subComponent = this.getPage(page);
    },

    async getPage(component) {
      const {getSource} = window.alcapCoreUtils;
      component = await getSource("@micro-page/appRender");
      this.subComponent = component;
      // this.$attrs = {
      //   title: this.params.page.title ||  this.params.page.name,
      //   pageId: this.params.page.id,
      //   pid: this.params.page.parentId || '',
      //   type: this.params.page.codelessType,
      // };
    },
  },
};
</script>
