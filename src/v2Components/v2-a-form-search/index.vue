<template>
  <div class="search-form" ref="wrapper">
    <div class="page">

      <!-- 左侧筛选 -->
      <div
        class="left"
        v-if="formData.groupMenu && formData.groupMenu.displayType"
      >
        <group-menu
          :group-menu="formData.groupMenu"
          @change="groupMenuChange"
        />
      </div>

      <!-- 右侧表格 -->
      <div class="right">
        <div class="v2-a-form-table-top" ref="tableOprWrapper">
          <!-- 筛选项 -->
          <div
            class="filters"
            v-if="
              formData.hasOwnProperty('filter') && formData.filter.length > 0
            "
          >

            <el-form
              ref="ruleForm"
              label-suffix="："
              :inline="true"
              :model="searchForm"
            >
              <!-- Tab 筛选 -->
              <tabsFilter
                ref="tabsFilter"
                :config="formData.tabsFilter"
                :entityId="formData.entityId.id || formData.entityId"
                @all="searchAll"
                @search="tabsSearch"
                v-if="
                  formData.tabsFilter &&
                  formData.tabsFilter.options &&
                  formData.tabsFilter.options.length
                "
              />
              <!-- 复选框筛选 -->
              <template
                v-if="
                  formData.checkboxFilter &&
                  formData.checkboxFilter.options &&
                  formData.checkboxFilter.options.length
                "
              >
                <div>
                  <el-form-item
                    v-for="(checkbox, index) of formData.checkboxFilter.options"
                    :key="index"
                  >
                    <el-checkbox
                      ref="checkboxFilter"
                      @change="checkboxFilterChange($event, checkbox)"
                      >{{ checkbox.label }}</el-checkbox
                    >
                  </el-form-item>
                </div>
              </template>

              <span
                v-if="
                  formData.hasOwnProperty('filter') &&
                  formData.filter.length > 0
                "
              >
                <el-form-item
                  :label="
                    item.dictionaryItem &&
                    (item.dictionaryItem.name || item.dictionaryItem.desc)
                  "
                  :prop="
                    item.dictionaryItem && item.dictionaryItem.engNameShort
                  "
                  v-for="item in formData.filter"
                  :key="item.id"
                >
                  <component
                    style="width: 180px"
                    :is="item.component ? item.component.href : 'v2-a-input'"
                    :value.sync="searchForm[item.dictionaryItem.engNameShort]"
                    :enumCode="item.enumCode"
                    :entityId="item.entityId"
                    :config="item"
                    @change="componentValue($event, item)"
                  />
                </el-form-item>
              </span>

              <el-form-item>
                <div class="searchBtns">
                  <el-button type="primary" size="mini" @click="filterSubmit"
                    >查询</el-button
                  >
                  <el-button size="mini" @click="resetForm">重置</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <!-- 操作按钮 -->
          <div class="btns" v-if="formData.opr && formData.opr.length > 0">
            <div
              class="btn"
              :style="{ background: !item.isThematic && item.color }"
              :class="{
                btn_w: item.color === '#FFFFFF',
                btn_disabled: oprDisabled(item),
                'bg-primary': item.isThematic
              }"
              :key="item.name"
              v-for="item in formData.opr &&
              formData.opr.filter((i) => i.opr.name !== 'upload')"
              @click.stop="oprClick(item, {}, 'opr')"
            >
              <codeless-icon
                class="btn-icon"
                :icon="item.icon"
                v-if="item.icon"
              ></codeless-icon>
              <span>{{ item.name }}</span>
            </div>

            <opr-upload
              :item="item"
              v-for="item in formData.opr &&
              formData.opr.filter((i) => i.opr.name === 'upload')"
              :key="item.name"
              @handleChange="filterSubmit"
            />
          </div>
        </div>

        <!-- 表格 -->
        <div
          class="right-table"
          ref="tableWrapper"
          :style="{ height: tableHeight }"
        >
          <v2-a-table
            ref="v2ATable"
            :dataTable="formData"
            :newEntity="newEntity"
            @oprClick="oprClick"
            @refresh="filterSubmit"
            @selectionChange="selectionChange"
          />
        </div>
      </div>
    </div>
    <search-form :dialog-info="dialogInfo" @submit="formSubmit" />
    <div id="toolbar-container" class="hidden"></div>
    <div id="editor-container" class="hidden"></div>
  </div>
</template>

