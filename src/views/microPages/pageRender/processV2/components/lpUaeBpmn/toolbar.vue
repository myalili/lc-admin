<template>
   <div class='inline-block process-toolbar-wrapper'>
      <!-- <el-button v-if="!readonly" :loading="updating" @click="handleSave">保存</el-button> -->
      
      <!-- <el-button :loading="publishing" @click="handlePublish">部署</el-button> -->
      <!-- <el-button @click="handlePreview">预览</el-button>
      <el-button @click="handleDownloadXml">下载XML</el-button>
      <el-button v-if="!readonly" icon="el-icon-folder-opened" @click="importXml">打开文件</el-button> -->
       <i title="预览xml" class='iconfont icon-yulanXML inline-block cursor-pointer' @click="handlePreview"></i>
       <i title="下载xml" class='iconfont icon-xiazaiXML inline-block cursor-pointer' @click="handleDownloadXml"></i>
       <i title="打开文件" class='iconfont icon-dakaiwenjian inline-block cursor-pointer' @click="importXml"></i>
       <!-- <el-button v-if="!readonly" :loading="updating" @click="handleSaveAsVersion" icon='iconfont icon-cunweibanben' round size='mini' class='save-as-ver-btn cursor-pointer'>存为版本</el-button> -->
    </div>
</template>

<script>
export default {
   data(){
       return {
         updating: false,
       }
    
   },
   mounted(){
       let self =this;
       window.msgHub.$on('process_updating',(val)=>{
           self.updating = val
       })
   },
   computed: {
    // readonly() {
    //     //   return !!this.$route.query.version;
    //     return this.$route.query.status==='published'
    // }
   }, 
   methods:{
    //    handleSaveAsVersion(){
    //        window.msgHub.$emit('process_save_as_version')
    //    },
       handlePreview(){
           window.msgHub.$emit('process_preview')
       },
       handleDownloadXml(){
            window.msgHub.$emit('process_download_xml')
       },
       importXml(){
            window.msgHub.$emit('process_import_xml')
       }

   },
   beforeDestroy(){
        window.msgHub.$off('process_updating')
   }
}
</script>

<style lang='less' scoped>
.process-toolbar-wrapper{
    height:50px;
    .save-as-ver-btn{
        color:#4769B3;
        height:28px;
        border-color:#4769B3;
        padding:7px 12px;
        margin-right:12px;
        line-height: 14px;
         &::v-deep span{
             vertical-align: text-top;
         }
         &::v-deep .iconfont{
            font-size: 12px;
            margin-right:4px;
            vertical-align: top;
        }
    }

    i{
        color:#374E71;
        margin-right:16px;
    }
   
}
</style>