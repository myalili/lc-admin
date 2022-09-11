<template>
  <div class="text-form">
    <div class="page-content flex flex-col items-center relative">
      <el-form
        ref="ruleForm"
        :label-position="formData.labelPosition"
        :label-width="labelWidth"
        size="small"
        label-suffix="："
        :model="searchForm"
        :rules="rules"
        v-if="hasRules && collapse"
        style="width: 98%"
      >
        <module-form
          :AParams="AParams"
          :formData="formData"
          :searchForm="searchForm"
          :showFormContent="showFormContent"
        />

        <el-divider v-if="formData.module && formData.module.length > 0" />
        <div
          :class="{ 'v2-form-col-2': formData.col, 'flex': formData.col > 1 }"
          class="computedForms items-start flex-wrap"
        >
          <template v-for="item in computedForms">
            <el-form-item
              :style="formItemCol(item)"
              :prop="item.dictionaryItem && item.dictionaryItem.engNameShort"
              :label="item.dictionaryItem && item.dictionaryItem.name"
              :key="item.id"
              :label-width="labelWidth(item)"
              v-if="!item.isHide"
            >
              <!-- 第一步：可编辑表单 -->
              <component
                style="width:100%"
                :is="item.component ? item.component.href : 'v2-a-input'"
                :page="
                  item.component && item.component.hasOwnProperty('page')
                    ? item.component.page
                    : null
                "
                placeholder="请输入"
                :disabled="item.disabled"
                :value.sync="
                  item && searchForm[item.dictionaryItem.engNameShort]
                "
                :config="item"
                :entityId="item.entityId"
                :enumCode="item.enumCode"
                :AParams="AParams"
                @change="componentValue($event, item)"
                @getRecord="getRecordValue($event, item)"
              />
              <!-- 链接 -->
              <el-button
                style="margin-left: 8px"
                type="text"
                @click="replace({ page: item.component.linkPage })"
                v-if="
                  item &&
                  item.component &&
                  item.component.linkText
                "
                >{{ item && item.component.linkText }}</el-button
              >
              <!-- 第二步：表单数据回显 -->
              <component
                v-if="
                  showFormContent &&
                  item &&
                  searchForm[item.dictionaryItem.engNameShort]
                "
                :is="
                  item && item.echoComponent
                    ? item.echoComponent.href
                    : 'v2-a-text'
                "
                :enumCode="item && item.enumCode"
                :value.sync="
                  item && searchForm[item.dictionaryItem.engNameShort]
                "
                :AParams="AParams"
                :config="item"
              />
            </el-form-item>
          </template>
        </div>
      </el-form>
      <el-form
        size="small"
        label-suffix="："
        v-if="hasRules"
        :style="'width: 90%'"
        :class="[  formData.btnPosition ? 'absolute' : '', formData.btnPosition ]"
      >
        <el-form-item
          v-if="formData.opr && formData.opr.length > 0"
          class="v2-form-config-bts-wrapper"
        >
          <div class="v2-form-config-btns" :class="[' justify-' + formData.btnDisplay ]">
            <template v-for="item in formData.opr && formData.opr.filter((i) => i.opr.name !== 'upload')">
            <div
              class="btn"
              :style="{ background: !item.isThematic && (item.color || '#3698f2') }"
              :class="{
                btn_w: item.color === '#FFFFFF',
                'bg-primary': item.isThematic,
              }"
              :key="item.name"
              v-if="oprCascaderShow(item)"
              @click.stop="oprClick(item)"
            >
              <codeless-icon
                class="btn-icon"
                :icon="item.icon"
                v-if="item.icon"
              ></codeless-icon>
              <span>{{ item.name }}</span>
            </div>
            </template> 
            
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import StepComponents from "./components/stepComponents.vue";
import moduleForm from "./components/moduleForm.vue";

import { oprClick } from './clickMap'

