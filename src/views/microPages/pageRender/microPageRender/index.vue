<template>
  <div class="w-full h-full">
    <component
      v-if="pageObj && pageObj.pageType === 'js'"
      :is="subComponent"
      :edit="edit"
      :pageDef="pageDef"
      ref="subPage"
    />
    <div
      class="w-full h-full"
      v-else-if="pageObj && pageObj.pageType === 'iframe'"
    >
      <iframe
        :src="pageObj.path"
        style="height: 100%; width: 100%"
        scrolling="no"
      ></iframe>
    </div>
    <component
      v-else
      :is="vueComponent"
      :edit="edit"
      :pageDef="pageDef"
      ref="subPage"
    />
  </div>
</template>
<script>
const {getSource} = window.alcapCoreUtils;
export default {
  // inject: ["root"],
  props: ["edit", "pageDef","pageObj"],
  components: {},
  data() {
    return {
       subComponent:{},
    };
  },
  computed: {
    // subComponent() {
    //   return  window.V8._require(this.root.pageObj.path);
    // },
    vueComponent() {
      return window.V8._import(this.pageObj.path);
    },
  },
  watch:{
    pageObj(val){
      console.log("pageObj",val)
      this.refresh()
    },
  },

  async mounted() {
    // console.log(JSON.parse(JSON.stringify(this.pageObj)))
    this.refresh()
  },
  methods: {
    async refresh(){
      if(this.pageObj && this.pageObj.pageType === 'js'){
        if(/index\.umd\.min\.js$/.test(this.pageObj.path)){
          this.subComponent = await window.V8._require(this.pageObj.path)();
        }else{
          if(this.pageObj.path){
            this.subComponent = await getSource(this.pageObj.path);
          }else if(this.pageObj.info){
              let {path} = JSON.parse(this.pageObj.info);
              this.subComponent = await getSource(path);
          }
          
        }
      }
    },
    async getContent() {
      let content = await this.$refs.subPage.getContent();
      return content;
    },
  },
};
</script>

<style  lang="less">
</style>