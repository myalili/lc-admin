<template>  
  <div class='aops-wrapper aops-el-common'>
    <div class='preview-zone' v-if='!edit'>
       <div class="canvas" ref="canvas"></div>
    </div>
    <div class='edit-zone' v-else>
      <aops-process :pageDef="pageDef" ref="aopsProcess" :params="params"></aops-process>
    </div>
  </div>
</template>
<script>
import processDetail from './components/processEditor.vue';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import processToolbar from "./components/lpUaeBpmn/toolbar.vue";

// const {queryLongProcessByIdAndVersion} = window.getAopsApi();
window.Vue && window.Vue.component("processToolbar", processToolbar);

export default {
  props: ["edit", "pageDef",'params'],
  components: {
    aopsProcess: processDetail,
  },
  data() {
    return {
      // content: {
      //   content: "",
      // },
    };
  },
  watch: {
    edit(val){
      if(!val){
        this.$nextTick(()=>{
           this.createNewDiagram();
        })
       
      }
    },
    "pageDef.content":{
      handler(val){
        if(!this.edit){
           let parent = this.$refs.canvas;
           let children = parent.childNodes;
           for(let i = children.length - 1; i >= 0; i--){
             children[i] && parent.removeChild(children[i]);
           }

           this.$nextTick(()=>{
            this.createNewDiagram();
          })
        }
      }
    }

    
    // pageDef() {},
  },
  computed: {
    // content() {
    //   if (this.pageDef && this.pageDef.content) {
    //     return this.pageDef;
    //   } else {
    //     return {
    //       content: "",
    //     };
    //   }
    // },
  },
  mounted() {
    console.log(this.edit);
    this.$nextTick(() => {
      if(!this.edit){
         this.createNewDiagram();
      }
    });
  },
  
  methods: {
    
    async createNewDiagram() {
      // const res = await this.aopsChoreRequest(
      //       queryLongProcessByIdAndVersion(this.pageDef.id),
      //       '查询长流程'
      //     );
      console.log(this.pageDef)
      
      if(!this.pageDef.content){
       return 
      }
       this.bpmnViewer = new BpmnViewer({
          container: this.$refs.canvas
        });
        await this.bpmnViewer.importXML(this.pageDef.content);
        const canvas = this.bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
      
    },
    async getPageContent() {
      if(this.$refs.aopsProcess && this.$refs.aopsProcess.getUpdateProcess){
          let content = await this.$refs.aopsProcess.getUpdateProcess();
          this.pageDef.content = content;
      }
    
      return  this.pageDef;
    },
  },
};
</script>
<style scoped lang="less">
.aops-wrapper{
  height:100%;
  .edit-zone{
    height:100%;
  }
  .preview-zone{

    &::v-deep .bjs-powered-by {
        display: none;
      }
     &::v-deep .bjs-breadcrumbs{
        display: none;
      }
  }
}

// ::v-deep {
//   .LongProcessDetail {
//    height: 100%!important;
//     aside {
//       background: #fff;
//     }
//   }
//   .PreviewDiagram .canvas {
//     width: 100%;
    
//     height: 100%;
//   }
// }
</style>