<script>
import searchForm from "./form";
import groupMenu from "./groupMenu.vue";
import tabsFilter from "./tabsFilter.vue";
import OprUpload from "./components/oprUpload.vue";
// import { createEditor } from "@wangeditor/editor";
import E from 'wangeditor'

import pck from "./package.json";
export default {
  _options: pck.docs,
  mixins: [ window.codelessMixins.customDialog, window.codelessMixins.vRegister, window.codelessMixins.entityAuthorities, window.codelessMixins.pageList ],
  inject: ["root"],
  name: "v2AFormSearch",
  components: {
    searchForm,
    groupMenu,
    tabsFilter,
    OprUpload,
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          entityId: {
            id: "",
          },
          name: "",
          desc: "",
          filter: [],
          tabsFilter: {
            options: [],
            maxShowLimit: 4,
            showRecordNum: false,
          },
          checkboxFilter: {
            options: [],
          },
          groupMenu: {
            menuProto: "",
            displayType: "",
            secondId: "",
            mainProto: "",
            secondProto: "",
          },
          tableAssignRow: {
            fields: [],
          },
          tablePro: [],
          tableOpr: [],
          tableTip: {
            type: text,
            content: "",
          },
          opr: [],
          queryUrl: "",
          updateUrl: "",
          deleteUrl: "",
          display: "",
        };
      },
    }
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 4 },

      groupSearch: {},
      searchForm: {},
      selectedList: [],
      selectTabsFilter: null,

      dialogInfo: {
        title: "新建",
        opr: {},
        visible: false,
        width: "50%",
        params: {},
        fields: [],
        form: {},

        newEntity: {},
      },
      multipleSelection: [],

      rootArgs: {},
      tableHeight: "100%",

      editor: null,
    };
  },
  watch: {
    "formData.filter": {
      handler(n) {
        const ctx = this;
        if (n && n.length > 0) {
          n.forEach(f=> {
            ctx.$set(ctx.searchForm, f.dictionaryItem.engNameShort, null);
            if (f.entityId) {
              ctx.saveEntityToPageContent(ctx.formData.wid + '-' + f.wid, f.entityId)
            }
            
          })
          ctx.componentChildrenUpdate(n, ctx.formData.wid);
        }
      },
      deep: true,
      // immediate: true
    },
    "formData.display": {
      handler(n, o) {
        if (n !== o) {
          this.$refs.v2ATable.getPageList(1, this.$refs.v2ATable.pageSize);
        }
      },
      deep: true,
      // immediate: true,
    },
    "formData.parentField": {
      handler(n, o) {
        if (n !== o) {
          this.$refs.v2ATable.getPageList(1, this.$refs.v2ATable.pageSize);
        }
      },
      deep: true,
      // immediate: true,
    },
    "formData.tablePro": {
      handler(n) {
        const ctx = this;
        if (n && n.length > 0) {
          ctx.componentChildrenUpdate(n, ctx.formData.wid);
          n.forEach(o=> {
            if (o.page?.prototypeId) {
              ctx.savePageListToPageContent(ctx.formData.wid + '-' + o.wid, o.page.prototypeId);
            }
          })
          
        }
      },
      deep: true,
      // immediate: true
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
              this.savePageListToPageContent(ctx.formData.wid + '-' + o.wid, o.page.prototypeId);
            }
          })
        }
      },
      deep: true,
      // immediate: true
    },   
    "formData.tableOpr": {
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
          })
        }
      },
      deep: true,
      // immediate: true
    },
  },
  computed: {
    oprDisabled() {
      const ctx = this;
      return (item) => {
        if (
          !item.target ||
          !item.hasOwnProperty("target") ||
          JSON.stringify(item.target) === "{}"
        )
          return false;
        if (item.target.value === "0") return false;
        if (item.target.value === "1" && ctx.multipleSelection.length === 1)
          return false;
        if (item.target.value === "2" && ctx.multipleSelection.length >= 1)
          return false;
        return true;
      };
    },
  },
  created() {
    const ctx = this;
  },
  async mounted() {
    const ctx = this;
    console.log("ctx.formData", ctx.formData);
    if (!ctx.formData.entityId) {
      console.log('没有数据实体的表单', ctx.formData);
    }
    await ctx.getEntityDetail();

    this.calcHeight();
    window.addEventListener("resize", this.calcHeight);

    if (ctx.formData.filter?.length > 0) {
      ctx.formData.filter.forEach(f=> {
        ctx.$set(ctx.searchForm, f.dictionaryItem.engNameShort, null);
      })
    }
  },
  methods: {
    calcHeight() {
      this.$nextTick(() => {
        let tableOprWrapper = this.$refs.tableOprWrapper;
        if (tableOprWrapper) {
          let height = tableOprWrapper.offsetHeight;
          this.tableHeight = `calc(100% - ${height}px)`;
        }
        // console.log('表格最后的高度', this.tableHeight);
      });
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    async getEntityDetail() {
      const ctx = this;
      if (!ctx.formData.entityId) return;
      let res = await pipe.entity.getEntityDetail(
        ctx.formData.entityId.id || ctx.formData.entityId
      );
      if (!res) return;
      ctx.newEntity = res;
      ctx.formData.filter.forEach((form) => {
        res.fields.forEach((field) => {
          if (form.dictionaryItem.engNameShort === field.name) {
            form.type = field.type;
            form.id = field.id;

            form.dictionaryItem.validations = field.validations || [];
          }
          if (field.primaryKey === "1") {
            ctx.$set(ctx.formData, "primaryField", {
              id: field.id,
              engNameShort: field.dictionaryItem.engNameShort,
            });
          }
        });
      });
    },

    searchAll() {
      if (this.selectTabsFilter) {
        this.$delete(
          this.searchForm,
          this.selectTabsFilter.dictionaryItem.engNameShort
        );
        this.$delete(
          this.$refs.v2ATable.query,
          this.selectTabsFilter.dictionaryItem.engNameShort
        );
        this.selectTabsFilter = null;
      }
      this.filterSubmit();
    },
    tabsSearch(filterItem) {
      if (this.selectTabsFilter) {
        this.$delete(
          this.searchForm,
          this.selectTabsFilter.dictionaryItem.engNameShort
        );
        this.$delete(
          this.$refs.v2ATable.query,
          this.selectTabsFilter.dictionaryItem.engNameShort
        );
      }
      this.selectTabsFilter = filterItem;
      this.searchForm[filterItem.dictionaryItem.engNameShort] =
        filterItem.value;
      this.filterSubmit();
    },

    checkboxFilterChange(v, c) {
      if (v) {
        let value = v;
        const { presetData } = c;
        if (presetData.key) {
          switch (presetData.key) {
            case "loginUserName": {
              value = this.$store.state.user.userName;
              break;
            }
          }
        }
        this.searchForm[c.field.dictionaryItem.engNameShort] = value;
      } else {
        this.$delete(this.searchForm, c.field.dictionaryItem.engNameShort);
        this.$delete(
          this.$refs.v2ATable.query,
          c.field.dictionaryItem.engNameShort
        );
      }
      this.filterSubmit();
    },

    componentValue(e, item) {
      const ctx = this;
      if (item.cascader && item.cascader.length > 0) {
        item.cascader.forEach((cas) => {
          if (cas.config === "3" && ctx.item.target.value === "1") {
            ctx.searchForm[cas.entityField] = e[cas.compField];
          }
        });
      }
    },
    replaceApiVar(api, context) {
      //把{}内容，替换成当前实体/行数据对应内容。
      if (api) {
        let start = api.indexOf("{");
        let end = api.indexOf("}", start);
        let key = api.substring(start + 1, end);

        return api.substring(0, start) + context[key] + api.substr(end + 1);
      }
    },
    // 操作方法
    oprClick(item, record = {}, type) {
      const ctx = this;
      console.log("操作方法", item, record, type);

      if (type === "opr") {
        console.log("是否不可用", ctx.oprDisabled(item));
        if (ctx.oprDisabled(item)) return;
        record = { row: ctx.multipleSelection };
      }

      const searchOprMap = new Map([
        [
          "open",
          () => {
            ctx.replace(item, record);
          },
        ],
        [
          "open:sub",
          () => {
            ctx.replace(item, record, "SUB");
          },
        ],
        [
          "close",
          () => {
            ctx.$root.cancel();
          },
        ],
        [
          "confirm",
          () => {
            ctx.$root.confirm(ctx);
            ctx.$root.cancel();
          },
        ],
      ]);
      const operationTypeMap = new Map([
        [
          "create",
          () => {
            if (item.createType === "tableRow") {
              ctx.$refs.v2ATable._createRecordByTableRow(item);
            } else {
              ctx.dialogInfo.fields = JSON.parse(JSON.stringify(item.fields));
              ctx.dialogInfo.opr = item;
              ctx.dialogInfo.title = "新增";
              ctx.dialogInfo.visible = true;
            }
          },
        ],
        [
          "update",
          () => {
            ctx.dialogInfo.fields = JSON.parse(JSON.stringify(item.fields));
            ctx.dialogInfo.opr = item;
            ctx.dialogInfo.form = record.row;
            ctx.dialogInfo.title = "修改";
            ctx.dialogInfo.visible = true;
          },
        ],
        [
          "retrieve",
          async () => {
            ctx.replace(item, record, "SUB");
          },
        ],
        [
          "delete",
          () => {
            ctx.dialogInfo.fields = JSON.parse(JSON.stringify(item.fields));
            ctx.dialogInfo.opr = item;
            console.log("record", record);
            ctx.dialogInfo.form = record.row;
            ctx.formSubmit({});
          },
        ],
        [
          "upload",
          () => {
            ctx.dialogInfo.opr = item;
            ctx.formSubmit({});
          },
        ],
        [
          "export",
          () => {
            ctx.dialogInfo.opr = item;
            ctx.formSubmit({});
          },
        ],
        [
          "template",
          () => {
            ctx.dialogInfo.opr = item;
            ctx.formSubmit({});
          },
        ],
      ]);
      const oprMap = new Map([
        [
          "dataEntityMethod",
          () => {
            console.log("item.opr.operationType", item.opr.operationType);
            operationTypeMap.get(item.opr.operationType).call(ctx);
          },
        ],
        [
          "api",
          () => {
            ctx.handleApi(item.opr, record);
          },
        ],
        [
          "publicMethod",
          () => {
            searchOprMap.get(item.opr.id).call(ctx);
          },
        ],
      ]);

      oprMap.get(item.type.value || item.type).call(ctx);
    },
    // 表格操作方法
    tableOprClick(e) {},
    replace(
      item,
      params = { formData: this.formData, searchForm: this.searchForm },
      type = ""
    ) {
      const ctx = this;
      console.log("item", item);
      console.log("params", params);
      console.log("type", type);
      type =
        item.opr.id.indexOf("sub") > -1 ||
        (item.opr.operationType &&
          item.opr.operationType.indexOf("retrieve") > -1)
          ? "SUB"
          : "";
      let syncParamsObj = {}
      if (item.syncParams) {
        
        item.syncParams.forEach(i=> {
          if (i.current) {
            if (i.isComponent) {
            ctx.$set(syncParamsObj, i.target, eval('params.' + i.current))
            }else {
              ctx.$set(syncParamsObj, i.target, eval('ctx.root.args.' + i.current))
            }
          }
        })
      }
      let option = {
        title: item.page.title ||  item.page.name,
        path: item.type === "WINDOW" ? item.page : (item.page.path || ''),
        params: {
          pageId: item.page.prototypeId,
          prototypeId: item.page.prototypeId,
          // ...params,
          syncParamsObj,
          row: params.row,
          // page: item.page,
          runtime: true,
          isFromCodeless: true
        },
        dialogInfo: item.dialogInfo
      };
      console.log('传递的参数', option);
      ctx.v2ComponentOpen(option, type);
      
      // ctx.openRenderPage({
      //   title: item.page.title ||  item.page.name,
      //   layout:"backTop",
      //   type: 'SUB',
      //   path:"openSinglePage/render",
      //   body: true,
      //   height: item.dialogInfo.height + item.dialogInfo.heightUnit || "80%",
      //   width: item.dialogInfo.width + item.dialogInfo.widthUnit || "60%",
      //   // params: codeParams,
      //   propsData:{
      //        pageRenderConfig: codeParams, 
      //      },
      //   hideConfirmBtn: true,
      //   hideCancelBtn: true,
      //   beforeConfirm: ($el) => {
      //     //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
      //     return true;
      //   },
      //   confirmCallback: ($el) => {
      //     ctx.$refs.v2ATable.getPageList();
      //   },
      //   cancelCallback: ($el) => {
      //     console.log("点击取消");
      //   },
      // });
    },
    async handleApi(api, record) {
      const ctx = this;
      console.log(api);
      
      this.j2html(record.row.CONTENT)
       
    },
    async j2html(data) {
      const ctx = this;
      if(!data) return
      let jsonData = null
      if (data.indexOf('{') && JSON.parse(data.replaceAll('&quot;', "\""))) {
        jsonData = JSON.parse(data.replaceAll('&quot;', "\""))
      }

      ctx.editor = new E('#toolbar-container', '#editor-container');
      ctx.editor.onChange = newHtml => {
        ctx.jsonHtml = newHtml;
        document.getElementById('textarea').value = jsonHtml;
      }

      ctx.editor.create();  
      ctx.editor.txt.setJSON(JSON.parse(jsonData.replaceAll("&quot;", '"')))
      ctx.editor.disable();
      
      // const editorConfig = {}
      // editorConfig.readOnly = true

      //   // 创建编辑器
      //   const editor = createEditor({
      //     content: jsonData,
      //     selector: "#editor-container",
      //     config: editorConfig,
      //     mode: "default", // 或 'simple' 参考下文
      //   });

        const { sendMessage } = window.getQwApi()
        await sendMessage({ context: editor.txt.text() })
    },
    groupMenuChange(e) {
      const ctx = this;
      ctx.searchForm[ctx.formData.groupMenu.menuProto] = e;
      ctx.groupSearch = {
        [ctx.formData.groupMenu.menuProto]: e,
      };
      ctx.filterSubmit();
    },
    // 过滤项查询
    filterSubmit() {
      const ctx = this;
      console.log('表格过滤的字段', ctx.searchForm);
      if (JSON.stringify(ctx.searchForm) !== '{}') {
        ctx.$refs.ruleForm.validate((valid) => {
          if (valid) {
            for (const key in ctx.searchForm) {
              if(ctx.newEntity.type === 'db') {
                if (!ctx.searchForm[key] && ctx.$refs.v2ATable.query[key]) {
                  delete ctx.$refs.v2ATable.query[key];
                } else if (ctx.searchForm[key]) {
                  ctx.$refs.v2ATable.query[key] = ctx.searchForm[key];
                }
              }else {
                let entityFieldId = ctx.newEntity.fields.find(i=>i.dictionaryItem.engNameShort === key).id
                let params = {
                  entityFieldId,
                  value: ctx.searchForm[key]
                }
                let index = ctx.$refs.v2ATable.dataSourceQuery.findIndex(i=>i.entityFieldId === entityFieldId)
                if(index > -1) {
                  ctx.$refs.v2ATable.dataSourceQuery[index].value = params.value
                }else {
                  ctx.$refs.v2ATable.dataSourceQuery.push(params)
                }
              }
              
            }
            ctx.$refs.v2ATable.getPageList(1, ctx.$refs.v2ATable.pageSize);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }else {
        ctx.$refs.v2ATable.getPageList(1, ctx.$refs.v2ATable.pageSize);
      }
      
    },
    // 过滤箱重置
    resetForm() {
      const ctx = this;
      if (ctx.$refs.tabsFilter) {
        ctx.$refs.tabsFilter.reset();
      }
      if (ctx.$refs.checkboxFilter) {
        if (Array.isArray(ctx.$refs.checkboxFilter)) {
          ctx.$refs.checkboxFilter.forEach((t) => (t.value = false));
        } else {
          ctx.$refs.checkboxFilter.value = false;
        }
      }

      ctx.$refs.ruleForm.resetFields();
      ctx.$refs.v2ATable.query = {};

      if (ctx.formData.groupMenu.menuProto) {
        let pro = ctx.formData.groupMenu.menuProto;
        ctx.searchForm[pro] = ctx.groupSearch[pro];
        ctx.filterSubmit();
      } else {
        ctx.$refs.v2ATable.getPageList(1, ctx.$refs.v2ATable.pageSize);
      }
    },

    entityExport() {
      const ctx = this;
    },

    // 实体操作提交
    async formSubmit(e) {
      const ctx = this;
      let form = e;
      let operationType = ctx.dialogInfo.opr.opr.operationType;
      let params = {
        entityId: ctx.dialogInfo.opr.entityId.id || ctx.dialogInfo.opr.entityId,
        fields: [],
      };
      let res = await pipe.entity.getEntityDetail(
        ctx.dialogInfo.opr.entityId.id || ctx.dialogInfo.opr.entityId
      );
      if (!res) return;
      let idObj = res.fields.find((i) => i.primaryKey === "1");
      console.log("主键", idObj);

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
      console.log(form, 'dasdsadas');
      // debugger
      if (res.type !== 'data_source' && !form[idObj.dictionaryItem.engNameShort]) {
        params.fields.push({
          entityFieldId: idObj.id,
          value: ctx.dialogInfo.form[idObj.dictionaryItem.engNameShort] || '',
        });
      }
      console.log('ctx.dialogInfo.form', ctx.dialogInfo.form);

      if (operationType === "delete") {
        ctx.openCustomDialog({
          title: "提示",
          path: "deleteConfirm",
          width: "300px",
          component: {
            template: `<div>此操作将永久删除该记录, 是否继续？</div>`,
          },
          confirmCallback() {
            if(res.type !== 'data_source') {
              if (Array.isArray(ctx.dialogInfo.form)) {
                params.recordId = ctx.dialogInfo.form.map(i=>i[idObj.dictionaryItem.engNameShort])
              }else {
                params.recordId = ctx.dialogInfo.form[idObj.dictionaryItem.engNameShort];
              }
            }else {
              if (Array.isArray(ctx.dialogInfo.form)) {
                const formArr = ctx.dialogInfo.form;
                res.fields.forEach((i) => {
                  params.fields.push({
                    entityFieldId: i.id,
                    value: formArr.map(fa=>fa[i.dictionaryItem.engNameShort] || '').toString(),
                  });
                });
              }else {
                for (const key in ctx.dialogInfo.form) {
                  res.fields.forEach((i) => {
                    if (i.dictionaryItem.engNameShort === key) {
                      params.fields.push({
                        entityFieldId: i.id,
                        value: ctx.dialogInfo.form[key],
                      });
                    }
                  });
                }
              }
            }
            
            console.log("删除的id", ctx.dialogInfo.form, params);
            ctx.entityRequest(operationType, params, res);
          },
        });
      } else if (operationType === "upload") {
        console.log(params);
      } else if (operationType === "export") {
        console.log(params);
        const paramsMap = new Map([
          [
            "db",
            {
              entityId: res.id,
              orders: [],
              pageNum: ctx.$refs.v2ATable.currentPage,
              pageSize:
                ctx.$refs.v2ATable.dataTable.display === "tree"
                  ? 10000
                  : ctx.$refs.v2ATable.pageSize,
              query: ctx.$refs.v2ATable.query,
              ranges: ctx.$refs.v2ATable.ranges,
              retrieveId: "paging",
            },
          ],
          [
            "data_source",
            {
              entityId: res.id,
              fields: params.fields
            },
          ],
        ]);
        ctx.entityRequest(operationType, paramsMap.get(res.type), res);
      } else {
        ctx.entityRequest(operationType, params, res);
      }
    },

    // 实体操作请求
    entityRequest(operationType, params, entity) {
      const ctx = this;
      const operationTypeMap = new Map([
        ["create", "添加"],
        ["update", "修改"],
        ["delete", "删除"],
        ["export", "导出"],
        ["upload", "导入"],
        ["template", "下载模板"],
      ]);
      pipe.entity
        .getEntityData(entity.id, operationType, params)
        .then((res) => {
          ctx.$notify({
            message: operationTypeMap.get(operationType) + "成功！",
            title: "成功",
            type: "success",
          });
          ctx.dialogInfo.visible = false;
          ctx.filterSubmit();
        })
        .catch((err) => {
          // ctx.$notify.error({
          //   title: "错误",
          //   message: err.msg,
          // });
          ctx.dialogInfo.visible = false;
        });
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calcHeight);
  },
};
</script>

<style lang="less" scoped>
.search-form {
  display: flex;
  width: 100%;
  height: 100% !important;
  background: #fff;

  .page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    .left {
      flex: 0.3;
      height: 100%;
      box-sizing: border-box;
      margin-right: 16px;
    }
    .right {
      flex: 1;
      height: 100%;
      // padding-left: 18px;
      overflow: hidden;
      box-sizing: border-box;
      // display: flex;
      // flex-direction: column;
      &::-webkit-scrollbar {
        display: none;
      }
      .filters {
        width: 100%;
        // min-height: 95px;
        // max-height: 300px;
        // overflow-y: scroll;
        border: 1px solid #cccccc;
        opacity: 1;
        border-radius: 3px;
        box-sizing: border-box;
        // padding-left: 9px;
        // padding-top: 5px;
        padding: 22px 9px;
        .el-form {
          .el-form-item {
            margin-bottom: 0;
          }
        }
        .searchBtns {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .btns {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 16px 0;
        .btn {
          width: fit-content;
          height: 28px;
          padding: 0 20px 0 16px;
          opacity: 1;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 22px;
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
        .btn_w {
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
        }
        .btn_disabled {
          cursor: not-allowed;
          opacity: 0.5;
          &:hover {
            opacity: 0.5;
          }
        }
      }
      .right-table {
        // max-height: calc(100% - 130px);
        // min-height: calc(100% - 360px);

        // &.has-btns {
        //   max-height: calc(100% - 155px);
        // }
      }
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;

    .el-dialog {
      .el-dialog__body {
        max-height: 600px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>
