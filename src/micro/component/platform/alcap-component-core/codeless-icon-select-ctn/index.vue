<template>
    <codeless-dialog-ctn :title="title" @cancel ='cancel' @confirm='confirm' @close='cancel' class='icon-select-dialog' :loading='loading'>
      <template v-slot:titleRight v-if='operationEnable'>
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            size="small"
            title="导入图标"
            class='bg-primary border-none add-icon'
          >
            <input
              type="file"
              class="icon-summary-upload-btn"
              ref="file2"
              accept="application/zip"
              @change.stop="importFont"
            />
          </el-button>
      </template>
      <template v-slot:default>
        <el-input prefix-icon='iconfont icon-inquiry' size='mini' class='mr-5 w-200' v-model='searchText' clearable @input='search'></el-input>
      </template>
      <template v-slot:dialogContent>
          <div class='codeless-icon-select-ctn' v-loading='loading'>
            <!-- <div v-if='!iconVisible' class='text-center'>加载图标中...</div> -->
                <div class='flex border-t border-b border-gray-F0F5F7 border-solid h-400px'>
                  <div class="w-200 bg-gray-F0F5F7 py-3" style='overflow:overlay'>
                      <div class='h-8 hover:bg-white flex justify-between px-3.5 cursor-pointer items-center icon-list' v-for="c in iconList" :key='c.id' :class="{'active':c.desc===currentCategory.desc}" @click='selectCategory(c)'>
                        <span :title='c.desc==="低代码平台"?"默认图标":c.desc'>{{c.desc==='低代码平台'?"默认图标":c.desc}}</span>
                        <span><i class="iconfont icon-shanchu1 text-gray-7F8C93 cursor-pointer delete invisible"  title='删除图标库' v-if="c.desc!=='低代码平台'" @click='deleteIcon(c)'></i></span>
                      </div>
                  </div>
                  <div class='flex-1'>
                      <div class='icon-wrapper'>
                        <codeless-dialog-input-icon :icon.sync="icon" :icons='showIcons'></codeless-dialog-input-icon>
                      </div>
                     
                        <el-pagination
                            class='flex justify-center items-center pagination-wrapper'
                            background
                            :current-page.sync ='curPage'
                            :page-size="pageSize"
                            @current-change ='currentChangeHandler'
                            layout="prev, pager, next"
                            :total="filterIcons.length">
                          </el-pagination>
                      </div>
                 
                </div>
          </div>
      </template>
    </codeless-dialog-ctn>
</template>
<script>

const {uploadIcon,deleteIcon,getIconList,getIconJson} = window.getBffApi();

