<template>
    <div class='codeless-custom-dialog-wrapper'>
        <dialogHeader :title='title' v-if='!hideHeader' @close='closeDialog'>
          <template v-slot:titleRight>
            <slot name='titleRight'></slot>
          </template>
          <template  v-slot:title>
              <slot name='title'></slot>
          </template>
          <template v-slot:default>
            <slot></slot>
          </template>
        </dialogHeader>
        <div class='codeless-custom-dialog-body-ctn overflow-auto' :style="{ 'height': `calc(100% - 42px ${!hideFooter ? '- 55px' : ''})`, 'max-height': maxHeight }">
            <slot name='dialogContent'></slot>
           <component :is='curComponent' ref='ctt'  v-bind="bindData"></component>
        </div>
        <dialogFooter
          @cancel ='cancelCallback'
          @confirm ='confirmCallback'
          v-if ='!hideFooter' 
          v-on="$listeners" 
          v-bind="$attrs">
        </dialogFooter>
    </div>
</template>
<script>
export default {
  name: "codelessDialogCtn",
  mixins:[window.V8.mixins],
  inheritAttrs: false,
  data() {
    return {
      bindData:{},
      curComponent:'',
    };
  },
  mounted() {
    // console.log(this.AParams)
    if(this.AParams && this.AParams.__inSPA){
       Object.assign(this.bindData,this.AParams.propsData);
        if(this.AParams.page){
           this.curComponent = window.V8._import(this.AParams.page, false);
        }else if(this.AParams.component){
           this.curComponent = this.AParams.component;
        }
        console.log('最后返回的组件', this.curComponent);
       
       
       this.title = this.AParams.title;
       this.$attrs = this.AParams;
       this.hideFooter = this.AParams.hideFooter;
       this.maxHeight = this.AParams.maxHeight;
    }
  },
  props: {
    title:{
      type:String,
      default:''
    },
    hideHeader:{
      type:Boolean,
      default:false
    },
    hideFooter:{
      type:Boolean,
      default:false
    },
    maxHeight: {
      type:String,
      default:''
    }
  },

  methods: {
    closeDialog(){
      if(this.AParams.__inSPA){
         this.$root.close();
      }else{
        this.$emit('close')
      }
    },
    cancelCallback(){
      if(this.AParams.__inSPA){
        
        this.$root.cancel(false,this.$refs.ctt)
      }
     
    },
    confirmCallback(){
      if(this.AParams.__inSPA){
        this.$root.confirm(this.$refs.ctt,this.$refs.ctt)//第二个this.$refs.ctt兼容vueSPA的beforeConfirm传参
      }
      
    }
  },
};
</script>
<style lang="less" scoped>
.codeless-custom-dialog-wrapper {
  height: 100%;
  .codeless-custom-dialog-body-ctn{
    padding: 20px;
  }
}
  
</style>
