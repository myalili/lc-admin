<template>
  <codeless-grid-layout
    :page-def="content"
    :edit="edit"
  ></codeless-grid-layout>
</template>

<script>
const defaultDef = {
  structure: {
    children: [],
    commonStyle: {
      "background-image": "",
    },
  },
  // componentList: [],
  // dataBasket: {
  //   data: {},
  //   list: [],
  //   mapping: {},
  // },
  events: {},
  display: {},
};
export default {
  props: ["edit", "pageDef"],
  components: {
  },
  data() {
    return {

    };
  },
  computed: {
    content() {
      let pageDef = this.pageDef;

      if (!pageDef || !pageDef.structure) {
        pageDef = this.pageDef = JSON.parse(JSON.stringify(defaultDef));
      }
      console.log('pageDef', pageDef);
      return pageDef;
    },
  },
  mounted() {

  },
  methods: {
    getPageContent() {
      return this.pageDef;
    },
  },
  destroyed() {

  },
};
</script>

<style lang="scss" scoped>

</style>
