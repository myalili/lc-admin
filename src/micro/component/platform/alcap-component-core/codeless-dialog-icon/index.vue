<template>
  <div class="dialog-icon">
    <div class="flex items-center icon-ctn-size justify-center cursor-pointer" :class="{'border-dash':!dataValue}" @click="openIconDialog" style="{'width':width,'height':height}">
      
      <!-- <el-button size="mini" type="primary" @click="openIconDialog">选择图标</el-button> -->
      <!-- <codeless-icon class="w-2 h-2 gray" icon='icon-jiahao' v-if="!dataValue"></codeless-icon> -->
      <i class="iconfont icon-jiahao black codeless-font-size-10" v-if="!dataValue"></i>
      <codeless-icon class="w-4 h-4" :icon='dataValue' v-else></codeless-icon>
      <!-- <svg class="w-4 h-4 ml-2" aria-hidden="true">
          <use :xlink:href="'#' + dataValue"></use>
        </svg> -->
    </div>

  </div>
</template>

<script>
export default {
  name: 'codelessDialogIcon',
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
    openIconDialog(){
      const ctx = this;
      ctx.open({
        path: 'iconSelect',
        component:Vue.options.components.codelessIconSelectCtn,
        width:'60%',
        type: "SUB",
        body:true,
        params:{
          title:'更改图标',
          icon:ctx.active,
          operationEnable:ctx.operationEnable,
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        customClass:'codeless-custom-dialog',
        confirmCallback: ctx.handleChange
      })
    },
    handleChange(icon) {
      const ctx = this;
      // ctx.dataValue = ctx.active;
      ctx.dataValue = icon;
      ctx.$emit('update:value', icon);
      // ctx.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-icon{
  .icon-ctn-size{
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