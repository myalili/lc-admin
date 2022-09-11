<template>
    <div class="codeless-custom-dialog-footer-ctn text-center" v-if="!hideConfirmBtn || !hideCancelBtn">
        <el-button v-if='!hideConfirmBtn' @click.stop ='confirm' :loading="loading" size='mini' round :disabled="loading" type="primary" class='text-white  hover:text-white focus:text-white codeless-btn-padding' >{{confirmBtnText}}</el-button>
        <el-button v-if='!hideCancelBtn' @click.stop ='cancel' :loading="loading" size='mini' :disabled="loading" type='plain' round class='text-gray-7F8C93 border-gray-7F8C93 hover:text-gray-7F8C93 hover:border-gray-7F8C93 hover:bg-white focus:text-gray-7F8C93 focus:border-gray-7F8C93 focus:bg-white codeless-btn-padding'>{{cancelBtnText}}</el-button>
    </div>
</template>
<script>
export default {
  name: "dialogFooter",
  inheritAttrs: false,
  data() {
    return {
    
    };
  },
  mounted() {
    
  },
  beforeDestroy() {
  },
  computed: {
   
  },
  props: {
    
    loading:{
      type:Boolean,
      default:false
    },
    confirmBtnText:{
      type:String,
      default:'确定',
    },
    cancelBtnText:{
      type:String,
      default:'取消',
    },
    hideConfirmBtn:{
      type:Boolean,
      default:false
    },
    hideCancelBtn:{
      type:Boolean,
      default:false
    },

  },

  methods: {
    confirm(){
      
        this.$emit('confirm')
      
     
    },
    cancel(){
   
        this.$emit('cancel')
      
    }
  },
};
</script>
<style lang="less" scoped>
  .codeless-custom-dialog-footer-ctn{
    padding:12px 0;
    border-top:1px solid #E6EAED;

    ::v-deep  .el-button{
    //  padding:8px 26px;
     font-weight: 400;
     font-size: 14px;
    //  padding:7px 25px;

    //  &.el-button--plain{
    //    padding:7px 20px;
    //  }
    //  &:hover{
    //     color: unset;
    //     border-color: unset;
    //     background-color: unset;
    //  }
       
    //  border:none;
    //  color:#ffffff;
    }
  }
</style>
