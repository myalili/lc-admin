<template>
  <div
    class="prototype-config flex flex-col items-center"
    @mouseover="hoverIndex = 1"
    @mouseout="hoverIndex = -1"
  >
    <div class="title relative">
      <div class="absolute -left-2 w-8 h-7 config-icon">
        <img :src="icon" alt="" srcset="" />
        <span class="w-6 absolute top-1 left-1 text-white text-sm"
          >0{{ index + 1 }}</span
        >
      </div>
      <span
        :title="
          form.desc ||
          form.name ||
          (form.dictionaryItem &&
            (form.dictionaryItem.desc || form.dictionaryItem.name))
        "
      >
        {{
          form.desc ||
          form.name ||
          (form.dictionaryItem &&
            (form.dictionaryItem.name || form.dictionaryItem.desc))
        }}</span
      >
      <div class="extra" >
        <el-dropdown @command="moveCommand">
          <el-button
            type="text"
            icon="el-icon-rank"
            class="text-sm text-gray-500"
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="up">上移</el-dropdown-item>
            <el-dropdown-item command="down">下移</el-dropdown-item>
            <el-dropdown-item command="top">上移到最前</el-dropdown-item>
            <el-dropdown-item command="bottom">下移到最后</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button
          style="margin-left: 10px"
          type="text"
          icon="el-icon-setting"
          class="text-sm text-gray-500"
          @click="openForm(form)"
        />
        <el-button
          type="text"
          icon="el-icon-delete"
          class="text-sm text-gray-500"
          @click="del(form)"
        />
      </div>
    </div>
    <el-divider />
    <div class="content" v-if="type === 'Prototype'">
      <!-- <div class="proto">
        <div class="pcr">展现方式</div>
        <span>{{ form.schemaType && form.schemaType.name }}</span>
      </div> -->
      <div class="proto">
        <div class="pcr">校验类型</div>
        <span>{{
          (form.dictionaryItem &&
            form.dictionaryItem.validationRuleType &&
            form.dictionaryItem.validationRuleType.validations
              .map((i) => i.tips)
              .toString()) ||
          "暂无校验"
        }}</span>
      </div>
      <div class="proto">
        <div class="pcr">组件</div>
        <span>{{ form.component && form.component.name }}</span>
      </div>
    </div>
    <div class="content" v-if="type === 'Btn'">
      <div class="proto">
        <div class="pcr">{{ form.type && form.type.label }}</div>
        <span>{{ form.opr && form.opr.name }}</span>
      </div>
      <div class="proto">
        <div class="pcr">目标</div>
        <span>{{ form.target && form.target.label }}</span>
      </div>
    </div>
    <div class="content" v-if="type === 'TablePro'">
      <div class="proto">
        <div class="pcr">展现字段</div>
        <span>{{ form.key || proto.key || form.name || proto.name || (form.dictionaryIte && form.dictionaryItem.engNameShort) }}</span>
      </div>
      <div class="proto">
        <div class="pcr">组件</div>
        <span>{{ form.component && proto.component.name || '无' }}</span>
      </div>
    </div>
    <div class="content" v-if="type === 'TableOpr'">
      <div class="proto">
        <div class="pcr">{{ form.type && form.type.label }}</div>
        <span>{{
          (form.entityId && form.entityId.name) ||
          (form.opr && form.opr.name) ||
          ""
        }}</span>
      </div>
      <div class="proto">
        <div class="pcr">目标</div>
        <span>{{ form.target && form.target.label }}</span>
      </div>
    </div>
    <div class="content" v-if="type === 'Module'">
      <div class="proto">
        <div class="pcr">子级</div>
        <span :title="form.children && form.children.map(i=>i.name).toString()">{{ form.children && form.children.map(i=>i.name).toString() }}</span>
      </div>
    </div>
    <img
      class="absolute bottom-0 right-0 w-36"
      :src="bg"
      alt=""
      srcset=""
      v-if="type !== 'Module'"
    />
    <!-- codelessDialogCtn -->
    <!-- <el-dialog
      top="10vh"
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      @close="dialogClose"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        :title="dialogInfo.title"
        @confirm="dialogSubmit"
        @cancel="dialogInfo.visible = false"
        @close="dialogInfo.visible = false"
      >
        <template v-slot:dialogContent>
          <div class="max-h-3/4 overflow-scroll">
            <component
              ref="dialog"
              :is="dialogInfo.component"
              :params="dialogInfo.params"
              @handleSubmit="handleSubmit"
            />
          </div>
        </template>
        <div class="flex items-center justify-between" slot="title">
          <span>{{ dialogInfo.title }}</span>
        </div>
      </codeless-dialog-ctn>
    </el-dialog> -->
  </div>
</template>

<script>
import ModuleForm from "../../v2-a-form-config-edit/components/moduleForm";
import BtnForm from "./btnForm";
import TableOprForm from "./tableOprForm";
import TableProForm from "./tableProForm";
import PrototypeForm from "./prototypeForm";