export default {
  mixins: [window.codelessMixins.customDialog, window.codelessMixins.vRegister, window.codelessMixins.entityAuthorities, window.codelessMixins.pageList],
  provide() {
    return {
      searchForm: this.searchForm || null,
    };
  },
  inject: ["root"],
  name: "codelessFormConfig",
  components: { StepComponents, moduleForm },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    AParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 4 },

      config: {
        entityId: "",
        name: "",
        desc: "",
        forms: [
          {
            value: "",
            component: {
              href: "v2-a-input",
              name: "输入框",
            },
            dictId: "di-5CFa51Wl",
            dictionaryItem: {
              id: "di-5CFa51Wl",
              name: "姓名",
              desc: null,
              engNameShort: "DybkCustNo",
              validationRuleType: {
                categoryId: "cgValidation-Dts8su-F9lPTf-v8fX4f",
                desc: "具体地址，包括具体街道地址",
                id: "vrt-12wPQvbI",
                name: "地址",
                validations: [
                  {
                    chinese: "",
                    createTime: "1638257643322",
                    createUserName: "redmine",
                    dictItemId: "",
                    id: "val-52KNUDg7",
                    js: "",
                    maxLength: "256",
                    minLength: "1",
                    regex: "",
                    tenantId: "ten-hZ8gh7BK",
                    tips: "长度不得大于256位",
                    type: "1",
                    updateTime: "1638257643322",
                    updateUserName: "redmine",
                  },
                ],
              },
            },
            id: "entity-field-aiCiJAKB",
            notNull: null,
            primaryKey: "1",
          },
        ],
        opr: [
          {
            name: "提交",
            icon: "",
            color: "",
            isThematic: true,
            type: {
              label: "通用方法",
              value: "publicMethod",
            },
            entityId: "",
            opr: {
              id: "confirm",
              name: "提交内容",
            },
            wid: 1
          },
          {
            name: "重置",
            icon: "",
            color: "",
            isThematic: true,
            type: {
              label: "通用方法",
              value: "publicMethod",
            },
            entityId: "",
            opr: {
              id: "reset",
              name: "重置表单",
            },
            wid: 2
          },
        ],
        btnDisplay: 'center',
      },
      rules: {},
      searchForm: {},

      filterIds: {},
      tableProIds: [],
      tableOprIds: [],

      visibleFilter: false,

      entities: [],
      selectedEntity: {},
      dicts: [],

      tableOpr: [{ value: "edit", name: "编辑" }],

      dialogInfo: {
        title: "新建",
        opr: {},
        params: {},
        fields: [],
        form: {},
      },

      row: {},

      hasRules: false,

      collapse: true,

      rootArgs: {},

      showFormContent: false
    };
  },
  created() {
    const ctx = this;
    console.log("配置表单数据：", ctx.formData);

    msgHub.$on('buttomFormClick', (item)=> {
      ctx.oprClick(item)
    });
  },
  mounted() {
    this.getEntityDetail();
  },
  watch: {
    "formData.forms": {
      handler(n) {
        const ctx = this;
        if (n && n.length > 0) {
          n.forEach(f=> {
            if (f.entityId) {
              ctx.saveEntityToPageContent(ctx.formData.wid + '-' + f.wid, f.entityId)
            } 
            if (f.page?.prototypeId) {
              ctx.savePageListToPageContent(ctx.formData.wid + '-' + f.wid, f.page.prototypeId);
            }
          })
          ctx.componentChildrenUpdate(n, ctx.formData.wid);
        }
      },
      deep: true,
    },
    "formData.opr": {
      handler(n) {
        const ctx = this;
        if (n && n.length > 0) {
          n.forEach(o=> {
            if (o.fields) {
              ctx.componentChildrenUpdate(o.fields, ctx.formData.wid);
            }
            if (o.entityId && o.type.value === "dataEntityMethod") {
              ctx.saveEntityToPageContent(ctx.formData.wid + '-' + o.wid, o.entityId, o.opr?.operationType || 'retrieve');
            }
            if (o.page?.prototypeId && o.type.value === 'publicMethod') {
              ctx.savePageListToPageContent(ctx.formData.wid + '-' + o.wid, o.page.prototypeId);
            }
            if (o.opr?.id === 'confirm') {
              ctx.saveEntityToPageContent(ctx.formData.wid + '-' + (o.wid || 1), ctx.formData.entityId, [ 'create', 'update' ]);
            }
          })
        }
      },
      deep: true,
    }, 
    "searchForm": {
      handler(n) {
        if (n) {
          const ctx = this;
          if (ctx.formData.syncParam) {
            let p = ctx.formData.syncParam.substring(
              0,
              ctx.formData.syncParam.indexOf(".")
            );
            let c = ctx.formData.syncParam.substring(
              ctx.formData.syncParam.indexOf(".") + 1
            );
            ctx.root.content ? ctx.root.content.args[p][c] = n : ctx.root.pageContent.args[p][c] = n;
          }
        }
      },
      deep: true,
    }
  },
  computed: {
    itemDetail() {
      return (item) => {
        const find = this.formData.forms.find(
          (i) => i.dictionaryItem.name === item
        );
        return find;
      };
    },
    content() {
      if (this.formData && this.config) {
        return this.formData;
      } else {
        return {
          content: "",
        };
      }
    },
    computedForms() {
      const ctx = this;
      let noModules = [];
      // debugger
      let fModule = ctx.formData && ctx.formData.module;
      if (fModule && fModule.length > 0) {
        let moduleField = fModule
          .map((i) => {
            return i.children;
          })
          .flat(Infinity);
        (ctx.formData && ctx.formData.forms).map((i) => {
          if (!moduleField.some((m) => m.id === i.dictionaryItem.id)) {
            noModules.push(i);
          }
          // if (!moduleField.includes(i.dictionaryItem.name)) {
          //   noModules.push(i);
          // }
        });
        return noModules.filter((i) => !i.isHide);
      } else {
        return ctx.formData.forms
          ? ctx.formData.forms.filter((i) => !i.isHide)
          : [];
      }
    },
    formItemCol() {
      return (item=> {
        const ctx = this;
        if (item.col) {
          return { '--col': eval(item.col) * 100 + '%' }
        }
        return { '--col': (1 / ctx.formData.col) * 100 + '%' }
      })
    },

    // 操作按钮显隐
    oprCascaderShow() { 
      return (item)=> {
        if(!item.cascader || !item.cascader.some(i=>i.config === '2')) return true;
        const ctx = this;
        const hideCascaders = item.cascader.filter(i=>i.config === '2');
        let hideArr = [];
        hideCascaders.forEach(hideCascader=> {
          let isHide = false;
          let p = hideCascader.arg.substring(0, hideCascader.arg.indexOf("."));
          let c = hideCascader.arg.substring(hideCascader.arg.indexOf(".") + 1);
          if (hideCascader.editType !== '==' && !isNaN(ctx.root.args[p][c])) {
            isHide = eval(`Number(ctx.root.args[p][c]) ${hideCascader.hideType} Number(hideCascader.hideValue)`);
            // console.log(eval(`Number(ctx.root.args[p][c]) ${hideCascader.hideType} Number(hideCascader.hideValue)`));
          }else {
            isHide = eval(`ctx.root.args[p][c] ${hideCascader.hideType} hideCascader.hideValue`)
            // console.log(eval(`ctx.root.args[p][c] ${hideCascader.hideType} hideCascader.hideValue`));
          }
          hideArr.push(isHide);
        })
        console.log(hideArr.some(i=>i));
        
        return !hideArr.some(i=>i)
        
      }
    },

    labelWidth() {
      return (item=> {
        const ctx = this;
        if(item) {
          return item.dictionaryItem && item.dictionaryItem.name ? ctx.formData.labelWidth + 'px' : '0'
        }else {
          return ctx.formData.labelWidth? ctx.formData.labelWidth + 'px': '100px'
        }
      })
    }
  },
  methods: {
    async getEntityDetail() {
      const ctx = this;
      if (!ctx.formData || !ctx.formData.entityId) {
        ctx.hasRules = true;
        return;
      }
      let res = await pipe.entity.getEntityDetail(
        ctx.formData.entityId.id || ctx.formData.entityId
      );
      if (res) {
        ctx.formData.forms.forEach((form) => {
          res.fields.forEach((field) => {
            if (form.dictionaryItem.engNameShort === field.name) {
              form.type = field.type;
              form.id = field.id;
              form.dictionaryItem.validations = field.validations || [];
            }
          });
        });
      }

      ctx.fieldsChange();
      ctx.formData.forms.forEach((i) => {
        ctx.cascaderConfig(i, { resetAll: true });
      });
    },
    componentValue(e, item) {
      if (item.cascader && item.cascader.length > 0) {
        item.cascader.forEach((cas) => {
          if (cas.config === "3") {
            this.searchForm[cas.entityField] = e[cas.compField];
          }
        });
      }
      this.formData.forms.forEach((i) => {
        this.cascaderConfig(i, {
          onlyControlHide: true,
          changeItem: item,
          changeValue: e,
        });
      });
    },

    getRecordValue(e, item) {
      this.cascaderConfig(item, {
        onlySetFieldValue: true,
        changeItem: item,
        changeValue: e,
      });
    },

    // 根据级联配置动态设置
    // item 来源 formData.forms
    // 判断条件中的 1 2 3 等定义查看 v2-a-form-search-edit\components\prototypeForm 组件
    cascaderConfig(item, config) {
      if (!item.cascader) return;
      const { changeItem, changeValue } = config;
      const { resetAll, onlyCurTime, onlyControlHide, onlySetFieldValue } =
        config;

      item.cascader.forEach((cas) => {
        if (cas.config === "5") {
          if (cas.initType) {
            switch (cas.initType) {
              case "1": {
                if (resetAll) {
                  this.$set(
                    this.searchForm,
                    item.dictionaryItem.engNameShort,
                    cas.initialEnumSelected.value
                  );
                }
                break;
              }
              case "2": {
                if (resetAll || onlyCurTime) {
                  this.$set(
                    this.searchForm,
                    item.dictionaryItem.engNameShort,
                    +Date.now()
                  );
                }
                break;
              }
              case "3": {
                if (resetAll) {
                  this.$set(
                    this.searchForm,
                    item.dictionaryItem.engNameShort,
                    `${item.dictionaryItem.engNameShort}-${this.randomChars(8)}`
                  );
                }
                break;
              }
            }
          } else {
            if (resetAll) {
              this.$set(
                this.searchForm,
                item.dictionaryItem.engNameShort,
                cas.initialValue
              );
              this.$forceUpdate();
            }
          }
        }

        if (cas.config === "4") {
          this.$set(item, "isHide", true);
        }

        if (cas.config === "6" && (resetAll || onlyControlHide)) {
          switch (cas.conditionControlType) {
            case "1": {
              if (
                changeItem &&
                changeItem.dictionaryItem.engNameShort === cas.compareField
              ) {
                if (
                  cas.conditionControlEnumSelected
                    .map((m) => m.value)
                    .includes(changeValue)
                ) {
                  if (cas.controlType === "hide") {
                    this.$set(item, "isHide", true);
                    this.$set(
                      this.searchForm,
                      item.dictionaryItem.engNameShort,
                      null
                    );
                    console.log("消失了", item.dictionaryItem.engNameShort);
                  } else {
                    this.$set(item, "isHide", false);
                  }
                } else {
                  this.$set(item, "isHide", false);
                }
              }
              break;
            }
          }
        }

        if (
          cas.config === "7" &&
          changeItem &&
          changeItem.entityId &&
          (resetAll || onlySetFieldValue)
        ) {
          this.$set(
            this.searchForm,
            cas.tobeSetField,
            changeValue[cas.setField]
          );
        }
        if (cas.config === "8") {
          console.log("这是组件赋值");
          this.$watch(
            `searchForm.${cas.entityField}`,
            function (newValue, oldValue) {
              console.log("这是新创建的观测", newValue, oldValue);
              this.$set(item, [cas.compField], newValue);
              console.log(item);
            }
          );
          console.log("item, config", this.searchForm, cas, item, config);
        }
      });
    },
    async oprClick(item) {
      console.log("点击事件", item);
      const ctx = this;
      item.cascaderRun = true;

      await oprClick(ctx, item);
      console.log("按钮详情", item);

      console.log('item.cascaderRun', item.cascaderRun);
      if (item.cascaderRun) {
        item.cascader?.forEach(cascader=> {
          if (cascader.config === '1' && cascader.editType) {
            let p = cascader.arg.substring(0, cascader.arg.indexOf("."));
            let c = cascader.arg.substring(cascader.arg.indexOf(".") + 1);
            if (cascader.editType !== '=' && !isNaN(ctx.root.args[p][c])) {
              eval(`ctx.root.args[p][c] = Number(ctx.root.args[p][c]) ${cascader.editType} Number(cascader.editValue)`);
            }else {
              eval(`ctx.root.args[p][c] = ctx.root.args[p][c] ${cascader.editType} cascader.editValue`);
            }
          }
        })
      }
    },

    // 实体操作提交
    async formSubmit(e, id, desc, call) {
      const ctx = this;
      const entityId = id || ctx.formData.entityId.id || ctx.formData.entityId
      // 更新部分字段值的时间戳为当前提交时间
      ctx.formData.forms.forEach((i) => {
        ctx.cascaderConfig(i, { onlyCurTime: true });
      });

      let row = id === ctx.formData.entityId ? ctx.root.AParams.row || ctx.root.AParams.searchForm : {};
      let variables = ctx.root.AParams.variables || [];
      if (variables.length > 0) {
        variables.forEach((i) => {
          ctx.$set(row, [i.name], i.value);
        });
      }
      if (JSON.stringify(ctx.rootArgs) !== "{}") {
        row = ctx.rootArgs;
      }

      let form = e;
      let operationType = "create";
      let params = {
        entityId,
        fields: [],
      };
      let res = await pipe.entity.getEntityDetail(
        entityId
      );
      if (!res) return;

      let idObj = {};
      if (res.fields.some((i) => i.primaryKey === "1") && res.type !== 'data_source') {
        idObj = res.fields.find((i) => i.primaryKey === "1");
        if (!form[idObj.dictionaryItem.engNameShort]) {
          params.fields.push({
            entityFieldId: idObj.id,
            value: (row && row[idObj.dictionaryItem.engNameShort]) || "",
          });
          form[idObj.dictionaryItem.engNameShort] =
            (row && row[idObj.dictionaryItem.engNameShort]) || "";
        }
        console.log("主键", idObj);
      }

      for (const key in form) {
        res.fields.forEach((i) => {
          if (i.dictionaryItem.engNameShort === key) {
            params.fields.push({
              entityFieldId: i.id,
              value: form[key],
            });
          }
        });
      }

      if (res.type !== 'data_source' && form[idObj.dictionaryItem.engNameShort]) {
        operationType = "update";
      }else {
        operationType = res.schemas.find(i=>i.operationType !== 'retrieve').operationType
      }
      console.log("操作", operationType);
      ctx.entityRequest(operationType, params, res, desc, call);
    },
    // 实体操作请求
    entityRequest(operationType, params, entity, desc, call) {
      const ctx = this;
      const operationTypeMap = new Map([
        ["create", "添加"],
        ["update", "修改"],
        ["delete", "删除"],
      ]);
      let entityUrl = {};

      pipe.entity
        .getEntityData(entity.id, operationType, params)
        .then((res) => {
          if (res) {
            ctx.$notify({
              message: (desc || operationTypeMap.get(operationType)) + "成功！",
              title: "成功",
              type: "success",
            });
            if (ctx.$root.confirm) {
              ctx.$root.confirm(ctx);
              ctx.$root.cancel();
            } else {
              if (call) {
                console.log("call", call);
                  // call();
                  // call(ctx);
              } else {
                if (ctx.root.AParams.isFromCodeless) {
                  ctx.$router.go(-1);
                }
              }
            }
          }
        });
      // .catch((err) => {
      //   ctx.$notify.error({
      //     title: "错误",
      //     message: err.msg,
      //   });
      // });
    },
    replace(
      item,
      type = "",
      params = { formData: this.formData, row: this.searchForm }
    ) {
      const ctx = this;
      console.log("item", item);
      console.log("params", params);
      console.log("type", type);

      let syncParamsObj = {};
      if (item.syncParams) {
        item.syncParams.forEach((i) => {
          if (i.current) {
            if (i.isComponent) {
              ctx.$set(syncParamsObj, i.target, eval("params." + i.current));
            } else {
              console.log(ctx.root.content, ctx.root.args);
              let rootObjStr = ctx.root.content? 'ctx.root.content.args.' : 'ctx.root.args.'
              ctx.$set(
                syncParamsObj,
                i.target,
                eval(rootObjStr + i.current)
              );
            }
          }
          
        });
      }
      let option = {
        title: item.page.title || item.page.name,
        path: item.type === "WINDOW" ? item.page : item.page.path || "",
        params: {
          // title: item.page.title || item.page.name,
          // pageId: item.page.id,
          // pid: item.page.parentId || "",
          // type: item.page.codelessType,

          pageId: item.page.prototypeId,
          prototypeId: item.page.prototypeId,
          // ...params,
          syncParamsObj,
          row: params.row,
          // page: item.page,
          runtime: true,
        },
        dialogInfo: item.dialogInfo,
      };
      console.log('传递的参数', option);
      ctx.v2ComponentOpen(option, type);
    },

    fieldsChange(e) {
      const ctx = this;

      ctx.formData.forms.map((i) => {
        ctx.$set(ctx.rules, i.dictionaryItem.engNameShort, []);
        if (!i.dictionaryItem.validationRuleType) {
          ctx.rules[i.dictionaryItem.engNameShort].push({ required: false });
        } else {
          i.dictionaryItem.validationRuleType.validations.map((validation) => {
            ctx.rules[i.dictionaryItem.engNameShort].push({
              min:
                validation.type === "1"
                  ? Number(validation.minLength)
                  : undefined,
              max:
                validation.type === "1"
                  ? Number(validation.maxLength)
                  : undefined,
              required: validation.type === "5" ? true : false,
              pattern:
                validation.type === "4" ? new RegExp(validation.regex) : "",
              message: validation.tips,
              trigger: "blur",
            });
          });
        }
        ctx.$set(ctx.searchForm, i.dictionaryItem.engNameShort, null);

        i.cascader &&
          i.cascader.forEach((cas) => {
            if (cas.config === "4") {
              this.$set(i, "isHide", true);
            }
          });

        let form = {};

        if (ctx.formData.syncParam) {
          let p = ctx.formData.syncParam.substring(
            0,
            ctx.formData.syncParam.indexOf(".")
          );
          let c = ctx.formData.syncParam.substring(
            ctx.formData.syncParam.indexOf(".") + 1
          );
          form = ctx.root.content ? ctx.root.content.args[p][c] || {} : ctx.root.pageContent.args[p][c] || {};
        }
        // console.log('有没有传过来的参数', this.AParams);

        let variables = ctx.root.AParams.variables || [];

        if (variables.length > 0) {
          variables.forEach((i) => {
            ctx.$set(form, [i.name], i.value);
          });
        }
        

        if (JSON.stringify(ctx.rootArgs) !== "{}") {
          form = ctx.rootArgs;
        }

        // console.log("有没有数据", form);
        if (form) {
          for (const key in form) {
            if (i.dictionaryItem.engNameShort === key) {
              ctx.$set(
                ctx.searchForm,
                i.dictionaryItem.engNameShort,
                form[key]
              );
            }
          }
        }
      });

      console.log("表单规则", ctx.rules);
      console.log("表单内容", ctx.searchForm);
      ctx.hasRules = true;
    },

    formConfig(form, index, name) {
      const ctx = this;
      ctx.$set(ctx.formData[name], index, form);
      console.log("formConfig", ctx.formData);
    },

    onSubmit() {
      const ctx = this;
      ctx.$refs.ruleForm.validate((valid) => {
        console.log("ctx.rules", ctx.rules);
        ctx.$root.confirm(ctx);
        ctx.$root.cancel();
        if (valid) {
          ctx.$root.confirm(ctx);
          ctx.$root.cancel();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      const ctx = this;
      ctx.$refs.ruleForm.resetFields();
    },
    hasOptions(item) {
      if (item) {
        let dicts = item.validationDictionaries;
        if (dicts && dicts.some((i) => i.type === "阈值检查")) {
          return dicts[dicts.findIndex((i) => i.type === "阈值检查")].code;
        }
      }
    },
    randomChars(len) {
      const result = [];

      for (let i = 0; i < len; i++) {
        // 生成0~25的随机数字
        const ram = Math.ceil(Math.random() * 25);

        const char = String.fromCharCode(65 + ram);
        // 随机转为大小
        if (Math.random() < 0.33) {
          result.push(Math.floor(Math.random() * 10));
        } else if (Math.random() > 0.33 && Math.random() < 0.66) {
          result.push(char.toLowerCase());
        } else {
          result.push(char);
        }
      }
      return result.join("");
    },
  },
};
</script>

<style lang="less" scoped>
.text-form {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: scroll;
  display: flex;
  align-items: center;
  .page-content {
    width: 100%;
    height: 98%;
    box-sizing: border-box;
    padding-top: 30px;
  }
  .drawer {
    width: 366px;
    margin-top: 5px;
    height: 97.78%;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 18px 25px 9px 18px;
    background: #f9fafc;
    box-shadow: 0px 0px 17px rgba(55, 78, 113, 0.3);
    opacity: 1;
    border-radius: 7px;
    .sub-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: bold;
      line-height: 27px;
      color: #333333;
    }
  }
}
.v2-form-module-title {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #000;
  /* border-left: 3px solid var(--color-primary); */
  padding-left: 20px;
  // background: rgb(236, 239, 244);
  background: #f0f7ff;
  margin: 0 0 16px;
  border-radius: 6px;
  span {
    border-left: 3px solid var(--color-primary);
    padding-left: 4px;
  }
}
.computedForms {
  width: 94%;
  margin: 0 auto;
}
.v2-form-col-2 {
  width: 94%;
  margin: 0 auto;
}
.v2-form-col-2 .el-form-item {
  width: var(--col);
  // width: 50%;
  // display: inline-block;
}
.v2-form-config-bts-wrapper {
  margin-bottom: 0 !important;
}
.v2-form-config-bts-wrapper ::v-deep .el-form-item__content {
  margin-left: 0 !important;
  padding-right: 0 !important;
}
.text-form ::v-deep .el-form-item__content {
  display: flex;
  padding-right: 20px;
}
.v2-form-config-btns {
  width: 100%;
  text-align: center;
  display: flex;
  // justify-content: center;
  // padding: 16px 0;
  .btn {
    width: fit-content;
    height: 28px;
    padding: 0 20px;
    opacity: 1;
    border-radius: 4px;
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
    display: flex;
    align-items: center;
    border: 1px solid #ffffff;
    &:hover {
      opacity: 0.7;
    }
    .btn-icon {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
  }
  .btn:nth-child(n+2) {
    margin-left: 22px;
  }
  .btn_w {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  .btn_disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}
::v-deep .el-step__head.is-process {
  .el-step__icon.is-text {
    border-radius: 50%;
    border: none;
    background: var(--color-primary);
    color: #fff;
  }
}
</style>
