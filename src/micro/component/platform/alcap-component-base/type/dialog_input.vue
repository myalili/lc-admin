<template>
  <div class="dialog_input" v-if="showType">
    {{ item.desp }}
    {{ obj.model.dialogType }}
    <el-input style="width: 180px;" v-model="obj.model[item.name]"  size="mini">
      <span class="cursor-pointer" slot="append" @click="openDialog">
        <codeless-icon :icon="obj.model[item.name] || 'icon-gengduo'" v-if="dialogType === 'icon'"></codeless-icon>
        <el-image style="width: 18px; height: 18px" :src="obj.model[item.name]" lazy v-if="dialogType === 'picture'" alt="图片"></el-image>
      </span>
    </el-input>
  </div>
</template>

<script>
// import dialogInputIcon from './dialog_input_icon.vue';
import dialogInputPicture from './dialog_input_picture.vue';
import { require } from './mixins'
export default {
  mixins: [ window.codelessMixins.customDialog, require, window.codelessMixins.resourceList ],
  components: {
    // dialogInputIcon,
    dialogInputPicture
  },
  props: {
    obj: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    item: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    option: {
      type: Array,
      default: ()=> {
        return [];
      }
    },
  },
   data() {
    return {}
  },
  computed: {
    dialogType() {
      const ctx = this;
      if (ctx.obj.model.dialogType) {
        return ctx.obj.model.dialogType;
      }else {
        return ctx.option[ctx.option.findIndex(i=>i.type === 'dialog_input')].dialogType;
      }
    },
    showType() {
      const ctx = this;
      if (ctx.obj.model.dialogType) {
        if (ctx.obj.model.dialogType === ctx.item.dialogType) {
          return true;
        }else {
          return false
        }
      }else {
        return true;
      }
      
    }
  },
  methods: {
    openDialog() {
      const ctx = this;
      let dialogType = '';
      if (ctx.obj.model.dialogType) {
        dialogType = ctx.obj.model.dialogType;
      }else {
        dialogType = ctx.option[ctx.option.findIndex(i=>i.type === 'dialog_input')].dialogType;
      }
      const typeMap = new Map([
        ['icon', [ '图标', Vue.options.components.codelessIconSelectCtn, { icon: ctx.obj.model[ctx.item.name] }] ],
        ['picture', [ '图片', Vue.options.components.codelessPicSelectCtn, { pic: ctx.obj.model[ctx.item.name] } ]]
      ])
      ctx.open({
        title: '更改' + typeMap.get(dialogType)[0],
        path: `/dialog_input/${ctx.obj.model.dialogType}`,
        component: typeMap.get(dialogType)[1],
        type: "SUB",
        width: "80%",
        body:true,
        params: { obj: ctx.obj, ...typeMap.get(dialogType)[2], item: ctx.item },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        customClass:'codeless-custom-dialog',
        beforeConfirm: $el=>{  //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
          return true;
        },
        confirmCallback: (active, resource) => {
          console.log('这是' + typeMap.get(dialogType)[0], active);
          ctx.$set(ctx.obj.model, ctx.item.name, active);
          ctx.$forceUpdate();

          if(resource) ctx.saveResourceToPageContent(resource);
        },
        cancelCallback: e => {
          console.log("点击取消");
        }
      });

      // ctx.openCustomDialog({
      //     title: '更改' + dialogType === 'icon' ? '图标' : '图片',
      //     // component: ()=>import(`@/micro/component/platform/alcap-component-base/type/dialog_input_${dialogType}`),
      //     component: Vue.options.components.codelessIconSelectCtn,
      //     path: `/dialogInput/${ctx.obj.model.dialogType}`,
      //     width: "70%",
      //     height: "70%",
      //     propsData: {
      //       params: { obj: ctx.obj, item: ctx.item },
      //     },
      //     beforeConfirm: ($el) => {
      //       //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
      //       return true;
      //     },
      //     confirmCallback: ($el) => {
      //       ctx.obj.model[ctx.item.name] = $el.active;
      //     },
      //     cancelCallback: ($el) => {
      //       console.log("点击取消");
      //     },
      //   })
    }
  }
}
</script>

<style lang="less" scoped>
.dialog_input {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
  .pic {
    width: 30px;
    height: 32px;
    box-sizing: border-box;
    border-top: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    border-radius: 0 4px 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
      background: #fdfdff;
    }
  }
}
</style>