<template>
  <div class="dialog-pic">
    <div class="flex items-center pic-ctn-size justify-center cursor-pointer" :class="{'border-dash':!dataValue}" @click="openPicDialog" style="{'width':width,'height':height}">
      <!-- <i class="picfont pic-jiahao black codeless-font-size-10" v-if="!dataValue"></i>
      <codeless-pic class="w-4 h-4" :pic='dataValue' v-else></codeless-pic> -->
      <img :src="dataValue" alt="" srcset="">
    </div>

  </div>
</template>

<script>
export default {
  name: 'codelessDialogPic',
  mixins:[window.V8.mixins],
  props: {
    AParams: {
      type: Object,
      default() {
        return {}
      }
    },
    value: {
      type: String,
      default() {
        return ''
      }
    },
    operationEnable:{
      type:Boolean,
      default:false
    },
    height:{
      type: String,
      default:""
    },
    width:{
      type: String,
      default:""
    }
  },
  data() {
    return {
      active: '',
      dataValue: this.value,
      // visible: false,
      // searchText: ''
    }
  },
  watch: {
    "dataValue": {
      handler(n) {
        if (this.$parent.config) {
          this.$parent.config.value = n;
        } else {
          this.$emit('update:value', n);
        }
      }
    },
    "value": {
      handler(n) {
        this.dataValue = n;
      }
    }
  },
  methods: {
    openPicDialog(){
      const ctx = this;
      ctx.open({
        path: 'picSelect',
        component:Vue.options.components.codelessPicSelectCtn,
        width:'60%',
        type: "SUB",
        body:true,
        params:{
          title:'更改图片',
          pic:ctx.active,
          operationEnable:ctx.operationEnable,
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        customClass:'codeless-custom-dialog',
        confirmCallback: ctx.handleChange
      })
    },
    handleChange(pic) {
      const ctx = this;
      // ctx.dataValue = ctx.active;
      ctx.dataValue = pic;
      ctx.$emit('update:value', pic);
      // ctx.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-pic{
  .pic-ctn-size{
    width:28px;
    height:28px;
    border:1px solid var(--codeless-border-color-gray);
    border-radius: 4px;
    &.border-dash{
      border:1px dashed var(--color-gray);
    }
    .black{

         color: var(--codeless-font-color-primary);
      
    }
  }
}

</style>