export default {
  mixins:[window.codelessMixins.customDialog],
  inject: [ 'root' ],
  components: {
    ModuleForm,
    BtnForm,
    TableOprForm,
    TableProForm,
    PrototypeForm,
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    proto: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      default: "prototype",
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      },
    },
    index: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    entity: {
      type: Object,
      default: () => {
        return {};
      },
    },
    editComponent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      hoverIndex: -1,

      dialogInfo: {
        title: "标题",
        visible: false,
        width: "50%",
        params: {},
        component: "",
      },
    };
  },
  mounted() {
    const ctx = this;
    ctx.form = ctx.proto;
  },
  watch: {
    form: {
      handler(n) {
        const ctx = this;
        ctx.$emit("protoChange", n);
      },
    },
  },
  computed: {
    icon() {
      const ctx = this;
      const iconMap = new Map([
        ["Prototype", require("../images/icon_pro.png")],
        ["Btn", require("../images/icon_opr.png")],
        ["TablePro", require("../images/icon_tablePro.png")],
        ["TableOpr", require("../images/icon_opr.png")],
        ["Module", require("../images/icon_tablePro.png")],
      ]);
      return iconMap.get(ctx.type);
    },
    bg() {
      const ctx = this;
      const bgMap = new Map([
        ["Prototype", require("../images/bg_pro.png")],
        ["Btn", require("../images/bg_opr.png")],
        ["TablePro", require("../images/bg_tablePro.png")],
        ["TableOpr", require("../images/bg_opr.png")],
        ["Module", require("../images/bg_tablePro.png")],
      ]);
      return bgMap.get(ctx.type);
    },
  },
  methods: {
    dialogSubmit() {
      this.$refs.dialog.onSubmit();
    },
    moveCommand(command) {
      const ctx = this;
      const type = {
        Prototype: "filter",
        Btn: "opr",
        TablePro: "tablePro",
        TableOpr: "tableOpr",
        Module: "module",
      };
      let name = type[ctx.type];
      if (ctx.type === "Prototype" && !ctx.formData[name]) {
        name = "forms";
      }
      let index = ctx.index;
      console.log("这是" + command);
      if ((command === "up" || command === "top") && index === 0) {
        ctx.$message.error("已经处于置顶，无法上移");
        return;
      }
      if (
        (command === "down" || command === "bottom") &&
        index === ctx.formData[name].length - 1
      ) {
        ctx.$message.error("已经处于最底，无法下移");
        return;
      }
      if (command === "up") {
        var tempOption = ctx.formData[name][index - 1];
        ctx.$set(ctx.formData[name], index - 1, ctx.formData[name][index]);
        ctx.$nextTick(() => {
          ctx.$set(ctx.formData[name], index, tempOption);
        });
      }
      if (command === "down") {
        var tempOption = ctx.formData[name][index + 1];
        ctx.$set(ctx.formData[name], index + 1, ctx.formData[name][index]);
        ctx.$nextTick(() => {
          ctx.$set(ctx.formData[name], index, tempOption);
        });
      }
      if (command === "top") {
        var tempOption = ctx.formData[name][index];
        ctx.formData[name].splice(index, 1);
        ctx.$nextTick(() => {
          ctx.formData[name].unshift(tempOption);
        });
      }
      if (command === "bottom") {
        var tempOption = ctx.formData[name][index];
        ctx.formData[name].splice(index, 1);
        ctx.$nextTick(() => {
          ctx.formData[name].push(tempOption);
        });
      }
    },
    // 打开配置弹窗
    openForm(proto) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let params = { obj: proto };
      params = {
        formData: ctx.formData,
        obj: proto,
        fields: ctx.fields,
        entity: ctx.entity,
        argsArr: ctx.root.argsArr,
        editComponent: ctx.editComponent
      };
      // ctx.dialogInfo.visible = true;

      ctx.openCustomDialog({
         path:`${ctx.type}Form`,
         title: (proto.dictionaryItem && proto.dictionaryItem.name) || proto.name,
           width: "70%",
           propsData:{
             params, 
           },
          component:ctx.$options.components[`${ctx.type}Form`],
          beforeConfirm:($_dontCare,$el)=>{
             return  $el.onSubmit(ctx.handleSubmit)
          }
      })
    },
    // 处理弹窗确认事件
    handleSubmit(type, form) {
      const ctx = this;
      ctx.form = form;
      console.log("修改后的", ctx.form);
      ctx.$emit("formConfig", ctx.form);
      // ctx.dialogInfo.visible = false;
    },
    // 弹窗关闭
    dialogClose() {
      const ctx = this;
      // ctx.$refs.dialog.$refs.form.resetFields();
    },
    del(proto) {
      const ctx = this;
      ctx.$emit("del", proto);
    },
  },
};
</script>

<style lang="less" scoped>
.prototype-config {
  width: 100%;
  background: #ffffff;
  border: 1px solid #c8d0d4;
  box-sizing: border-box;
  padding-bottom: 12px;
  margin-top: 12px;
  border-radius: 5px;
  position: relative;
  .title {
    width: 100%;
    padding: 0 14px 0 32px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    line-height: 40px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content {
    width: 100%;
    box-sizing: border-box;
    padding-left: 18px;
    background: #ffffff !important;
    .proto {
      width: 100%;
      font-size: 14px;
      color: #333333;
      margin-top: 8px;
      display: flex;
      align-items: center;
      .pcr {
        width: 73px;
        height: 25px;
        margin-right: 9px;
        color: #5b5b5b;
        background: #f0f2f5;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 32px;
        color: #5b5b5b;
        opacity: 1;
      }
      span {
        height: 32px;
        max-width: 62%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1; //在第几行显示...
        display: -webkit-box;
        -webkit-box-orient: vertical;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 32px;
        color: #333333;
        opacity: 1;
      }
    }
  }
  ::v-deep .el-divider--horizontal {
    width: 95%;
    margin: 0 !important;
    background: #edf1f2;
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
    .el-dialog {
      .el-dialog__body {
        max-height: 600px;
        overflow-y: scroll;
      }
    }
  }
}
</style>