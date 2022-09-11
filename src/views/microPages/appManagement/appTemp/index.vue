<template>
  <div class="my-app px-3.5 bg-system">
    <div class="flex items-center justify-between w-full" style="height: 60px" >
    <span class=" text-base font-bold">模板</span>
    </div>
    <app-temp
      class="app-content"
      :tempData="templateData"
      @addModule="openDialog('addModule',$event)"
    ></app-temp>
  </div>
</template>

<script>
const { addPage } = window.getBffApi();
const { getUnkgData,getNpmLibs } = window.getArmApi();
const {getAlcapPlatformVersion} = window.alcapCoreUtils

export default {
  name: 'myApp',
  mixins: [ window.codelessMixins.customDialog ],

  data() {
    return {
      templateData:[]
    };
  },
  computed: {
    tenantId(){
      return this.$store.getters["user/tenantId"]
    }
  },
  async mounted() {
    window.alcapConfig.needArm && await this.getTemplateData();
  },
  methods: {
    async getTemplateData() {
      try {
        let res = await getNpmLibs(
          {
            version:getAlcapPlatformVersion(2),
            scope:"@alcap-app-template",
          }
        );
        if (res.success) {
          this.templateData = res.content;
        }
      } catch (error) {
        console.log("获取模板出错" + error);
      }
    },
    createAppSubmit($el) {
      const ctx = this;
        let obj = {
          codelessType: "0",
          icon: $el.form.icon,
          id:'',
          name: $el.form.name,
          pageContent: "",
          pageType: "",
          parentId: "",
          tenantId: ctx.tenantId,
          version:""
        };
        addPage(obj).then(async(res)=>{
          if(res.success){
            ctx.notifySuccess('创建分类')
            await ctx.getApplicationData();
          }else{
            throw res
          }
          
        }).catch(e=>{
         ctx.notifyError('创建分类',e)
        })
    
    },
    async addModuleSubmit($el) {
      const ctx = this;
        ctx.spinning = true;
           let data = await getUnkgData(
            `${ctx.createTempData.name}@${ctx.createTempData.version}/data.json`
          );
          
          let completed = true;
          let pidMap = {};
          for (let i = -1, item; (item = data[++i]); ) {
            let info = {
                path:item.path||item.info && JSON.parse(item.info).path||''
              };
            let obj = {
              codelessType: item.codelessType,
              icon: item.icon,
              id:'',
              name: item.title||item.name,
              pageContent: item.pageContent,
              pageType:item.pageType,
              info:item.codelessType==="4"?JSON.stringify(info):"",
              tenantId:ctx.tenantId,
              version:item.version,
              parentId:item.parentId
            };
            // if (item.codelessType !== "0") {
            //   obj.path = "codeLess/index";
            // }
            if (!item.parentId||item.parentId==="root") {
              obj.name = $el.form.name;
              obj.icon = $el.form.icon;
              obj.version = ""
            } else {
              obj.parentId = pidMap[item.parentId];
            }
            try{
              let res = await addPage(obj);
              if (res.success) {
                pidMap[item.id] = res.obj.id;
              }else{
                throw res
              }
            }catch(e){
               completed = false;
               ctx.notifyError('以模板新建',e)
              //  ctx.spinning = false;
               break
            }
            
          }
          ctx.spinning = false;
          if(completed){
           ctx.notifySuccess('以模板新建')
            await this.getApplicationData();
          }
           
    },
     openDialog(dialogType,item){
      let ctx = this;
      let option = {};
      let params = {};
      let cb = ()=>{ };
      switch(dialogType){
        case 'addModule':
            cb = ctx.addModuleSubmit;
            ctx.createTempData = item;
            console.log(ctx.createTempData)
            params={
              detail: {
                icon: "icon-yemianmingcheng1",
                name: item.description,
              },
            }
            option = {
              path:'addModule',
              title: `以模板创建分类`,
          }
          break;
      }

      let dialogOption = {
          width: "600px",
          component:'addAppV2',
          propsData: {
              params:{
                name: "分类名称",
                iconName: "分类图标",
                iconEditable: true,
                ...params
              }
            },
          confirmBtnText:'创建',
          ...option,
          beforeConfirm:($_dontCare,$el)=>{
            let result = true;
            $el.$refs.ruleForm.validate(async(valid) => {
              if (valid) {
                await cb($el)
              }else{
                result = false;
              }
            });
            return result
          }
      }

      ctx.openCustomDialog(dialogOption)
      
    },
  }
};
</script>

<style lang="scss" scoped>
.my-app {
  height: 100%;
  .app-content {
    max-height: calc(100% - 60px);
  }
  ::v-deep .el-loading-spinner {
    left: 50%;
  }
}

</style>