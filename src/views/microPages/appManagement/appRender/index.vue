<template>
  <div
    :class="[
      edit ? 'code-less-editor' : 'code-less-wrapper',
      $route && ($route.query.class || $route.query.pageId),
    ]"
  >
    <skeleton v-if="loading"> </skeleton>
    <template v-else>
      <tool-bar-v2
        :hideRight="hideRight"
        :hideCenter="hideCenter"
        :edit.sync="edit"
        @save="save"
        :type="type"
        :showBack="showBack"
        :title="title"
        v-if="preview"
        :disabled="disabled"
        :versions="versionList"
        @pageContentChange="setPageContent"
      >
      </tool-bar-v2>
      <div class="code-less-content" :class="preview ? 'preview' : ''">
        <component
          :is="curComps"
          ref="componentsRef"
          :page-def="pageContent"
          :edit="edit"
          :params="params"
          :AParams="AParams"
          @submit="submit"
          :pageObj="pageObj"
          
        >
        </component>
      </div>
    </template>
  </div>
</template>

<script>
const { getSource } = window.alcapCoreUtils;
const {
  getPageVersions,
  savePageDraft,
  savePageAsNewVer,
  releasePage,
  deletePage,
  discardPage,
  getPageDetails
} = window.getBffApi();
export default {
  mixins: [window.codelessMixins.customDialog],
  provide() {
    return {
      root: this,
    };
  },
  components: {
    // skeleton,
    // ToolBar,
  },
  props: {
    pageRenderConfig: null,
  },
  data() {
    return {
      showBack:false,
      hideCenter:false,
      hideRight:false,
      loading: false,
      edit: false,
      pageId: "",
      title: "",
      type: "", // 2为普通布局  3 流程  4：：视图 5.配置表单
      preview: false,
      pageContent: {},
      params: {},
      argsArr: [],
      args: {},
      disabled: false,
      versionList: [],
      curComps: "",
      pageObj:{},
      pageCss: {
        bg: "color",
        color: "rgb(231, 236, 239)",
        img: "",
        component: {
          padding: 0,
        },
      }
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        this.refresh();
      },
    },
    edit(val) {
      if (!val) {
        this.refresh();
      }
    },
    "curPage.component": {
      async handler(val) {
        this.curComps = await getSource(val);
        console.log(this.curComps);
      },
    },
  },
  async mounted() {
    // window.msgHub.$on('codeless_tree_refresh',()=>{
    //    this.refresh();
    // })
    await this.refresh();
  },

  computed: {
    pages() {
      let ret = [];
      let pages = activator.getPage();

      if (pages && Object.keys(pages).length) {
        Object.keys(pages).forEach((name) => {
          pages[name] && ret.push(pages[name]);
        });
        // console.log(ret);
      }
      return ret;
    },
    curPage() {
      let page = {};
      let self = this;

      let pat = [];
      let pages = activator.getPage();
      if (pages && Object.keys(pages).length) {
        Object.keys(pages).forEach((name) => {
          pages[name] && pat.push(pages[name]);
        });
        // console.log(ret);
      }

      let ret = pat.filter((item) => {
        return item.type === self.type && item.component;
      });
      ret.length && (page = ret[0]);

      return page;
    },
  },
  methods: {
    getPageParams() {
      const ctx = this;
      console.log("获取到的页面参数", this.params);
      const syncParamsObj = this.params.syncParamsObj;
      for (const key in syncParamsObj) {
        let p = key.substring(0, key.indexOf("."));
        let c = key.substring(key.indexOf(".") + 1);
        ctx.args[p][c] = syncParamsObj[key];
      }
      console.log("eval('ctx.args", ctx.args);
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    async getPageVersionsList(id) {
      let res = await getPageVersions({ id });
      if (res.success) {
        return res.obj;
      } else {
        this.notifyError("获取页面版本", res);
        return "";
      }
    },
    
    setPageContent(pageContent) {

      let content = {};
     
      try {
      
        content = JSON.parse(pageContent);
      } catch (error) {}
      this.pageContent = content;
      if(!this.pageContent.pageList) this.pageContent.pageList = { pageId: this.pageId, children: [] };
      this.argsArr = this.pageContent && this.pageContent.argsArr || [];
      this.args = this.pageContent && this.pageContent.args || {};
      this.pageCss = this.pageContent.pageCss || {
        bg: "color",
        color: "rgb(231, 236, 239)",
        img: "",
        component: {
          padding: 0,
        },
      };
      console.log('获取到页面样式', this.pageContent.pageCss);
      console.log("pageContent", this.pageContent);
      this.getPageParams();
    },
    getArrangedList(list) {
      let ret = [];
      let ret2 = [];
      let ret1 = list.filter((item) => {
        if (item.status === "draft") {
          return item;
        } else {
          ret2.push(item);
        }
      });
      ret2 = ret2.sort((a, b) => {
        let i = 0;

        const arr1 = a.version.split(".");
        const arr2 = b.version.split(".");

        while (true) {
          const s1 = arr1[i];
          const s2 = arr2[i];
          i++;
          if (s1 === undefined || s2 === undefined) {
            return arr2.length - arr1.length;
          }

          if (s1 === s2) continue;

          return s2 - s1;
        }
      });

      ret = ret1.concat(ret2);
      return ret;
    },
    async getReleaseProcessList(id){
      const { queryLpDefinition } = window.getAopsApi();
      const {trimQueryParams,getInvokeResponse} = window.aopsUtils;
       const queryParams = {
          start: 0,
          size: 10000,
          latest:false,
          keyLike:id
        };
               
        trimQueryParams(queryParams);
          let res = await getInvokeResponse(queryLpDefinition(queryParams), '查询流程管理列表');
          let processData = res.data||res.content;
          console.log(processData)
          let processDataVerMap = {}
          processData.forEach(p=>{
            processDataVerMap[p.customVersion.replace(/20\.xml$/,"")] = p
          })
         
         return processDataVerMap
 
    },
    async refresh() {
      // debugger;
      let ctx = this;
      let params = ctx.pageRenderConfig ||ctx.AParams ||(ctx.$route && ctx.$route.query) ||{};
      ctx.params = params;
      ctx.pageId = params.pageId || params.id;
      ctx.preview = params.preview || false;
      ctx.type = params.type;
      ctx.title = params.title;
      ctx.showBack = params.showBack;
      ctx.loading = true;
      console.log("pageId -> ", ctx.pageId, params, ctx.$route, ctx.AParams);
      ctx.hideCenter = params.hideCenter;
      ctx.hideRight = params.hideRight;
      
      if (ctx.pageId) {
          if(ctx.preview && !params.runtime){//应用管理状态 
              ctx.pageObj = params.page;
              let versionList = await ctx.getPageVersionsList(ctx.pageId);
              ctx.versionList = ctx.getArrangedList(versionList);
              if(ctx.type==="3"){
                let processDataVerMap = await ctx.getReleaseProcessList(ctx.pageId);
                ctx.versionList.forEach(v=>{
                  if(processDataVerMap[v.version]){
                    v.status = 'release'
                  }
                })
              }
              ctx.cancelLoading(); 
          }else if(params.runtime){//运行状态
              let id = ''
              if(params.prototypeId){
                let versionList = await ctx.getPageVersionsList(params.prototypeId);
                let version = versionList.filter(item=>item.status==='release');
                id = version[0].id;
                console.log('lynnnnnnnn',id)
              }else{
                id = ctx.pageId
              }
              await getPageDetails({id})
                .then((res)=>{
                  if(res.success){
                      let {obj}= res;
                      let  {codelessType,pageContent,name} = obj;
                      ctx.title = name;
                      ctx.type = codelessType;
                      ctx.pageObj=obj;
                      console.log( ctx.pageObj);
                      ctx.setPageContent(pageContent);
                      ctx.cancelLoading();      
                    }
                  })
                console.log(ctx.title)
          }

      } else {
        this.cancelLoading();
      }
    },
    async releaseProcess(params){
      console.log(params)
      let{deployLpDef} = window.getAopsApi();
      // { clusterId: 'aops-afoe', file: files[0].raw }
      let content = JSON.parse(params.pageContent).content;
     

      content = content.replace(/process id=\"(.*?)\" name=\"(.*?)\"/, "process id=\"" + params.prototypeId + "\" name=\"" + params.name + "\"")
      let blob = new Blob([content],{type:"application/xml;charset=utf8"});
      let transToFile = async(blob,fileName,fileType)=>{
        return new window.File([blob],fileName,{type:fileType})
      }
      let textContain = await transToFile(blob,`${params.id}:${params.version}.bpmn20.xml`,"application/xml")
      console.log(textContain);
      let res = await deployLpDef('aops-afoe', textContain )
      // console.log(params)
      return new Promise(async(resolve,reject)=>{
        if (res.code === 'WFE093435000') {
            let res = await releasePage(params);
            if(res.success){
               resolve({
                  success:true
               })
            }else{
              reject(res) 
            }
        } else {
          reject(res) 
        }
          
      })
    },
    async save({status,ver,id,name}) {
      // if(this.type==="3"){
      //   window.msgHub.$emit('process_save');
      //   return
      // }
      //页面类型都应该暴露一个getPageContent方法,获取组件的页面内容；
      const ctx = this;
      ctx.disabled = true;
      let content = {};
      let _component = this.$refs.componentsRef;
      if (
        _component &&
        _component.getPageContent &&
        typeof _component.getPageContent === "function"
      ) {
        content = await _component.getPageContent();
      }
      this.pageContent = content;
      console.log("页面内容", this.pageContent);
      if(!this.pageContent.pageList) this.pageContent.pageList = { pageId: this.pageId, children: [] };
      
      // let {getReleasePages} = window.getBffApi(); 
      // let res = await getReleasePages({ tenantId: 'P9VM7G'});
      // let pageReleases = res.obj.filter(i=> i.codelessType && i.codelessType !== '0');

      // const { formatAssembler } =window.alcapCoreUtils;
      // console.log('转换一下', formatAssembler(pageReleases));


      this.pageContent.argsArr = this.argsArr;
      this.pageContent.pageCss = this.pageCss;
      for (const i in this.args) {
        for (const key in this.args[i]) {
          const initialValue = this.argsArr.find(arr=>arr.name === i).children.find(child=> child.id === key).initialValue || null;
          this.args[i][key] = initialValue;
        }
      }
      this.pageContent.args = this.args;

      let handler = () => {};
      let params = {
        id: "",
        pageContent: JSON.stringify(this.pageContent),
        prototypeId: ctx.pageId,
        version: "",
      };
      let message = "";      
      switch (status) {
        case "draft":
          handler = savePageDraft;
          params.id =
            (this.versionList[0] &&
              this.versionList[0].status === "draft" &&
              this.versionList[0].id) ||
            "";
          break;

        case "publish":
          handler = savePageAsNewVer;
          params.version = ver;
          break;

        case "release":
          handler = releasePage;
          message = "上架";
          if (id) {
            params.id = id;
          } else {
            params.version = ver;
            let res = await savePageAsNewVer(params);
            if (res.success) {
              params.id = res.obj.id;
            } else {
              ctx.notifyError("发布", res);
              ctx.disabled = false;
              return;
            }
          }
          //流程上架另外处理
           if(ctx.type==="3"){
             params.version = ver;
             params.name = name;
             handler = ctx.releaseProcess;

           }
          break

        case "delete":
          handler = deletePage;
          message = "删除";
          params.id = id;
          break;

        case "discard":
          handler = discardPage;
          message = "下架";
          params.id = id;
          break;
      }
      
      handler(params).then(res=>{
        if(res.success){
          ctx.notifySuccess(message||'保存');
          if(ctx.edit && (status==="draft") && !params.id){
           ctx.versionList.unshift(res.obj)
          }
          !ctx.edit && ctx.refresh()
        }else{
          throw(res)
        }
         ctx.disabled = false;
      }).catch(e=>{
        ctx.notifyError(message||'保存',e)
        ctx.disabled = false;
      })


    },
    submit() {
      const ctx = this;

      ctx.$router.go(-1);
    },
  },
  beforeDestroy() {
    //  window.msgHub.$off('codeless_tree_refresh')
  },
};
</script>

<style lang="less" scoped>
.code-less-wrapper {
  width: 100%;
  height: 100%; 
}
.code-less-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  overflow-x: hidden;

  &.preview {
    height: calc(100% - 50px);
  }
  &::-webkit-scrollbar {
    display: none;
  }

  
}
.code-less-editor {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
    background: #fff;

 .code-less-toolbar {
    background: #fff;
        border-bottom: 1px solid #eee;

  }
}


</style>
