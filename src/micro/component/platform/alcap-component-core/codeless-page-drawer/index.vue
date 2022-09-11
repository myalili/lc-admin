<template>
  <el-drawer
    :title="title"
    v-if="drawer"
    :visible.sync="drawer"
    size="50%"
    :modal="false"
  >
    <page-render :params="params" page="codeLess/index" v-if="params.page" />
  </el-drawer>
  
</template>

<script>
// import PageRender from '@/v2Components/v2-a-tabs-render/components/page-render.vue';
export default {
  name: "pageDrawer",
  components: {
    // PageRender
  },
  props: {
    params: {
      type: [Object, Array],
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: this.visible,
      direction: "rtl",
      page: null,
      // subComponent: this.getPage(this.page),
    };
  },
  watch: {
    drawer: {
      handler(n) {
        this.$emit('update:visible', n)
      }
    },
    visible: {
      handler(n) {
        this.drawer = n
      }
    },
  },
  computed: {

    title() {
      return this.params.page.title || ''
    }
  },
  created() {
  },
  mounted() {
    const ctx = this;
  },
  methods: {
  },
};
</script>