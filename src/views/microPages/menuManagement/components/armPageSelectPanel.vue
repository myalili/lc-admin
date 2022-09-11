<template>
  <div class="arm-page-selected-ctn">
      <div class="arm-page-selected-ctn-header">
          <el-input v-model="filterText" prefix-icon="el-icon-search" clearable placeholder="搜索关键字" size="mini" class="codeless-input-radius"></el-input>
      </div>
      <div class="arm-page-selected-ctn-body flex" v-loading='loading'>
          <div class="arm-page-selected-ctn-body-left codeless-overlay-y">
              <div v-for="lib in filterNpmLibs" :key="lib.id" class="lib-menu codeless-hover cursor-pointer" @click.stop="getChildren(lib)" :class="{'codeless-selected':currentMenu.id===lib.id}">
                {{lib.description}}
              </div>
          </div>
          <div class="arm-page-selected-ctn-body-right flex-1 codeless-overlay-y">
              <div class="lib-child codeless-hover flex justify-center flex-col cursor-pointer" v-for="c in libChildren" :key="c.id" @click.stop="select(c.name)">
                <div class="child-description codeless-mb-4">{{c.description}}</div>
                <div class="child-name opacity-50">{{c.name}}</div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
const {getNpmLibs} = window.getArmApi();
const {getAlcapPlatformVersion} = window.alcapCoreUtils
export default {

    data(){
        return {
            npmLibs:[],
            libChildren:[],
            currentMenu:{},
            filterText:'',
            filterNpmLibs:[],
            loading:false,
        }
    },
    computed:{
        
    },
    watch:{
        filterText(val){
            if(val && val.length){
                let ret = JSON.parse(JSON.stringify(this.npmLibs));
                this.filterNpmLibs = this.getFilterLibs(ret);
            }else{
                this.filterNpmLibs = this.npmLibs
            }
            this.getChildren(this.filterNpmLibs[0])
        }
    },
    mounted(){
       window.alcapConfig.needArm && this.getNpmPcks();
    },
    methods:{
        select(name){
            console.log(name);
            this.$emit('select',name)
        },
        getFilterLibs(libs){
            let ret = libs;
            let ctx = this;
            ret = libs.filter(i=>{
                if(i.description && i.description.includes(ctx.filterText)||i.name && i.name.includes(ctx.filterText)){
                    return true
                }else{
                    if(i.children && i.children.length){
                      i.children = ctx.getFilterLibs(i.children);
                      if(i.children.length){
                          return true
                      }
                    }
                }
               
            })
            return ret
        },
        getChildren(lib){
            console.log(lib)
            this.currentMenu = lib ||{};
            this.libChildren = this.currentMenu.children||[];
            // console.log(this.libChildren);
        },
        arrangeLibs(libs){
            // console.log(libs);
            let libMap={};
            let ret = [];
            libs.forEach(lib=>{
                let {menu}=lib;
                let id = "all";
                let description ="全部";
                if(menu && menu.id){
                    id=menu.id;
                    description = menu.description||id;
                }
                if(libMap[id]){
                    libMap[id].children.push(lib);
                }else{
                    libMap[id]={
                        id,
                        description,
                        children:[lib]
                    }
                    ret.push(libMap[id])
                }
                
            })
            return ret
        },
        getNpmPcks(){
            let ctx = this;
            ctx.loading = true;
            getNpmLibs({
                version:getAlcapPlatformVersion(2),
                scope:'@micro-page',
            }).then(res=>{
                
                ctx.npmLibs = ctx.arrangeLibs(res.content);
                ctx.filterNpmLibs = ctx.npmLibs;
                ctx.getChildren(ctx.filterNpmLibs[0])
                ctx.loading = false;
                // console.log(res);
            }).catch(e=>{
                this.notify.error("获取资源市场包列表失败");
                console.log(e)
                ctx.loading = false;
            })
        }
    }
}
</script>

<style lang="less" scoped>
.arm-page-selected-ctn{
    width:832px;
    color:#333333;
    .arm-page-selected-ctn-header{
        height:46px;
        line-height:46px;
        text-align: center;
        border-bottom:1px solid var(--color-light-gray);
        ::v-deep .el-input{
            width:400px;
            
            .el-input__icon{
                color:var(--color-gray);
            } 
        }
    }
    .arm-page-selected-ctn-body{
        height:400px;
        width:100%;
        .arm-page-selected-ctn-body-left{
             width:200px;
             padding:8px 0;
             border-right:1px solid var(--color-light-gray);
             .lib-menu{
                 height: 32px;
                 line-height: 32px;
                 padding:0 16px;
             }
        }
        .arm-page-selected-ctn-body-right{
            padding:6px 16px;
            .lib-child{
                height:66px;
                padding:0 16px;
                border-bottom:1px solid var(--color-light-gray);

                .child-name{
                    color:var(--color-gray);
                }
            }
        }

    }

}


</style>