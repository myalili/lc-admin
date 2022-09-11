<template>
  <div class="prototype-edit" style="overflow: auto">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      size="mini"
      label-suffix="："
      style="height: 90%; overflow: auto"
    >
      <el-form-item label="标题">
        <el-input
          v-model="form.dictionaryItem && form.dictionaryItem.name"
          style="width: 270px"
        />
      </el-form-item>
      <el-form-item label="校验类型">
        <div class="flex items-center">
          <el-button @click="showDictDialog = true" type="primary"
            >选择字典</el-button
          >
          <el-tooltip class="item" effect="light" placement="top-start">
            <template slot="content">
              <div class="field-container">
                <div class="valid-container">
                  <div class="valid-container-title">
                    标准码：{{ selectedField.code || form.code }}
                  </div>
                  <div class="valid-container-title">校验条件</div>
                  <div
                    v-for="(item, index) in selectedField.validations ||
                    (form.dictionaryItem &&
                      form.dictionaryItem.validationRuleType.validations)"
                    :key="index"
                  >
                    <div v-if="item.type == '1'" class="valid-box">
                      <div class="valid-title">长度检查：</div>
                      <div class="valid-detail">
                        <span>错误提示：：</span>
                        <span>{{ item.tips }}</span>
                      </div>
                      <div class="valid-detail">
                        <span>最大长度：</span>
                        <span>{{ item.maxLength }}</span>
                      </div>
                      <div class="valid-detail">
                        <span>最大长度：</span>
                        <span>{{ item.minLength }}</span>
                      </div>
                      <div class="valid-detail">
                        <span>是否汉字：</span>
                        <span>{{ item.chinese == "1" ? "是" : "否" }}</span>
                      </div>
                    </div>

                    <div v-if="item.type == '2'" class="valid-box">
                      <div class="valid-title">精度检查：</div>
                      <div class="valid-detail">
                        <span>错误提示：</span>
                        <span>{{ item.tips }}</span>
                      </div>
                    </div>

                    <div v-if="item.type == '3'" class="valid-box">
                      <div class="valid-title">阈值检查：</div>
                      <div class="valid-detail">
                        <span>错误提示：</span>
                        <span>{{ item.tips }}</span>
                      </div>
                    </div>

                    <div v-if="item.type == '4'" class="valid-box">
                      <div class="valid-title">格式检查：</div>
                      <div class="valid-detail">
                        <span>错误提示：</span>
                        <span>{{ item.tips }}</span>
                      </div>
                      <div class="valid-title">正则：</div>
                      <div class="valid-detail">
                        <span>错误提示：</span>
                        <span>{{ item.regex }}</span>
                      </div>
                    </div>

                    <div v-if="item.type == '5'" class="valid-box">
                      <div class="valid-title">非空检查：</div>
                      <div class="valid-detail">
                        <span>错误提示：</span>
                        <span>{{ item.tips }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <i
              class="el-icon-info ml-1 cursor-pointer"
              style="color: #97aeba"
            ></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="组件">
        <el-select
          filterable
          v-model="form.component"
          value-key="href"
          placeholder="请选择组件"
          style="width: 270px"
          @change="codeLessTypeChange"
        >
          <el-option
            :value="item"
            :label="item.name"
            v-for="item in comps"
            :key="item.href"
          >
            {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="数据绑定">
        <sync-param style="width: 270px" :is-custom="true" :target-params="params.argsArr" :value.sync="form.syncParam" />
      </el-form-item> -->

      <el-form-item label="回显组件" v-if="showFormContent">
        <el-select
          filterable
          v-model="form.echoComponent"
          value-key="href"
          placeholder="请选择组件"
          style="width: 270px"
        >
          <el-option
            :value="item"
            :label="item.name"
            v-for="item in comps"
            :key="item.href"
          >
            {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="文本链接" v-if="form.component && form.component.href && form.component.href.indexOf('v2-a-select') > -1">
        <span class="flex items-center">
          <el-input style="width: 182px; margin-right:8px" v-model="form.component.linkText" placeholder="请输入文案"></el-input>
          <page-select :value.sync="form.component.linkPage" />
        </span>
        
      </el-form-item> -->

      <!-- <el-form-item label="数据来源" v-if="form.component && form.component.option && form.component.option.some((i) => i.codeLessType === 'dto')">
        <el-radio-group v-model="form.dataSource">
          <el-radio-button label="entity">实体</el-radio-button>
          <el-radio-button label="enum">枚举</el-radio-button>
        </el-radio-group>
      </el-form-item> -->

      <!-- <el-form-item
        :label="code.desp"
        v-for="code in codeLessTypeOption"
        :key="code.name"
      >
        <code-less-config :form="form" :codeLessType="code.codeLessType" :code="code" :is-form="true"  />
      </el-form-item> -->
      <code-less-config
        :form="form"
        :codeLessType="code.codeLessType"
        :code="code"
        :current-args-arr="params.argsArr"
        v-for="code in codeLessTypeOption"
        :key="code.name"
      />

      <el-form-item label="级联配置" v-if="editComponentShow('cascader')">
        <div class="align">
          <!-- <span class="btn-add" @click="addCascader">+</span> -->
          <el-button type="primary" size="mini" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="addCascader"></el-button>
        </div>
        <div
          class="cascader"
          v-for="(item, index) in form.cascader"
          :key="item.id"
        >
          <div style="display: flex; align-items: center">
            <span style="margin-right: 9px"
              >{{ index + 1 }}.{{ params.obj.name }}</span
            >
            <el-select v-model="item.config" style="width: 110px">
              <el-option label="当" value="6"></el-option>
              <el-option label="大于" value="1"></el-option>
              <el-option label="小于" value="2"></el-option>
              <el-option label="回显" value="3"></el-option>
              <el-option label="隐藏" value="4"></el-option>
              <el-option label="赋值" value="7"></el-option>
              <el-option label="初始值" value="5"></el-option>
              <el-option label="组件赋值" value="8"></el-option>
            </el-select>

            <el-select
              v-model="item.compField"
              placeholder="选择组件字段"
              style="width: 110px"
              v-if="item.config === '8'"
            >
              <el-option
                v-for="item in form.component && form.component.option"
                :value="item.name"
                :label="item.desp"
                :key="item.name"
              ></el-option>
            </el-select>

            <el-select
              v-model="item.compField"
              placeholder="选择字段"
              style="width: 110px"
              v-if="!['4', '5', '6', '7', '8'].includes(item.config)"
            >
              <el-option
                v-for="item in compFields"
                :value="item.dictionaryItem.engNameShort"
                :label="item.dictionaryItem.name"
                :key="item.id"
              ></el-option>
            </el-select>

            <el-select
              v-model="item.compareField"
              placeholder="选择字段"
              style="width: 110px"
              v-if="item.config === '6'"
            >
              <el-option
                v-for="item in params.fields"
                :value="item.dictionaryItem.engNameShort"
                :label="item.dictionaryItem.name"
                :key="item.id"
              ></el-option>
            </el-select>

            <el-select
              v-model="item.tobeSetField"
              placeholder="选择被赋值字段"
              style="width: 110px"
              v-if="item.config === '7'"
            >
              <el-option
                v-for="item in params.fields"
                :value="item.dictionaryItem.engNameShort"
                :label="item.dictionaryItem.name"
                :key="item.id"
              ></el-option>
            </el-select>

            <el-select
              v-model="item.initType"
              placeholder="选择方式"
              style="width: 110px"
              v-if="item.config === '5'"
              @change="initTypeChange($event, item)"
            >
              <el-option label="输入框" value=""></el-option>
              <el-option label="枚举值" value="1"></el-option>
              <el-option label="提交时间" value="2"></el-option>
              <el-option label="随机编码" value="3"></el-option>
            </el-select>

            <el-select
              v-model="item.conditionControlType"
              placeholder="选择方式"
              style="width: 110px"
              v-if="item.config === '6'"
              @change="conditionControlTypeChange($event, item)"
            >
              <el-option label="枚举值" value="1"></el-option>
            </el-select>

            <span style="margin: 0 9px; font-weight: bold">，</span>

            <el-select
              v-model="item.setField"
              placeholder="选择赋值字段"
              style="width: 110px"
              v-if="item.config === '7'"
            >
              <el-option
                v-for="item in compFields"
                :value="item.dictionaryItem.engNameShort"
                :label="item.dictionaryItem.name"
                :key="item.id"
              ></el-option>
            </el-select>

            <el-select
              v-model="item.entityField"
              placeholder="选择字段"
              style="width: 110px"
              v-if="item.config === '3' || item.config === '8'"
            >
              <el-option
                v-for="item in params.entity.fields"
                :value="item.dictionaryItem.engNameShort"
                :label="item.dictionaryItem.name"
                :key="item.id"
              ></el-option>
            </el-select>

            <template
              v-if="item.config === '6' && item.conditionControlType === '1'"
            >
              <tree-select
                :options="categoriesTree"
                :value.sync="item.conditionContrilEnumCode"
                :props="{ value: 'code', label: 'name', children: 'childs' }"
                @change="conditionControlEnumCodeChange($event, item)"
              />
              <el-select
                v-model="item.conditionControlEnumSelected"
                filterable
                multiple
                size="mini"
              >
                <el-option
                  :value="enumField"
                  :label="enumField.name"
                  v-for="enumField in item.conditionControlEnumFields || []"
                  :key="enumField.value"
                >
                  {{ enumField.name }}
                </el-option>
              </el-select>
            </template>

            <el-select
              v-model="item.controlType"
              v-if="
                item.config === '1' ||
                item.config === '2' ||
                item.config === '6'
              "
            >
              <el-option value="able" label="可用"></el-option>
              <el-option value="disabled" label="不可用"></el-option>
              <el-option value="hide" label="不可见"></el-option>
            </el-select>

            <el-input
              v-if="item.config === '5' && !item.initType"
              style="width: 110px"
              v-model="item.initialValue"
              placeholder="请输入初始值"
            ></el-input>

            <template v-if="item.config === '5' && item.initType === '1'">
              <tree-select
                :options="categoriesTree"
                :value.sync="item.initialEnumCode"
                :props="{ value: 'code', label: 'name', children: 'childs' }"
                @change="initialEnumCodeChange($event, item)"
              />
              <el-select
                v-model="item.initialEnumSelected"
                filterable
                size="mini"
              >
                <el-option
                  :value="enumField"
                  :label="enumField.name"
                  v-for="enumField in item.initialEnumFields || []"
                  :key="enumField.value"
                >
                  {{ enumField.name }}
                </el-option>
              </el-select>
            </template>
          </div>
          <i class="el-icon-remove btn-del" @click="delCascader(item)"></i>
        </div>
      </el-form-item>

      <el-form-item label="字段宽度" v-if="params.formData.col">
        <el-radio-group v-model="form.col" size="mini">
            <el-radio-button :label="item.label" v-for="item in formCols" :key="item.label">{{ item.desc }}</el-radio-button>
          </el-radio-group>
      </el-form-item>
      <!-- <el-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <div class="flex items-center">
          <span
            class="
              flex
              items-center
              justify-center
              w-16
              h-7
              rounded-full
              cursor-pointer
              bg-gradient-primary
              text-white text-xs
              hover:opacity-75
              mr-4
            "
            @click="onSubmit"
            >保存</span
          >
          <span
            class="
              flex
              items-center
              justify-center
              w-16
              h-7
              rounded-full
              cursor-pointer
              bg-white
              text-gray-500
              border border-gray-500
              text-xs
              hover:opacity-75
            "
            @click="cancel"
            >取消</span
          >
        </div>
      </el-form-item> -->
    </el-form>
    <dict-dialog
      :visible.sync="showDictDialog"
      :entity-field="params.entity.fields.find((i) => i.id === form.id)"
      v-if="showDictDialog"
      @selectField="selectField"
    ></dict-dialog>
  </div>
</template>

<script>
import codeLessConfig from "./codeLessConfig.vue";
import dictDialog from "./dictDialog.vue";
// import treeSelect from '@/views/codeLess/components/treeSelect'
export default {
  name: "prototypeForm",
  components: {
    codeLessConfig,
    dictDialog,
    // treeSelect
  },

  props: ["params", "title"],
  data() {
    return {
      show: true,
      validation: true,

      categoriesTree: [],

      schemaType: "",
      validationType: [],
      component: "",
      componentConfig: {},
      componentOptionConfig: "",

      form: {
        entityId: null,
        schemaType: {},
        validationDictionaries: [],
        component: {},
        editCanChange: true,
        editCanShow: true,
        enumCode: "",

        btn: "search",
        cascader: [],
      },
      btnType: [
        {
          label: "查询",
          value: "search",
        },
        {
          label: "重置",
          value: "reset",
        },
      ],
      dicstValidation: [],
      comps: [],
      disabledType: false,

      optionConfig: false,

      sourceArr: [],

      compFields: [],

      dict: {},
      selectedField: {},

      showDictDialog: false,

      hasSteps: false,

      formCols: [
        {
          label: '',
          desc: '无'
        },
        {
          label: '1/4',
          desc: '1/4'
        },
        {
          label: '1/3',
          desc: '1/3'
        },
        {
          label: '1/2',
          desc: '1/2'
        },
        {
          label: '2/3',
          desc: '2/3'
        },
        {
          label: '3/4',
          desc: '3/4'
        },
        {
          label: '1',
          desc: '整行'
        }
      ]
    };
  },
  mounted() {
    console.log("页面参数", this.params);
    const ctx = this;
    ctx.componentList();
    if (ctx.params && ctx.params.hasOwnProperty("obj")) {
      ctx.form = ctx.params.obj;
      if (ctx.form.code) {
        this.$set(ctx.form, "enumCode", ctx.form.code);
      }
      ctx.hasSteps = ctx.params.formData.hasSteps || false;
      msgHub.$on("entityFields", (fields) => {
        ctx.compFields = fields;
      });
    }
    console.log("form", this.form);
    //TODO
    if (!this.form.effectFields) {
      Vue.set(this.form, "effectFields", this.form.effectFields || {});
    }
  },
  computed: {
    editComponentShow() {
      return (key)=> {
        const ctx = this;
        const editMap = {
          'formConfig': [ 'cascader' ],
          'formSearch': []
        }
        return editMap[ctx.params.editComponent].includes(key);
      }
    },
    codeLessTypeOption() {
      const ctx = this;
      const form = ctx.form;
      const option = ctx.form.component.href && pipe.component.getComponentOptions(ctx.form.component);
      
      if (!option) return;
      let codeLessTypeOption = option.filter((i) => {
        if (!form.changeType && !form.valueArray && i.codeLessType) return i;
        if (form.changeType && form.valueArray && i.codeLessType) {
          if (!form.valueArray.includes(i.name)) return i;
          if (form.valueArray.includes(i.name) && form.changeType === i.name)
            return i;
        }
      });
      return codeLessTypeOption;
    },

    currentField() {
      return this.params.entity.fields.find((i) => i.id === this.form);
    },

    showFormContent() {
      const ctx = this;
      return ctx.params.formData.opr.some(i=>i.opr.id === "showFormContent");
    }
  },
  methods: {
    codeLessTypeChange(e) {
      const ctx = this;

      const _option = ctx.form.component.href && pipe.component.getComponentOptions(e);
      if (
        _option.some((i) => i.codeLessType === "handleChange")
      ) {
        let code = _option.filter(
          (i) => i.codeLessType === "handleChange"
        )[0];
        ctx.$set(ctx.form, "changeType", code.defaultValue);
        ctx.$set(ctx.form, "valueArray", code.valueArray);

      } else {
        ctx.$set(ctx.form, "changeType", null);
        ctx.$set(ctx.form, "valueArray", null);

      }
    },
    initTypeChange(v, item) {
      if (v === "1") {
        this.getCategoriesTree();
        if (this.form.code) {
          this.$set(item, "initialEnumCode", this.form.code);
          this.initialEnumCodeChange(this.form.code, item, true);
        }
      } else {
        delete item.initialEnumCode;
        delete item.initialEnumSelected;
      }
    },
    initialEnumCodeChange(v, item, reset) {
      reset && this.$set(item, "initialEnumSelected", null);
      this.getEnums(item.initialEnumCode).then((list) => {
        this.$set(item, "initialEnumFields", list);
      });
    },

    conditionControlTypeChange(v, item) {
      if (v === "1") {
        const compareField = this.params.fields.find(
          (f) => f.dictionaryItem.engNameShort === item.compareField
        );
        if (compareField) {
          this.$set(item, "conditionContrilEnumCode", compareField.code);
          this.conditionControlEnumCodeChange(compareField.code, item, true);
        }
      } else {
        delete item.conditionContrilEnumCode;
        delete item.conditionControlEnumSelected;
      }
    },
    conditionControlEnumCodeChange(v, item, reset) {
      reset && this.$set(item, "conditionControlEnumSelected", []);
      this.getEnums(item.conditionContrilEnumCode).then((list) => {
        this.$set(item, "conditionControlEnumFields", list);
      });
    },

    async getEnums(code) {
      try {
        const { codeList } = window.getBffApi();
        const res = await codeList({ code, pageNum: 1, pageSize: 100000 })
        if (res) {
          return res.pageData || [];
        } else {
          return [];
        }
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    selectField(e) {
      const ctx = this;

      ctx.$set(ctx, "selectedField", {
        // id:  e.id,
        // displayType: e.displayType,
        code: e.code,
        validations: e.validations.map((i) => {
          const { maxLength, minLength, regex, tips, type } = i;
          return {
            maxLength,
            minLength,
            regex,
            tips,
            type,
          };
        }),
      });

      ctx.form.dictionaryItem.validationRuleType.validations = e.validations;
      ctx.form.code = e.code;
    },
    getParentWindow(triggerNode) {
      return triggerNode.parentNode || window.document.body;
    },
    onSubmit(handlerSubmit) {
      const ctx = this;
      let closeDialog = true;
      ctx.$refs.form.validate((valid) => {
        if (valid) {

          let form = JSON.parse(JSON.stringify(ctx.form));
          handlerSubmit("Prototype", form);
        } else {
          closeDialog = false;
          console.log("error submit!!");
          return false;
        }
      });
      return closeDialog;
    },
    cancel() {
      const ctx = this;
      ctx.$parent.$parent.dialogInfo.visible = false;
      ctx.$refs.form.resetFields();
    },
    // 组件列表
    componentList() {
      const ctx = this;
      ctx.comps = pipe.component.getComponentList('form');
    },

    selectChange(value, obj, form, to, type) {
      const ctx = this;
      ctx[obj].map((i) => {
        if (i[form] === value) {
          if (type === "Array") {
            ctx.form[to] = [i];
          } else {
            ctx.form[to] = i;
          }
        }
      });
    },

    /**
     * 级联配置-添加
     */
    addCascader() {
      const ctx = this;
      if (!ctx.form.cascader) ctx.$set(ctx.form, "cascader", []);
      ctx.form.cascader.push({
        id: ctx.form.cascader.length,
      });
    },
    /**
     * 级联配置-删除
     */
    delCascader(item) {
      const ctx = this;
      ctx.form.cascader.splice(
        ctx.form.cascader.findIndex((i) => i.id === item.id),
        1
      );
    },

    // 枚举值树结构
    async getCategoriesTree() {
      const { tree } = window.getBffApi();
      const res = await tree('code');
      if (res && res.childs) {
        const forTree = (e) => {
          e.childs = e.childs.map((e) => {
            if (e.isLeaf !== "1") {
              forTree(e);
            }
            return {
              ...e,
              code: e && e.other ? e.other.code : e.id,
            };
          });
        };
        this.categoriesTree = res.childs.map((i) => {
          if (i.childs && i.isLeaf !== "1") {
            forTree(i);
          }
          return {
            ...i,
            code: i && i.other ? i.other.code : i.id,
          };
        });
      } else {
        this.categoriesTree = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.prototype-edit {
  .input-group {
    display: flex;
    align-items: center;
    margin-top: 18px;
  }
  .align {
    height: 28px;
    display: flex;
    align-items: center;
  }
  .cascader {
    display: flex;
    align-items: center;
    margin-top: 18px;
    .btn-del {
      font-size: 16px;
      color: #aabec8;
      margin-left: 12px;
      &:hover {
        cursor: pointer;
        color: #f65656;
      }
    }
  }
}
</style>
