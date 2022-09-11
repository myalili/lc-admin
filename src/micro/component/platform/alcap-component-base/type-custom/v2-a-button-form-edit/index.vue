<template>
  <div class="v2-a-button-form-edit w-full h-full">
    <span class="sub-title -mb-1  mt-2">
      <span
        ><i
          class="el-icon-caret-bottom"
        />操作按钮：</span
      >
      <el-button type="primary" class="w-5 h-5" style="padding: 0;" icon="el-icon-plus" circle @click="openForm('Btn')" size="mini"></el-button>
    </span>
      <prototype-config
        v-for="(itemo, indexo) in obj.model.formData.opr"
        :key="itemo.name"
        :index="indexo"
        :proto="itemo"
        :editComponent="editComponent"
        type="Btn"
        @formConfig="formConfig($event, indexo, 'opr')"
        @del="fieldsSplice($event, 'opr')"
      />

  </div>
</template>

<script>
import prototypeConfig from "../v2-a-form-search-edit/components/prototypeConfig.vue";
import BtnForm from "../v2-a-form-search-edit/components/btnForm.vue";

import pck from "./package.json";
export default {
  name: "v2AButtonFormEdit",
  _options: pck.docs,
  mixins: [window.codelessMixins.customDialog],
  inject: [ 'root' ],
  components: {
    prototypeConfig,
    BtnForm
  },
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
  },
  data() {
    return {
      visible: false,
      value: '',
      editComponent: 'formConfig'
    }
  },
  watch: {
 
  },
  methods: {
    formConfig(form, index, name) {
      const ctx = this;
      if (!form.wid) form.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      ctx.$set(ctx.obj.model.formData[name], index, form);
      ctx.$forceUpdate();
      console.log(name, ctx.obj.model.formData[name]);
    },
    fieldsSplice(itemi, type = "filter") {
      const ctx = this;
      if (ctx.obj.model.formData[type].some((i) => i.id ? i.id === itemi.id : i.wid === itemi.wid)) {
        itemi = ctx.obj.model.formData[type].find(i => i.id ? i.id === itemi.id : i.wid === itemi.wid);
        ctx.obj.model.formData[type].splice(
          ctx.obj.model.formData[type].findIndex((i) => i.id ? i.id === itemi.id : i.wid === itemi.wid),
          1
        );
      } else {
        ctx.obj.model.formData[type].push({
          ...itemi,
          component: itemi.component || { ...ctx.v2AInput },
          wid: new Date().valueOf() + ((Math.random() * 100000) | 0)
        });
      }
    },
    openForm(type) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let params = { entity: {}, argsArr: ctx.root.argsArr, fields: [], editComponent: ctx.editComponent };
      ctx.openCustomDialog({
         path:`${type}Form`,
         title: `创建/编辑${type === "Btn" ? "按钮" : "模块"}`,
           width: "70%",
           propsData:{
             params
           },
          component: ctx.$options.components[`${type}Form`],
          beforeConfirm:($_dontCare,$el)=>{
             return  $el.onSubmit(ctx.handleSubmit)
          }
      })
    },
    handleSubmit(type, form) {
      const ctx = this;
      if (!form.wid) form.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      ctx.obj.model.formData[type === "Btn" ? "opr" : "tableOpr"].push(form);
      console.log("新增后的", form);
      // ctx.dialogInfo.visible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.v2-a-button-form-edit {
  .base-edit {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 27px;
    color: #333333;
  }
  .full-screen-container{
    z-index: 2;
  }
}

</style>