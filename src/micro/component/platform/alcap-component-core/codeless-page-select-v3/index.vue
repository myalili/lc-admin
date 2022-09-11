<template>
      <el-popover
          popper-class="el-popover-no-padding codeless-border-radius arm-page-selected-popover codeless-box-shadow"
          :visible-arrow="false"
          trigger="click"
          @hide="removeNode"
        >
          <codeless-release-page-select-panel
            :store="store"
            :selectedItem="selectedItem"
            @select="selectPath"
            :exclusiveChoice="true"
          ></codeless-release-page-select-panel>
          <el-input
            class="page-selected-input"
            size="mini"
            :style="{'width':width}"
            v-model="title"
            slot="reference"
            :disabled="disabled"
          >
            <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
          </el-input>
    </el-popover>
</template>

<script>
const {getPageVersions,getPageDetails} = window.getBffApi();
export default {
  name:"pageSelect",
  mixins: [ window.codelessMixins.pageList ],
  props:{
    store:{
      type:Object,
      default(){
        return null
      }
    },
    value: {
      type: Object,
      default(){
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width:{
      type:String,
      default:""
    }
  },
  data(){
    return {
      title:'',
      selectedItem:'',
    }
    
  },
  mounted(){
    // let ctx = this;
    console.log(this.value)
    // if(ctx.value){
    //   await getPageDetails({ id:ctx.value }).then((res) => {
    //       if (res.success) {
    //         let { obj } = res;
    //         if (obj) {
    //           ctx.title = obj.name||ctx.value
    //         }
    //       }else{
    //         console.log(`获取页面详情失败,${ctx.value}`)
    //       }
    //     });
    // }else{
    //   ctx.title = ctx.value
    // }
      
  },
  watch:{
    value:{
      handler(val){
        let ctx = this;
          if(!this.title && this.value.prototypeId){//初始化时汉化路径
            ctx.selectedItem = ctx.value.prototypeId;
            getPageVersions({ id:ctx.value.prototypeId }).then((res) => {
              if (res.success) {
                // let { obj } = res;
                let versionList = res.obj;
                if (versionList.length) {
                  let releaseVersion = versionList.filter(v=>{
                    return v.status==='release'
                  })
                  if(releaseVersion.length){
                    let releaseId = releaseVersion[0].id
                    getPageDetails({ id:releaseId}).then(res=>{
                      if(res.success){
                         let {obj} = res;
                          let path =  obj.name||ctx.value.prototypeId;
                          console.log(path,obj)
                          ctx.selectPath(path,obj);
                         
                      }else{
                         console.log(res);
                        throw `获取上架页面详情失败,${ctx.value.prototypeId}`
                      }
                     
                    }).catch(e=>{
                      console.log(e);
                      throw `获取上架页面详情失败,${ctx.value.prototypeId}`
                    })
                  }else{
                    throw `该原型id不存在上架版本,${ctx.value.prototypeId}`
                  }
                 
                 
                }else{
                  throw `该原型id不存在版本,${ctx.value.prototypeId}`
                }
               
              }else{
                console.log(res);
                throw `获取上架页面详情失败,${ctx.value.prototypeId}`
              }
              
                
            }).catch(e=>{
               console.log(e);
               ctx.selectPath(ctx.value.prototypeId)
            });
          }else{
            this.$emit("update:value", val);
          }
          
      },
      immediate:true
      
    }
  },
  methods:{
    selectPath(path,obj={}){
      let title = "";
      if(path){
        title = obj.name||path;
      }
      this.title = title;
      this.$emit('select',obj)
      // this.value = obj;
      this.$emit("update:value", { prototypeId: obj.prototypeId });

      // 页面保存到pageContent
      this.savePageListToPageContent(this.wid, obj.prototypeId);
    },
    removeNode($el) {
      // console.log($el)
      let re = document.getElementsByClassName("arm-page-selected-popover");
      for (let i = re.length - 1; i >= 0; i--) {
        if (re[i]) {
          // console.log(ctx.$refs['arm-page-selected-popove'])
          re[i].remove();
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.page-selected-input{
  width:100%;

}

</style>