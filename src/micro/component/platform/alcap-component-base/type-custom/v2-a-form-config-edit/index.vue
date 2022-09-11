<template>
  <div class="v2-a-form-config-edit">
    <el-form layout="horizontal" :model="config" size="mini" label-suffix="：">
      <div style="color: #333333; font-size: 14px; font-weight: bold">
        *数据实体：
      </div>
      <el-form-item>
        <entity-select
          :schema-type="schemaType"
          :value.sync="obj.model.formData.entityId"
          :wid="obj.model.formData.wid"
          mode="id"
          @handleChange="entityChange($event, true)"
        ></entity-select>
      </el-form-item>
      <div class="" v-if="obj.model.formData.entityId">
        <div>
          <span class="sub-title">
            <span><i class="el-icon-caret-bottom" />数据绑定：</span>
          </span>
          <div class="mb-2">
            <sync-param
              :value.sync="obj.model.formData.syncParam"
              :componentName="'配置表单组件'"
            />
          </div>
        </div>
        <div>
          <span class="sub-title">
            <span><i class="el-icon-caret-bottom" />表单布局：</span>
          </span>
          <div class="mb-2">
            <el-select
              class="w-full"
              size="mini"
              v-model="obj.model.formData.col"
              placeholder="选择列数 "
            >
              <el-option
                v-for="item in colList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                >{{ item.label }}</el-option
              >
            </el-select>
            <!-- <el-input
            size="mini"
            v-model="obj.model.formData.col"
            placeholder="输入列数"
          ></el-input> -->
          </div>
        </div>


        <div class="mb-2">
          <span class="sub-title">
            <span class="ml-3 font-normal">表单对齐方式：</span>
            <el-radio-group v-model="obj.model.formData.labelPosition" size="mini">
              <el-radio-button label="right">居右</el-radio-button>
              <el-radio-button label="left">居左</el-radio-button>
              <el-radio-button label="top">居上</el-radio-button>
            </el-radio-group>
          </span>
        </div>
        <div class="mb-2">
          <span class="sub-title">
            <span class="ml-3 font-normal">表单域标签宽度：</span>
            <el-input v-model="obj.model.formData.labelWidth" style="width:160px" size="mini" placeholder="单位为px">
              <template slot="append">px</template>
            </el-input>
          </span>
        </div>

        <div>
          <span class="sub-title">
            <span><i class="el-icon-caret-bottom" />模块：</span>
            <!-- <span class="btn-add" @click="openForm('Module')">+</span> -->
            <el-button
              type="primary"
              size="mini"
              class="w-5 h-5"
              style="padding: 0"
              icon="el-icon-plus"
              circle
              @click="openForm('Module')"
            ></el-button>
          </span>
          <el-form-item>
            <prototype-config
              v-for="(itemo, indexo) in obj.model.formData &&
              obj.model.formData.module"
              :key="itemo.name"
              :proto="itemo"
              :index="indexo"
              :entity="selectedEntity"
              type="Module"
              @formConfig="formConfig($event, indexo, 'module')"
              :formData="obj.model.formData"
              :editComponent="editComponent"
              @del="delOpr(itemo, 'module')"
            />
          </el-form-item>
        </div>

        <div class="sub-title -mb-2">
          <span><i class="el-icon-caret-bottom" />表单项：</span>

          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @command="fieldsSplice"
          >
            <!-- <span class="btn-add" @click="(e) => e.preventDefault()">+</span> -->
            <el-button
              type="primary"
              size="mini"
              class="w-5 h-5"
              style="padding: 0"
              icon="el-icon-plus"
              circle
              @click="(e) => e.preventDefault()"
            ></el-button>
            <el-dropdown-menu
              style="width: 220px; max-height: 400px; overflow: scroll"
              slot="dropdown"
            >
              <el-dropdown-item
                v-for="itemi in selectedEntity && selectedEntity.fields"
                :key="itemi.id"
                :command="itemi"
              >
                <div class="flex items-center justify-between">
                  <span>{{
                    itemi.desc ||
                    itemi.name ||
                    (itemi.dictionaryItem && itemi.dictionaryItem.name)
                  }}</span>
                  <i
                    class="el-icon-check text-blue-300"
                    v-if="
                      obj.model.formData &&
                      obj.model.formData.forms.some(
                        (i) =>
                          (i.dictionaryItem && i.dictionaryItem.id) ===
                          (itemi.dictionaryItem && itemi.dictionaryItem.id)
                      )
                    "
                  ></i>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  selectedEntity &&
                  selectedEntity.fields &&
                  selectedEntity.fields.length === 0
                "
              >
                <div class="flex items-center justify-center">
                  <span>暂无数据</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-form-item>
          <prototype-config
            v-for="(itemo, indexo) in obj.model.formData &&
            obj.model.formData.forms"
            :key="itemo.id"
            :proto="itemo"
            :index="indexo"
            :entity="selectedEntity"
            :fields="selectedEntity.fields"
            type="Prototype"
            :formData="obj.model.formData"
            :editComponent="editComponent"
            @formConfig="formConfig($event, indexo, 'forms')"
            @del="fieldsSplice(itemo)"
          />
        </el-form-item>
        <div>
          <span class="sub-title -mb-1">
            <span><i class="el-icon-caret-bottom" />操作按钮：</span>
            <!-- <span class="btn-add" @click="openForm('Btn')">+</span> -->
            <el-button
              type="primary"
              size="mini"
              class="w-5 h-5"
              style="padding: 0"
              icon="el-icon-plus"
              circle
              @click="openForm('Btn')"
            ></el-button>
          </span>
          <el-form-item>
            <prototype-config
              v-for="(itemo, indexo) in obj.model.formData &&
              obj.model.formData.opr"
              :key="itemo.name + itemo.opr.id"
              :proto="itemo"
              :index="indexo"
              :entity="selectedEntity"
              type="Btn"
              :formData="obj.model.formData"
              :editComponent="editComponent"
              @formConfig="formConfig($event, indexo, 'opr')"
              @del="delOpr(itemo, 'opr')"
            />
          </el-form-item>
        </div>
        <div class="mb-2">
          <span class="sub-title">
            <span class="ml-3">按钮布局：</span>
            <el-radio-group v-model="obj.model.formData.btnDisplay" size="mini">
              <el-radio-button label="start">居左</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="end">居右</el-radio-button>
            </el-radio-group>
          </span>
        </div>
        <div class="mb-2">
          <span class="sub-title">
            <span class="ml-3">按钮位置：</span>
            <el-radio-group
              v-model="obj.model.formData.btnPosition"
              size="mini"
            >
              <el-radio-button label="">无</el-radio-button>
              <el-radio-button label="bottom-0">固定底部</el-radio-button>
            </el-radio-group>
          </span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import prototypeConfig from "../v2-a-form-search-edit/components/prototypeConfig.vue";