export default {
  name: "codelessIconSelectCtn",
  mixins:[window.V8.mixins],
  data() {
    return {
      title:"选择图标",
      loading:false,
      searchText:'',
      currentCategory:{},
      icon:'',
      curPage:1,
      showIcons:[],
      icons:[],
      iconList:[],
      filterIcons:[],
      pageSize:40,
      operationEnable:false,
    };
  },
  mounted() {
   let {title,icon,operationEnable} = this.AParams;

   this.title = title||this.headerTitle;
   this.icon = icon||this.selectIcon;
   this.operationEnable = operationEnable||this.showOperation||this.operationEnable;

   this.getIconSource();
  },
  beforeDestroy() {
  },
  computed: {
    tenantId(){
      return this.$store.getters['user/tenantId']
    }
  },
  props: {
    headerTitle:{
      type:"String",
      default:'',
    },
    showOperation:{
      type:"Boolean",
      default:false,
    },
    selectIcon:{
      type:"String",
      default:"",
    }

  },
   
  methods: {
    search(){
      this.loading = true;
      this.getFilterIcons();
      this.getShowIcons();
      this.loading = false;
    },
    currentChangeHandler(page){
      // console.log(page)
      this.loading = true;
      this.getShowIcons();
      this.loading = false;
    },
    selectCategory(item){
      this.loading = true;
      // console.log(item);
      this.currentCategory = item;
      this.resetCurPage();
      this.getIcons();

    },
    clearInput(e){
        //清空input的值
          e.target.type = "text";
          e.target.value = "";
          e.target.type = "file";
          e.target.disabled = false;
    },
    resetCurPage(){
      this.curPage = 1;
    },
    reloadCss(){
      this.$store.dispatch('icon/reloadIcon',this.tenantId)
    },
    importFont(e) {
      // let fileName =e.target.files[0].name;
      this.loading = true;
      let file = e.target.files[0];
      let formData = new FormData();
     
     
      let self = this;
      formData.append("file", file);
      formData.append("tenantId", self.tenantId);
      e.target.disabled = true;

      uploadIcon(formData).then(res => {
           self.clearInput(e)
          if (res.success) {
            self.$message.success("导入成功");
            self.reloadCss();
            self.getIconSource(res.obj);
           
          } else {
           throw(res)
          }
        
        }).catch(err=>{
           self.$notify.error({
             title:'上传失败',
             message:err.msg||err
           });
           self.loading = false
           console.log(err)
           
        });
    },
    getFilterIcons(){
       let ctx = this;
       ctx.filterIcons = ctx.icons.filter(item=>{
            if(!ctx.searchText || !ctx.searchText.trim().length){
              return true
            }
            return item.label.includes(ctx.searchText.toLowerCase())||item.value.includes(ctx.searchText.toLowerCase())
        })
    },
    getShowIcons(){
      let ctx = this;
       ctx.showIcons = ctx.filterIcons.slice((ctx.curPage-1)*ctx.pageSize,ctx.curPage*ctx.pageSize-1)
    },
    getIcons(){
      let ctx = this;
      let url = ctx.currentCategory.url
      if(!url){
        ctx.icons =[];
        ctx.loading = false
      }else{
      
         getIconJson(`${url}/${ctx.currentCategory.name}/iconfont.json`).then(res=>{
          
           let icons = res.glyphs.map(item=>{
             return {
               label:item.name,
               value:res.css_prefix_text+item.font_class
             }
           })

          ctx.icons = icons;
          ctx.getFilterIcons();
          ctx.getShowIcons();
          ctx.loading = false
         }).catch(e=>{
           ctx.$notify.error({
             title:'获取图标失败',
             message:e
           })
           console.log(e);
           ctx.loading = false
         })
      }
     
    },
    getIconSource(c_item){
     
      let ctx = this;
      ctx.loading = true;
      getIconList(ctx.tenantId).then(res=>{
        //  console.log(res);
        if(res.success){
          ctx.iconList = res.obj;
          if(c_item){
            ctx.currentCategory = c_item;
          }else if(ctx.iconList.length){
            ctx.currentCategory = ctx.iconList.filter(item=>{
              return item.desc==='低代码平台'&& item.name==='iconfont'
            })[0]

            !ctx.currentCategory && (ctx.currentCategory = ctx.iconList[0])
          }else{
            ctx.currentCategory = {}
          }
          ctx.getIcons();
           ctx.loading = false
        }else{
          throw(res)
        }   
      }).catch(e=>{
        ctx.$notify({
          title:'获取图标资源失败',
          message:e.msg||e
        })
        ctx.loading = false
        console.log(e)
      })
    },
    deleteIcon(c){
      let ctx = this;
      this.$confirm('确定要删除该图标库吗?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteIcon(c.id).then((res)=>{
            if(res.success){
              ctx.$message({
                type: 'success',
                message: '删除成功!'
              });

            }else{
              throw res
            }
            ctx.reloadCss();
            ctx.resetCurPage();
            ctx.getIconSource();
              
          }).catch(e=>{
            ctx.$message({
                type: 'error',
                title:'删除失败',
                message: e
            });
            console.log(e)
          })
          
        })
    },
    cancel(){
      this.$root.cancel()
    },
    confirm(){
      this.$root.confirm(this.icon)
    }
  },
};
</script>
<style lang="less" scoped>
.icon-select-dialog{
  color:#333333;
  // .el-dialog__header{
  //   padding:0;
  //   height:52px;
  //   line-height:52px;
  
    ::v-deep .el-input__inner{
      border-radius:200px;
      }
     ::v-deep  .el-input__prefix{
        margin-left:6px;
      }

    ::v-deep .add-icon{
      &.el-button{
          padding:0;
          width:18px;
          height:18px;
          position:relative;
          margin-left:12px;

      &:hover{
        background-image:linear-gradient(135deg, #0AE6F4 0%, #2772FA 100%);
        border: none;
      }  

      >span{
        margin-left:0;
        .icon-summary-upload-btn {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }
      }
    }
  }

  // }
  ::v-deep .codeless-custom-dialog-body-ctn{
    padding: 0;
  }
  .codeless-icon-select-ctn{
      // padding:0;
      font-size: 12px;
      .icon-list{
        &:hover{
          i{
            visibility: visible;
          }
        }
      }
      .active{
          border-image: linear-gradient(180deg, #22D5E6 0%, #3B8BF5 100%) 3;
          border-left:3px solid #ffffff;
          background-color: #ffffff;
      }
      .delete{
        &.iconfont{
          font-size: 12px;
        }
      }

      .icon-wrapper{
        height:calc(100% - 44px);
        overflow: overlay;
      }
      .pagination-wrapper{
        height:44px
      }
  }
}

</style>
