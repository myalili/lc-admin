<template>
  <el-button type="text" @click="openPage">
    <span class="truncate">{{ title }}</span>
  </el-button>
</template>

<script>
import pck from "./package.json";

export default {
  mixins: [ window.codelessMixins.customDialog ],
  inject: ["root"],
  _options: pck.docs,
  name: 'v2ATableLink',
  props: {
    params: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    item: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
  },
  data() {
    return {
      syncParam: '',
      p: '',
      c: ''
    }
  },
  computed: {
    title() {
      return (this.params.row && this.params.row[this.params.column.dataIndex]) || '文字按钮'
    },
    page() {
      return (this.params.column && this.params.column.page) || {}
    }
  },
  watch: {
  },
  mounted() {

  },
  methods: {
    openPage() {
      const ctx = this;
      if (!ctx.page) return;
      let item = ctx.page;
      console.log('要跳转的页面',item);
      let syncParamsObj = {}
      if (ctx.item.syncParams) {
        
        ctx.item.syncParams.forEach(i=> {
          if (i.current) {
            if (i.isComponent) {
            
              ctx.$set(syncParamsObj, i.target, eval('ctx.params.' + i.current))
            }else {
              ctx.$set(syncParamsObj, i.target, eval('ctx.root.args.' + i.current))
            }
          }
          
        })
      }
      console.log('参数', syncParamsObj);

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
        params,
        dialogInfo: item.dialogInfo
      }

      ctx.v2ComponentOpen(option);
    },
  }
}
</script>

<style>

</style>