import lowCodeModuleForm from "./components/moduleForm.vue";
import lowCodeBtnForm from "../v2-a-form-search-edit/components/btnForm.vue";
import lowCodeTableOprForm from "../v2-a-form-search-edit/components/tableOprForm.vue";

const { v2AInput } = window.codelessUtils;

import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AFormConfigEdit",
  mixins: [
    window.codelessMixins.customDialog,
    window.codelessMixins.vRegister,
    window.codelessMixins.entityAuthorities,
    window.codelessMixins.pageList,
  ],
  components: {
    prototypeConfig,
    lowCodeModuleForm,
    lowCodeBtnForm,
    lowCodeTableOprForm,
  },
  props: ["obj", "item", "params", "title"],
  inject: ["root"],
  data() {
    return {
      schemaType: pck.docs.schemaType,

      rules: {},
      searchForm: {},
      filterIds: [],
      visibleFilter: false,

      selectedEntity: {},
      dicts: [],

      // dialogInfo: {
      //   title: "标题",
      //   visible: false,
      //   width: "50%",
      //   params: {},
      //   component: "",
      // },
      oldOpr: {},

      colList: [
        {
          value: "",
          label: "单列",
        },
        {
          value: "2",
          label: "双列",
        },
        {
          value: "3",
          label: "三列",
        },
        {
          value: "4",
          label: "四列",
        },
      ],

      editComponent: 'formConfig'
    };
  },
  async created() {
    const ctx = this;
    if (ctx.obj.model.formData.entityId.id || ctx.obj.model.formData.entityId) {
      ctx.selectedEntity = await pipe.entity.getEntityDetail(
        ctx.obj.model.formData.entityId.id || ctx.obj.model.formData.entityId
      );
    }
    ctx.filterIds = ctx.obj.model.formData.forms;

    if (!ctx.obj.model.formData.labelPosition) {
      ctx.$set(ctx.obj.model.formData, 'labelPosition', 'right');
      ctx.$set(ctx.obj.model.formData, 'labelWidth', '100');
    }
  },
  mounted() {
    const ctx = this;
  },
  watch: {},
  computed: {},
  methods: {
    dialogSubmit() {
      this.$refs.dialog.onSubmit();
    },
    // 弹窗关闭
    dialogClose() {
      const ctx = this;
      // ctx.$refs.dialog.$refs.form.resetFields();
    },

    entityChange(e, isReady) {
      const ctx = this;
      ctx.$set(ctx.obj.model.formData, "btnPosition", "");
      ctx.$set(ctx.obj.model.formData, "btnDisplay", "center");
      ctx.$set(ctx.obj.model.formData, 'labelPosition', 'right');
      ctx.$set(ctx.obj.model.formData, 'labelWidth', '100');

      let selectedEntity;

      selectedEntity = e;

      if (selectedEntity) {
        ctx.obj.model.formData.wid =
          ctx.obj.model.formData.wid || ctx.$parent.model?.wid;
        console.log("之前的字段", [...ctx.filterIds]);
        if ([...ctx.filterIds].length > 0) {
          ctx.delChildrenComp([...ctx.filterIds], ctx.obj.model.formData.wid);
          ctx.delEntityInPageContent(ctx.obj.model.formData.wid, true);
          ctx.delPageInPageContent(ctx.obj.model.formData.wid);
        }
        ctx.filterIds = selectedEntity.fields
          .map((i) => {
            if (!i.hasOwnProperty("component") || !i.component) {
              return {
                ...i,
                component: { ...v2AInput },
                wid: new Date().valueOf() + ((Math.random() * 100000) | 0),
              };
            } else {
              return i;
            }
          })
          .slice(0, 5);
        ctx.selectedEntity = selectedEntity;

        this.fieldsChange(ctx.filterIds, isReady);
        ctx.$set(ctx.obj.model.formData, "col", "");
        ctx.$set(ctx.obj.model.formData, "module", []);
        if (!ctx.obj.model.formData.opr) {
          ctx.$set(ctx.obj.model.formData, "opr", [
            {
              name: "提交",
              icon: "",
              color: "",
              type: {
                label: "通用方法",
                value: "publicMethod",
              },
              entityId: "",
              opr: {
                id: "confirm",
                name: "提交内容",
              },
            },
            {
              name: "重置",
              icon: "",
              color: "",
              type: {
                label: "通用方法",
                value: "publicMethod",
              },
              entityId: "",
              opr: {
                id: "reset",
                name: "重置表单",
              },
            },
          ]);
        }
      }
    },
    fieldsSplice(itemi) {
      const ctx = this;
      if (ctx.obj.model.formData.forms.some((i) => i.id === itemi.id)) {
        itemi = ctx.obj.model.formData.forms.find((i) => i.id === itemi.id);
        if (itemi.entityId) {
          ctx.delEntityInPageContent(
            ctx.obj.model.formData.wid + "-" + itemi.wid
          );
        }
        if (itemi.page?.prototypeId) {
          ctx.delPageInPageContent(
            ctx.obj.model.formData.wid + "-" + itemi.wid
          );
        }
        ctx.delChildrenComp([itemi], ctx.obj.model.formData.wid);
        ctx.obj.model.formData.forms.splice(
          ctx.obj.model.formData.forms.findIndex((i) => i.id === itemi.id),
          1
        );
        ctx.obj.model.formData.module.forEach((module) => {
          if (
            module.children.findIndex((i) => i === itemi.dictionaryItem.name) >
            -1
          ) {
            module.children.splice(
              module.children.findIndex((i) => i === itemi.dictionaryItem.name),
              1
            );
          }
        });
      } else {
        ctx.obj.model.formData.forms.push({
          ...itemi,
          component: itemi.component || v2AInput,
          wid: new Date().valueOf() + ((Math.random() * 100000) | 0),
        });
      }
    },
    delOpr(itemo, type) {
      const ctx = this;
      if (ctx.obj.model.formData[type].some((i) => i.name === itemo.name)) {
        if (itemo.entityId) {
          ctx.delEntityInPageContent(ctx.obj.model.wid + "-" + itemo.wid);
        }
        ctx.obj.model.formData[type].splice(
          ctx.obj.model.formData[type].findIndex((i) => i.name === itemo.name),
          1
        );
      }
      ctx.$forceUpdate();
    },

    fieldsChange(e, isReady) {
      const ctx = this;
      let filter = e;
      if (isReady) ctx.$set(ctx.obj.model.formData, "forms", filter);
    },

    formConfig(form, index, name) {
      const ctx = this;
      // ctx.config[name][index] = form;
      ctx.$set(ctx.obj.model.formData[name], index, form);
    },

    // 添加操作按钮
    openForm(type) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let params = {
        entity: ctx.selectedEntity,
        argsArr: ctx.root.argsArr,
        formData: ctx.obj.model.formData,
        editComponent: ctx.editComponent
      };
      let dialogInfo = {
        title: `创建/编辑${type === "Btn" ? "按钮" : "模块"}`,
        params,
        component: `lowCode${type}Form`,
      };

      ctx.openCustomDialog({
        path: dialogInfo.component,
        title: dialogInfo.title,
        width: "55%",
        //  height: "60%",
        propsData: {
          params: dialogInfo.params,
        },
        component: ctx.$options.components[dialogInfo.component],
        beforeConfirm: ($_dontCare, $el) => {
          return $el.onSubmit(ctx.handleSubmit);
        },
      });
    },
    // 处理弹窗确认事件
    handleSubmit(type, form) {
      const ctx = this;
      if (!form.wid)
        form.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      ctx.obj.model.formData[type === "Btn" ? "opr" : "module"].push(
        JSON.parse(JSON.stringify(form))
      );
    },
    resetForm() {
      const ctx = this;
      ctx.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.v2-a-form-config-edit {
  width: 100%;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
  .el-form-item {
    margin-bottom: 14px;
    ::v-deep .el-form-item__label {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 24px;
      color: #333333;
      opacity: 1;
      margin-bottom: 8px;
      margin-left: 6px;
    }
  }
  .sub-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
    color: #333333;
  }
  .dropdown-select {
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
