<template>
  <div class="btn-form overflow-scroll" style="max-height: 500px;">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      size="mini"
      label-suffix="："
    >
      <el-form-item label="按钮名称" prop="name">
        <el-input style="width: 233px" v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="按钮图标" prop="icon">
        <codeless-dialog-icon :value.sync="form.icon" :operationEnable = "true"/>
      </el-form-item>
      <el-form-item label="按钮颜色" prop="color">
        <color-checkbox :value.sync="form.color" :isThematic.sync="form.isThematic" />
      </el-form-item>
      <el-form-item label="按钮类型" prop="type">
        <el-radio-group v-model="form.type" @change="btnTypeChange">
          <el-radio-button
            :label="item"
            v-for="(item, index) in btnType"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="数据实体"
        v-if="form.type.value === 'dataEntityMethod' || (form.opr.name && form.opr.id.indexOf('templet') > -1)  || (form.opr.name && form.opr.id.indexOf('confirm:pageData') > -1)"
        prop="entityId"
      >
        <entity-select
          style="width: 233px"
          :schema-type="(form.opr.name && form.opr.id.indexOf('confirm:pageData') > -1) ? 'createRecord' :'ALCAP_PAGEING'"
          :value.sync="form.entityId"
          mode="id"
          @handleChange="entityChange"
        ></entity-select>
      </el-form-item>
      <el-form-item :label="oprLabel[0]" prop="opr">
        <el-select
          style="width: 233px"
          filterable
          v-model="form.opr"
          :getPopupContainer="getParentWindow"
          :placeholder="oprLabel[1]"
          value-key="id"
        >
          <el-option
            :value="item"
            v-for="item in editComponentSelectList"
            :key="item.id"
            :label="item.desc || item.name"
          >
            <span class="flex items-center justify-between">
              <span>{{ item.name || item.desc }}</span>
              <span class="text-sm text-gray-400">{{ item.desc || "" }}</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="页面列表"
        v-if="form.opr.name && form.opr.id.indexOf('open') > -1"
      >
        <page-select :value.sync="form.page" width="233px" :wid="form.wid" @select="choosePage" />
      </el-form-item>
      <el-form-item label="页面传参" v-if="form.type.value === 'publicMethod' && form.page && JSON.stringify(form.page) !== '{}'">
        <codeless-page-data-binding
          :value.sync="form.syncParams"
          :current-args-arr="params.argsArr"
          :args-arr="argsArr"
          :component-params="componentParams"
          :componentName="'组件'"
        />
      </el-form-item>
      <el-form-item
        :label="`配置${form.opr.desc || ''}字段`"
        v-if="form.type.value === 'dataEntityMethod' && (form.opr.operationType === 'create' || form.opr.operationType === 'update')"
        prop="fields"
      >
        <el-select
          filterable
          style="width: 233px"
          value-key="id"
          v-model="form.fields"
          multiple
          placeholder="请选择"
          @change="fieldsChange"
        >
          <el-option
            v-for="item in fields"
            :key="item.id"
            :label="item.dictionaryItem.name"
            :value="item"
          >
          </el-option>
        </el-select>

        <div
          class="bg-#F0F5F7 rounded-sm px-4 py-3 mt-4 box-border"
          v-for="item in form.fields"
          :key="item.id"
        >
          <el-row :gutter="24" justify="space-between">
            <el-col :span="22"
              ><div class="grid-content bg-purple font-bold">
                <el-input style="width: 180px" v-model="item.dictionaryItem.name" placeholder=""></el-input>
              </div></el-col
            >
            <el-col :span="1">
              <div class="grid-content bg-purple">
                <i
                  class="el-icon-close cursor-pointer"
                  @click="
                    form.fields.splice(
                      form.fields.findIndex((i) => i.id === item.id),
                      1
                    )
                  "
                ></i>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mt-3">
            <!-- <el-col :span="4"
              ><div class="grid-content bg-purple">组件</div></el-col
            > -->
            <el-col :span="24">
              <el-form-item label="组件">
                <el-select
                  filterable
                  v-model="item.component"
                  value-key="href"
                  placeholder="请选择"
                  style="width: 270px"
                  @change="change"
                >
                  <el-option
                    :value="itemi"
                    :label="itemi.name"
                    v-for="itemi in comps"
                    :key="itemi.href"
                  >
                    {{ itemi.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              
            </el-col>
          </el-row>

          <el-row :gutter="24" class="mt-3" 
            v-for="code in codeLessTypeOption(item)"
            :key="code.name"
          >
            <!-- <el-col :span="4"
              ><div class="grid-content bg-purple">{{ code.desp }}</div></el-col
            > -->
            <el-col :span="24">
              <code-less-config :form="item" :codeLessType="code.codeLessType" :code="code" :is-form="true"  />
            </el-col>
          </el-row>

          <el-row :gutter="24" class="mt-3" align="middle">
            <!-- <el-col :span="4"
              ><div class="grid-content bg-purple">级联</div></el-col
            > -->
            <el-col :span="20">
              <el-form-item label="级联配置">
                <div class=" flex flex-col  mt-1 ">
                  <div
                    class="
                      cursor-pointer
                      rounded-full
                      w-4
                      h-4
                      bg-primary
                      flex
                      justify-center
                      items-center
                    "
                    @click="addCascader(item)"
                  >
                    <i class="el-icon-plus text-white text-xs"></i>
                  </div>
                  <div
                    class="cascader mt-3"
                    v-for="(itemC, index) in item.cascader"
                    :key="itemC.id"
                  >
                    <div style="display: flex; align-items: center;">
                      <span style="margin-right: 9px"
                        >{{ index + 1 }}.</span
                      >
                      <el-select v-model="itemC.config" style="width: 100px ">
                        <el-option label="大于" value="1">大于</el-option>
                        <el-option label="小于" value="2">小于</el-option>
                        <el-option label="回显" value="3">回显</el-option>
                      </el-select>
                      <!-- <el-input
                        style="width: 171px; border-radius: 0px 4px 4px 0px"
                        default-value="Xihu District"
                      /> -->
                      <el-select
                        v-model="itemC.compField"
                        placeholder="选择字段"
                        style="width: 100px"
                      >
                        <el-option
                          v-for="itemO in item.entityId && item.entityId.fields"
                          :value="itemO.dictionaryItem.engNameShort"
                          :label="itemO.dictionaryItem.name"
                          :key="itemO.id"
                        ></el-option>
                      </el-select>
                      <span style="margin: 0 9px; font-weight: bold">，</span>
                      <el-select
                        v-model="itemC.entityField"
                        placeholder="选择字段"
                        style="width: 100px"
                        v-if="itemC.config == 3"
                      >
                        <el-option
                          v-for="itemO in params.obj && params.obj.entityId.fields"
                          :value="itemO.dictionaryItem.engNameShort"
                          :label="itemO.dictionaryItem.name"
                          :key="itemO.id"
                        ></el-option>
                      </el-select>

                      <el-select default-value="可用" style="width: 100px" v-else>
                        <el-option value="able"> 可用 </el-option>
                        <el-option value="disabled"> 不可用 </el-option>
                        <el-option value="hide"> 不可见 </el-option>
                      </el-select>
                      <i class=" ml-3 el-icon-remove btn-del cursor-pointer hover:text-red-400" @click="delCascader(itemC, item)"></i>
                    </div>
                    
                  </div>
                </div>
              </el-form-item>
              
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item
        label="弹窗宽度"
        v-if="form.type.value === 'publicMethod' && form.opr.id === 'open:sub'"
      >
        <el-input
          v-model="form.dialogInfo.width"
          style="width: 116.5px"
          placeholder="请填写"
        />
        <el-select style="width: 116.5px" v-model="form.dialogInfo.widthUnit">
          <el-option value="px">px</el-option>
          <el-option value="em">em</el-option>
          <el-option value="rem">rem</el-option>
          <el-option value="%">%</el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="弹窗高度"
        v-if="form.type.value === 'publicMethod' && form.opr.id === 'open:sub'"
      >
        <el-input
          v-model="form.dialogInfo.height"
          style="width: 116.5px"
          placeholder="请填写"
        />
        <el-select style="width: 116.5px" v-model="form.dialogInfo.heightUnit">
          <el-option value="px">px</el-option>
          <el-option value="em">em</el-option>
          <el-option value="rem">rem</el-option>
          <el-option value="%">%</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建方式" v-if="form.opr.operationType === 'create'">
        <el-radio-group v-model="form.createType">
          <el-radio
            :label="item.value"
            v-for="item in createType"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="确认弹窗" v-if="editComponentShow('hasConfirm')">
        <el-switch v-model="form.hasConfirm" @change="confirmChange"></el-switch>
      </el-form-item>

      <el-form-item label="弹窗标题" v-if="form.hasConfirm">
        <el-input style="width: 233px" v-model="form.confirmTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="弹窗图片" v-if="form.hasConfirm">
        <el-select
          filterable
          style="width: 233px"
          v-model="form.confirmImg"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $store.state.public.publicImg"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="弹窗文案" v-if="form.hasConfirm">
        <el-input style="width: 233px" v-model="form.confirmText" placeholder="请输入文案" ></el-input>
      </el-form-item>

      <el-form-item label="操作目标" v-if="editComponentShow('target')">
        <el-radio-group v-model="form.target">
          <el-radio-button
            :label="item"
            v-for="(item, index) in targetType"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>


      <el-form-item label="级联配置" v-if="editComponentShow('cascader')">
        <btn-cascader :current-args-arr="params.argsArr" :form="form" />
  
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import ColorCheckbox from "./colorCheckbox.vue";

// import entitySelect from '@/views/codeLess/components/entitySelect'
import codeLessConfig from "./codeLessConfig.vue";
import btnCascader from "./btnCascader.vue";
export default {
  components: {
    ColorCheckbox,
    // entitySelect,
    codeLessConfig,
    btnCascader
  },
  props: ["params", "title"],
  data() {
    return {
      form: {
        name: "",
        icon: "",
        color: "#3698F2",
        type: {
          label: "实体操作",
          value: "dataEntityMethod",
        },
        entityId: {},
        opr: {},
        target: {
          label: "无",
          value: "0",
        },
        createType: 'dialog',
        page: {},
        fields: [],
        dialogInfo: {
          width: "60",
          widthUnit: "%",
          height: "80",
          heightUnit: "%",
        },
      },
      rules: {
        name: [{ required: true, message: "按钮名称不能为空！" }],
      },
      btnType: [
        {
          label: "实体操作",
          value: "dataEntityMethod",
        },
        {
          label: "API调用",
          value: "api",
        },
        {
          label: "通用方法",
          value: "publicMethod",
        },
      ],
      targetType: [
        {
          label: "无",
          value: "0",
        },
        {
          label: "单选数据",
          value: "1",
        },
        {
          label: "多选数据",
          value: "2",
        },
      ],
      createType: [
        {
          label: '弹窗',
          value: 'dialog'
        },
        {
          label: '表格行',
          value: 'tableRow'
        }
      ],
      icons: [],
      entities: [],
      apis: [],
      publicMethods: [
        {
          name: "打开弹窗",
          id: "open:sub",
        },
        {
          name: "打开页面",
          id: "open",
        },
        {
          name: "重置表单",
          id: "reset",
          editComponent: [ "formConfig" ]
        },
        {
          name: "提交表单",
          id: "confirm",
          editComponent: [ "formConfig" ]
        },
        {
          name: "提交流程数据",
          id: "confirm:process",
          editComponent: [ "formConfig" ]
        },
        {
          name: "模板",
          id: "templet",
          editComponent: [ "formConfig" ]
        },
        {
          name: "回显表单",
          id: "showFormContent",
          editComponent: [ "formConfig" ]
        },
        {
          name: "提交变量",
          id: "confirm:pageData",
          editComponent: [ "formConfig" ]
        }
      ],
      selectList: [],
      menus: [],

      schemas: [],
      fields: [],

      otherOperation: [
        {
          desc: '导出记录',
          name: 'export',
          id: 'export',
          operationType: 'export',
          editComponent: [ "formSearch" ]
        },
        {
          desc: '导入记录',
          name: 'upload',
          id: 'upload',
          operationType: 'upload',
          editComponent: [ "formSearch" ]
        },
        {
          desc: '导入模板',
          name: 'template',
          id: 'template',
          operationType: 'template',
          editComponent: [ "formSearch" ]
        },
      ],
      stepFn: [
        {
          id: '',
          name: '无'
        },
        {
          id: 'next',
          name: '下一步'
        },
        {
          id: 'pre',
          name: '上一步'
        }
      ],

      argsArr: [],
    };
  },
  async mounted() {
    const ctx = this;
    if (ctx.params.obj) {
      ctx.form = {
        ...ctx.params.obj,
      };
      console.log("编辑", ctx.params);
    }
    if (JSON.stringify(ctx.params.entity) !== '{}' && !ctx.form.entityId) {
      ctx.$nextTick(() => {
        ctx.$set(ctx.form, "entityId", ctx.params.entity.id);
      });
      ctx.getSchemasAndFields(ctx.params.entity);
      console.log("添加", ctx.form.entityId);
    }
    if(ctx.form.entityId) {
      ctx.entity = await pipe.entity.getEntityDetail(ctx.form.entityId);
      ctx.getSchemasAndFields(ctx.entity);
    }
    console.log("编辑", ctx.params);
    ctx.apiList();
    ctx.choosePage(ctx.form?.page);
  },
  computed: {
    editComponentSelectList() {
      if (this.selectList.some(i=>i.editComponent)) {
        this.selectList = this.selectList.filter(i=> {
          if (i.editComponent) {
            if(i.editComponent.includes(this.params.editComponent)) return i
          }else {
            return i
          }
        })
      }

      return this.selectList
    },
    editComponentShow() {
      return (key)=> {
        const ctx = this;
        const editMap = {
          'formConfig': [ 'hasConfirm', 'cascader' ],
          'formSearch': [ 'target' ]
        }
        return editMap[ctx.params.editComponent].includes(key);
      }
    },
    oprLabel() {
      const oprMap = new Map([
        ["dataEntityMethod", ["实体操作", "请选择实体操作", "schemas"]],
        ["api", ["API", "请选择API", "apis"]],
        ["publicMethod", ["方法清单", "请选择方法", "publicMethods"]],
      ]);
      this.selectList =
        this.form.type.value && this[oprMap.get(this.form.type.value)[2]];

      return oprMap.get(this.form.type.value);
    },
    comps() {
      const ctx = this;
      let comps = [];
      return pipe.component.getComponentList('form')
    },
    codeLessTypeOption() {
      return (item=> {
        const ctx = this;
        const form = item;
        const option = item.component.href && pipe.component.getComponentOptions(item.component);
        
        if (!option) return;
        let codeLessTypeOption = option.filter((i) => {
          if (!form.changeType && !form.valueArray && i.codeLessType) return i;
          if (form.changeType && form.valueArray && i.codeLessType) {
            if (!form.valueArray.includes(i.name)) return i;
            if (form.valueArray.includes(i.name) && form.changeType === i.name)
              return i;
          }
        });
        // console.log("codeLessTypeOption", codeLessTypeOption);
        return codeLessTypeOption;
      }) 
    },
    componentParams() {
      const ctx = this;
      console.log('ctx.params.entity', ctx.params);
      const fields = ctx.params.entity.fields.map((i) => {
        return {
          id: "row." + i.dictionaryItem.engNameShort,
          name: i.dictionaryItem.name,
        };
      });
      return [
        {
          id: "row",
          name: "行数据",
        },
        ...fields,
      ];
    },
  },
  methods: {
    // 开启确认弹窗
    confirmChange(e) {
    },
    getSchemasAndFields(e) {
      const ctx = this
      ctx.schemas = e.schemas.map(i=>{
        return {
          desc: i.desc,
          name: i.name,
          id: i.id,
          operationType: i.operationType,
          tenantId: i.tenantId,
          type: i.type
        }
      });
      ctx.schemas = [ ...ctx.schemas, ...ctx.otherOperation.filter(i=>i.editComponent.includes(this.params.editComponent)) ]

      ctx.fields = e.fields;
    },
    entityChange(e) {
      const ctx = this;
      ctx.getSchemasAndFields(e)
    },
     /**
     * 级联配置-添加
     */
    addCascader(item) {
      const ctx = this;
      if(!item.cascader) {
        ctx.$set(item, 'cascader', []);
      }
      item.cascader.push({
        id: item.cascader.length,
        config: '',
        compField: '',
        entityField: ''
      });
      console.log('item', item);
    },
    /**
     * 级联配置-删除
     */
    delCascader(itemC, item) {
      const ctx = this;
      item.cascader.splice(
        item.cascader.findIndex((i) => i.id === itemC.id),
        1
      );
    },
    fieldsChange(e) {
      console.log(e);
      const {
        v2AInput,
      } = window.codelessUtils;
      e.forEach(f => {
        if (!f.component) {
          f.component = { ...v2AInput }
        }
      });
      
    },
    change(e) {
      console.log(e.option);
    },
    getPageInfo(pageContent) {
      const ctx = this;
      msgHub.$emit("argsArrChange", pageContent.argsArr);
      ctx.argsArr = pageContent.argsArr;
    },
    // 页面选择
    async choosePage(e) {
      const ctx = this;
      if (!e) return;
      // ctx.form.page = e;

      // let res = await this._getMenu(e.id);
      // msgHub.$emit("argsArrChange", res.argsArr);
      // ctx.argsArr = res.argsArr;
      if (!ctx.form.syncParams || ctx.form.syncParams.length === 0) {
        ctx.$set(ctx.form, "syncParams", [
          {
            id: new Date().getTime(),
            target: "",
            current: "",
            isComponent: false,
          },
        ]);
      }
      let pageContent = {
        argsArr: [],
      };
      if (e.pageContent) {
        pageContent = JSON.parse(e.pageContent);
      }
      this.getPageInfo(pageContent);
    },
    // 提交内容
    onSubmit(handlerSubmit) {
      const ctx = this;
      console.log(ctx.form.name);
      let closeDialog = true;
      ctx.$refs.form.validate((valid) => {
        if (valid) {
          // ctx.$nextTick(() => {
            let form = JSON.parse(JSON.stringify(ctx.form));
            // ctx.$parent.$parent.handleSubmit("Btn", form);
            // ctx.$parent.$parent.dialogInfo.visible = false;
            // ctx.$emit('handleSubmit', "Btn", form)
            handlerSubmit("Btn", form)
          // });
        } else {
          closeDialog = false
          console.log("error submit!!");
          return false;
        }
      });
      return closeDialog
    },
    cancel() {
      const ctx = this;
      ctx.$nextTick(() => {
        ctx.$parent.$parent.dialogInfo.visible = false;
        ctx.$refs.form.resetFields();
      });
    },
    getParentWindow(triggerNode) {
      return triggerNode.parentNode || window.document.body;
    },
    apiList() {
      const ctx = this;
      ctx.apis = [];
    },
    findMenuChildren(e, arr) {
      const ctx = this;
      arr.map((menu) => {
        if (e === menu.path) {
          ctx.form.page = menu;
        } else {
          if (menu.children) {
            ctx.findMenuChildren(e, menu.children);
          }
        }
      });
    },
    // 按钮类型改变
    btnTypeChange(e) {
      const ctx = this;
      ctx.form.opr = "";
      if (e.value === 'dataEntityMethod') {
        ctx.form.page = {}
      }else if (e.value === 'api') {
        ctx.form.fields = []
      }else if (e.value === 'publicMethod') {
        ctx.form.fields = []
      }
      ctx.$forceUpdate();
    },
  },
};
</script>

<style>
</style>