<template>
  <div class="v2-a-form-search-edit">
    <div class="menus"></div>
    <el-form size="mini" label-suffix="：" :model="obj.model.formData">
      <div class="sub-title">
        <span class="mb-2">
          <i class="el-icon-caret-bottom" />
          <span style="color: red">*</span>
          数据实体：</span
        >
      </div>
      <el-form-item>
        <entity-select
          :schema-type="schemaType"
          :value.sync="obj.model.formData.entityId"
          :wid="obj.model.wid"
          mode="id"
          @handleChange="entityChange($event, true)"
        ></entity-select>
      </el-form-item>
      <div class="mb-2" v-for="ppt in ppts.filter(i=>i.type === selectedEntity.type)" :key="ppt.name">
          <span class="sub-title">
            <span class="ml-3 font-normal">{{ ppt.title + '实体字段' }}：</span>
            <el-select
              v-model="obj.model.formData[ppt.name]"
              :placeholder="`选择字段`"
              style="width: 140px"
              size="mini"
              filterable
            >
              <el-option
                v-for="item in selectedEntity.fields"
                :value="item.dictionaryItem.engNameShort"
                :label="item.dictionaryItem.name"
                :key="item.id"
              ></el-option>
            </el-select>
          </span>
        </div>

      <div class="" v-if="obj.model.formData.entityId">
        <div class="sub-title -mb-2">
          <span
            ><i
              :class="filterShow[0] ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click="caretBottomClick(0)"
            />筛选项：
          </span>
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @command="fieldsSplice($event, 'filter')"
          >
            <!-- <span class="btn-add" @click="(e) => e.preventDefault()">+</span> -->
            <el-button type="primary" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="(e) => e.preventDefault()" size="mini"></el-button>
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
                    (itemi.dictionaryItem && itemi.dictionaryItem.name) ||
                    itemi.desc ||
                    itemi.name
                  }}</span>
                  <i
                    class="el-icon-check text-blue-300"
                    v-if="
                      obj.model.formData &&
                      obj.model.formData.filter.some((i) => i.id === itemi.id)
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

        <el-form-item v-show="filterShow[0]">
          <prototype-config
            v-for="(itemo, indexo) in obj.model.formData.filter"
            :key="itemo.id"
            :index="indexo"
            :proto="itemo"
            :entity="selectedEntity"
            :formData="obj.model.formData"
            :editComponent="editComponent"
            type="Prototype"
            @formConfig="formConfig($event, indexo, 'filter')"
            @del="fieldsSplice"
          />
        </el-form-item>

        <div>
          <span class="sub-title -mb-1  mt-2">
            <span
              ><i
                :class="filterShow[1] ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
                @click="caretBottomClick(1)"
              />操作按钮：</span
            >
            <!-- <span class="btn-add" @click="openForm('Btn')">+</span> -->
            <el-button type="primary" class="w-5 h-5" style="padding: 0;" icon="el-icon-plus" circle @click="openForm('Btn')" size="mini"></el-button>
          </span>
          <el-form-item v-show="filterShow[1]">
            <prototype-config
              v-for="(itemo, indexo) in obj.model.formData.opr"
              :key="itemo.name"
              :index="indexo"
              :proto="itemo"
              :entity="selectedEntity"
              :formData="obj.model.formData"
              :editComponent="editComponent"
              type="Btn"
              @formConfig="formConfig($event, indexo, 'opr')"
              @del="fieldsSplice($event, 'opr')"
            />
          </el-form-item>
        </div>

        <div class="sub-title mt-2">
          <span
            ><i
              :class="filterShow[2] ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click="caretBottomClick(2)"
            />表格：</span
          >
        </div>
        <div v-show="filterShow[2]">
          <el-form-item>
            <span
              class="sub-title -mb-1 flex items-center justify-between"
              style="font-weight: 400"
            >
              <span class="" style="margin-left: 6px">表格字段：</span>
              <el-dropdown
                trigger="click"
                :hide-on-click="false"
                @command="tableProSplice"
              >
                <!-- <span class="btn-add" @click="(e) => e.preventDefault()"
                  >+</span
                > -->
                <el-button type="primary" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="(e) => e.preventDefault()" size="mini"></el-button>
                
                <el-dropdown-menu
                  style="width: 220px; max-height: 400px; overflow: scroll"
                  slot="dropdown"
                >
                  <el-dropdown-item
                    v-for="itemi in selectedEntity && selectedEntity.tablePro"
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
                          obj.model.formData.tablePro.some(
                            (i) =>
                              (i.dictionaryItem && i.dictionaryItem.name) ===
                              (itemi.dictionaryItem &&
                                itemi.dictionaryItem.name)
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
            </span>
            <prototype-config
              v-for="(itemo, indexo) in obj.model.formData.tablePro"
              :key="itemo.id"
              :index="indexo"
              :proto="itemo"
              :entity="selectedEntity"
              :formData="obj.model.formData"
              :editComponent="editComponent"
              type="TablePro"
              @formConfig="formConfig($event, indexo, 'tablePro')"
              @del="fieldsSplice($event, 'tablePro')"
            />
          </el-form-item>
          <el-form-item>
            <span
              class="sub-title flex items-center justify-between"
              style="font-weight: 400"
            >
              <span class="" style="margin-left: 6px">表格列操作：</span>
              <!-- <span class="btn-add" @click="openForm('TableOpr')">+</span> -->
              <el-button type="primary" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="openForm('TableOpr')" size="mini"></el-button>
            </span>

            <prototype-config
              v-for="(itemo, indexo) in obj.model.formData.tableOpr"
              :key="itemo.wid"
              :index="indexo"
              :proto="itemo"
              :entity="selectedEntity"
              :fields="selectedEntity.fields"
              :formData="obj.model.formData"
              :editComponent="editComponent"
              type="TableOpr"
              @formConfig="formConfig($event, indexo, 'tableOpr')"
              @del="fieldsSplice($event, 'tableOpr')"
            />
          </el-form-item>
          <el-form-item>
            <span class="w-full h-6 flex items-center justify-between">
              <span class="" style="margin-left: 6px">表格多选框显隐：</span>
              <el-switch  v-model="obj.model.formData.notMultipleTable"/> 
            </span>
          </el-form-item>
          <el-form-item label="表格展现形式">
            <el-select
              style="width: 100%"
              v-model="obj.model.formData.display"
              placeholder="请选择"
            >
              <el-option
                v-for="item in tableDisplay"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="父级字段"
            v-if="
              obj.model.formData.display &&
              obj.model.formData.display === 'tree'
            "
          >
            <el-select
              style="width: 100%"
              v-model="obj.model.formData.parentField"
              placeholder="请选择"
            >
              <el-option
                v-for="t of selectedEntity.fields"
                :key="t.id"
                :value="t.dictionaryItem.engNameShort"
                :label="t.dictionaryItem.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合并行">
            <el-select
              style="width: 100%"
              value-key="id"
              filterable
              multiple
              v-model="
                obj.model.formData.tableAssignRow &&
                obj.model.formData.tableAssignRow.fields
              "
            >
              <el-option
                v-for="t of selectedEntity.fields"
                :key="t.id"
                :value="t"
                :label="t.dictionaryItem.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="表格提示">
        <el-radio-group v-model="obj.model.formData.tableTip && obj.model.formData.tableTip.type">
          <el-radio value="text" label="text">文本</el-radio>
          <el-radio value="proto" label="proto">字段</el-radio>
          <el-radio value="custom" label="custom">自定义组件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提示内容">
        <el-select
          placeholder="请选择（文本/字段/组件）"
          :getPopupContainer="getParentWindow"
          v-model="obj.model.formData.tableTip && obj.model.formData.tableTip.content"
        >
          <el-option value="text" label="文本"> 文本 </el-option>
          <el-option value="proto" label="字段"> 字段 </el-option>
          <el-option value="custom" label="自定义组件"> 自定义组件 </el-option>
        </el-select>
      </el-form-item> -->
        </div>

        <div class="sub-title" style="margin-top:1px" >
          <span
            ><i
              :class="filterShow[3] ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click="caretBottomClick(3)"
            />分组菜单：</span
          >
        </div>
        <div v-show="filterShow[3]">
          <el-form-item label="分组菜单字段">
            <el-select
              style="width: 100%"
              :getPopupContainer="getParentWindow"
              v-model="obj.model.formData.groupMenu && obj.model.formData.groupMenu.menuProto"
              filterable
            >
              <el-option
                v-for="(itemi, indexi) in selectedEntity &&
                selectedEntity.fields"
                :key="indexi"
                :value="
                  itemi.dictionaryItem && itemi.dictionaryItem.engNameShort
                "
                :label="itemi.dictionaryItem && itemi.dictionaryItem.name"
                :disabled="
                  obj.model.formData.filter.some((i) => i.id === itemi.id)
                "
              >
                {{ itemi.dictionaryItem && itemi.dictionaryItem.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="展现形式">
            <el-select
              style="width: 100%"
              v-model="obj.model.formData.groupMenu.displayType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in representations"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="次数据实体">
            <entity-select
              :schema-type="groupTypeEntity"
              :value.sync="obj.model.formData.groupMenu.secondId"
              :wid="obj.model.wid + '-' + 'groupMenu'"
              mode="id"
              @handleChange="secondEntityChange"
            ></entity-select>
          </el-form-item>
          <el-form-item label="父级关联字段(列表结构数据转树形结构)">
            <el-select
              style="width: 50%"
              v-model="obj.model.formData.groupMenu.childRelField"
              placeholder="唯一标识字段"
              filterable
            >
              <el-option
                v-for="itemi in secondEntity.fields"
                :key="itemi.id"
                :value="
                  itemi.dictionaryItem && itemi.dictionaryItem.engNameShort
                "
                :label="itemi.dictionaryItem && itemi.dictionaryItem.name"
              >
                {{ itemi.dictionaryItem && itemi.dictionaryItem.name }}
              </el-option>
            </el-select>
            <el-select
              style="width: 50%"
              v-model="obj.model.formData.groupMenu.parentRelField"
              placeholder="上级关联字段"
              filterable
            >
              <el-option
                v-for="itemi in secondEntity.fields"
                :key="itemi.id"
                :value="
                  itemi.dictionaryItem && itemi.dictionaryItem.engNameShort
                "
                :label="itemi.dictionaryItem && itemi.dictionaryItem.name"
              >
                {{ itemi.dictionaryItem && itemi.dictionaryItem.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联字段匹配（与次数据实体联动）">
            <el-select
              style="width: 50%; margin-bottom: 20px"
              placeholder="数据实体字段"
              :getPopupContainer="getParentWindow"
              v-model="obj.model.formData.groupMenu && obj.model.formData.groupMenu.menuProto"
              filterable
            >
              <el-option
                v-for="(itemi, indexi) in selectedEntity &&
                selectedEntity.fields"
                :key="indexi"
                :value="
                  itemi.dictionaryItem && itemi.dictionaryItem.engNameShort
                "
                :label="itemi.dictionaryItem && itemi.dictionaryItem.name"
                :disabled="
                  obj.model.formData.filter.some((i) => i.id === itemi.id)
                "
              >
                {{ itemi.dictionaryItem && itemi.dictionaryItem.name }}
              </el-option>
            </el-select>
            <el-select
              style="width: 50%"
              placeholder="次数据实体字段"
              :getPopupContainer="getParentWindow"
              v-model="obj.model.formData.groupMenu.secondProto"
              filterable
            >
              <el-option
                v-for="itemi in secondEntity.fields"
                :key="itemi.id"
                :value="
                  itemi.dictionaryItem && itemi.dictionaryItem.engNameShort
                "
                :label="itemi.dictionaryItem && itemi.dictionaryItem.name"
              >
                {{ itemi.dictionaryItem && itemi.dictionaryItem.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- codelessDialogCtn -->
    <!-- <el-dialog
      top="15vh"
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :close-on-click-modal="false"
      @close="dialogClose"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        maxHeight="550px"
        @confirm="dialogSubmit"
        @cancel="dialogInfo.visible = false"
        @close="dialogInfo.visible = false"
      >
        <template v-slot:dialogContent>
          <component
            ref="dialog"
            :is="dialogInfo.component"
            :params="dialogInfo.params"
            @handleSubmit="handleSubmit"
          />
        </template>
        <div class="flex items-center justify-between" slot="title">
          <span>{{ dialogInfo.title }}</span>
        </div>
      </codeless-dialog-ctn>
    </el-dialog> -->
  </div>
</template>

<script>
import prototypeConfig from "./components/prototypeConfig.vue";
import BtnForm from "./components/btnForm.vue";
import TableOprForm from "./components/tableOprForm.vue";

// import entitySelect from "@/views/codeLess/components/entitySelect";

const {
  v2AInput,
} = window.codelessUtils;
import pck from "./package.json";
export default {
  mixins: [window.codelessMixins.customDialog, window.codelessMixins.vRegister, window.codelessMixins.entityAuthorities, window.codelessMixins.pageList],
  _options: pck.docs,
  name: "v2AFormSearchEdit",
  provide() {
    return {
      formSearch: this,
    };
  },
  inject: [ 'root' ],
  components: {
    prototypeConfig,
    BtnForm,
    TableOprForm,
    // entitySelect,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
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
  data() {
    return {
      schemaType: pck.docs.schemaType,
      filterShow: [true, true, true, true],
      selectShow: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 4 },

      config: {
        entityId: "",
        name: "",
        desc: "",
        filter: [],
        groupMenu: {
          menuProto: "",
          displayType: "",
          secondId: {
            fields: [],
          },
          mainProto: "",
          secondProto: "",
          childRelField: {},
          parentRelField: {},
        },
        tableAssignRow: {
          fields: [],
        },
        tablePro: [],
        tableOpr: [],
        tableTip: {
          type: "text",
          content: "",
        },
        opr: [],
      },
      filterIds: [],
      tableProIds: [],

      selectedEntity: {},
      dicts: [],

      representations: [
        {
          label: "无",
          value: "",
        },
        {
          label: "树",
          value: "ALCAP_LIST:tree",
        },
        {
          label: "树（分页数据）",
          value: "ALCAP_PAGEING:tree",
        },
        {
          label: "列表",
          value: "ALCAP_LIST:list",
        },
        // {
        //   label: "标签页",
        //   value: "ALCAP_LIST:tab",
        // },
        {
          label: "分页",
          value: "ALCAP_PAGEING:page",
        },
      ],

      tableOpr: [
        {
          color: "",
          entityId: {},
          icon: "",
          name: "编辑",
          opr: {},
          target: {},
          type: {
            label: "实体操作",
            value: "dataEntityMethod",
          },
          value: "",
        },
      ],

      visibleFilter: false,
      visibleTablePro: false,
      visibleTableOpr: false,
      dropdownShow: false,

      v2AInput,

      dialogInfo: {
        title: "标题",
        // visible: false,
        width: "50%",
        params: {},
        component: "",
      },

      tableDisplay: [
        {
          label: "无",
          value: "",
        },
        {
          label: "树",
          value: "tree",
        },
      ],

      secondEntity: {
        fields: [],
      },

      editComponent: 'formSearch',

      // 分页字段 [ 'pageNum', 'pageSize', 'totalElements' ],
      ppts: [
        {
          type: 'data_source',
          name: 'pageNum',
          title: '页数'
        },
        // {
        //   type: 'data_source',
        //   name: 'totalElements',
        //   title: '总数'
        // },
        {
          type: 'data_source',
          name: 'pageSize',
          title: '每页数量'
        },
      ]
    };
  },
  async created() {
    const ctx = this;
    console.log("创建时", ctx.obj);
    if (!ctx.obj.model.formData.hasOwnProperty("filter")) {
      ctx.obj.model.formData = ctx.config;
    } else {
      if(!ctx.obj.model.formData.entityId.id && !ctx.obj.model.formData.entityId) return;
      ctx.selectedEntity = await pipe.entity.getEntityDetail(
        ctx.obj.model.formData.entityId.id || ctx.obj.model.formData.entityId
      );
      if (!ctx.selectedEntity) return;
      console.log("字段", ctx.selectedEntity);
      ctx.$set(
        ctx.selectedEntity,
        "tablePro",
        JSON.parse(JSON.stringify(ctx.selectedEntity.fields))
      );
      ctx.filterIds = ctx.obj.model.formData.filter;
    }

    // 兼容旧的页面数据

    if (!ctx.obj.model.formData.hasOwnProperty("tableAssignRow")) {
      this.$set(ctx.obj.model.formData, "tableAssignRow", {
        fields: [],
      });
    }

    console.log("formData -> ", ctx.obj.model.formData);
  },
  mounted() {
    console.log("obj -> ", this.obj);
    console.log("item -> ", this.item);
  },
  computed: {
    groupTypeEntity() {
      const ctx = this;
      if (ctx.obj.model) {
        if (ctx.obj.model.formData.groupMenu.displayType.indexOf(":") > -1) {
          return ctx.obj.model.formData.groupMenu.displayType.substring(
            0,
            ctx.obj.model.formData.groupMenu.displayType.indexOf(":")
          );
        } else {
          return ctx.obj.model.formData.groupMenu.displayType || "";
        }
      }
    },
  },
  methods: {
    dialogSubmit() {
      this.$refs.dialog.onSubmit();
    },
    caretBottomClick(index) {
      const ctx = this;
      ctx.$set(ctx.filterShow, index, !ctx.filterShow[index]);
    },
    secondEntityChange(e) {
      this.secondEntity = e;
    },
    getParentWindow(triggerNode) {
      return triggerNode.parentNode;
    },
    entityChange(e, isReady) {
      const ctx = this;
      let selectedEntity = e;

      if (selectedEntity) {
        ctx.selectedEntity = selectedEntity;
        ctx.$set(
          ctx.selectedEntity,
          "tablePro",
          JSON.parse(JSON.stringify(ctx.selectedEntity.fields))
        );
        console.log("选中的实体：", ctx.selectedEntity);
        /*=========处理过滤字段===============*/
        ctx.obj.model.formData.wid = ctx.obj.model.wid;
        if ([ ...ctx.filterIds ].length > 0) {
          ctx.delChildrenComp([ ...ctx.filterIds ], ctx.obj.model.wid);
          ctx.delEntityInPageContent(ctx.obj.model.wid, true);
          ctx.delPageInPageContent(ctx.obj.model.wid);
        }
        ctx.filterIds = ctx.selectedEntity.fields
          .map((i) => {
            if (i.primaryKey === "1") {
              ctx.$set(ctx.obj.model.formData, "primaryField", {
                id: i.id,
                engNameShort: i.dictionaryItem.engNameShort,
              });
            }
            if (!i.hasOwnProperty("component") || !i.component) {
              return {
                ...i,
                component: { ...ctx.v2AInput },
                wid: new Date().valueOf() + ((Math.random() * 100000) | 0)
              };
            } else {
              return i;
            }
          })
          .slice(0, 5);
        /*=========处理表格===============*/
        ctx.fieldsChange(ctx.filterIds, isReady);
        ctx.tableProIds = ctx.selectedEntity.tablePro
          .map((i) => {
            return {
              ...i,
              component: {},
            };
          })
          .slice(0, 5);

        ctx.tableProChange(ctx.tableProIds, isReady);

        /*=========处理事件===============*/

        ctx.operatorChange(
          {
            addUrl: ctx.selectedEntity.addUrl,
            deleteUrl: ctx.selectedEntity.deleteUrl,
            updateUrl: ctx.selectedEntity.updateUrl,
          },
          isReady
        );

        if(ctx.selectedEntity.type === 'data_source') {
          ctx.ppts.forEach(ppt=> {
            ctx.$set(ctx.obj.model.formData, ppt.name, ppt.name)
          })
        }

        console.log('ctx.obj.model.formData', ctx.obj.model.formData);
      }

      console.log(this.obj);
    },
    operatorChange(config, isReady) {
      if (!isReady) return;
      const template = {
        name: "",
        icon: "",
        color: "#3698F2",
        type: {
          label: "方法调用",
          value: "publicMethod",
        },
        entityId: {},
        opr: {
          name: "打开页面",
          id: "open",
        },
        target: {
          label: "无",
          value: "0",
        },
        page: {
          cover: "",
          path: "",
          label: "",
          name: "",
        },
      };
      let tableOpr = [];
      let opr = [];
      if (config.addUrl) {
        opr.push({
          ...template,
          name: "新增",
          icon: "icon-dengji",
          opr: {
            url: config.addUrl,
          },
        });
      }

      if (config.updateUrl) {
        tableOpr.push({
          ...template,
          name: "修改",
          target: {
            label: "选中对象",
            value: "1",
          },
          opr: {
            url: config.updateUrl,
          },
        });
      }
      if (config.deleteUrl) {
        tableOpr.push({
          ...template,
          name: "删除",
          target: {
            label: "选中对象",
            value: "1",
          },
          opr: {
            url: config.deleteUrl,
          },
        });
      }
      this.obj.model.formData.opr = opr;
      this.obj.model.formData.tableOpr = tableOpr;
    },

    fieldsSplice(itemi, type = "filter") {
      const ctx = this;
      if (ctx.obj.model.formData[type].some((i) => i.id ? i.id === itemi.id : i.wid === itemi.wid)) {
        itemi = ctx.obj.model.formData[type].find(i => i.id ? i.id === itemi.id : i.wid === itemi.wid);
        if (itemi.entityId) {
          ctx.delEntityInPageContent(ctx.obj.model.wid + '-' + itemi.wid);
        }
        if (itemi.page?.prototypeId) {
          ctx.delPageInPageContent(ctx.obj.model.wid + '-' + itemi.wid);
        }
        if (type === "filter" || type === "tablePro") {
          ctx.delChildrenComp([ itemi ], ctx.$parent.model.wid);
        }
        ctx.obj.model.formData[type].splice(
          ctx.obj.model.formData[type].findIndex((i) => i.id ? i.id === itemi.id : i.wid === itemi.wid),
          1
        );
      } else if (
        !ctx.obj.model.formData[type].some((i) => i.id === itemi.id) &&
        type !== "tableOpr"
      ) {
        ctx.obj.model.formData[type].push({
          ...itemi,
          component: itemi.component || { ...ctx.v2AInput },
          wid: new Date().valueOf() + ((Math.random() * 100000) | 0)
        });
      }
      

     
    },
    fieldsChange(e, isReady) {
      const ctx = this;
      let filter = e;
      if (isReady) ctx.obj.model.formData.filter = filter;
    },
    tableProSplice(itemi) {
      const ctx = this;
      if (ctx.obj.model.formData.tablePro.some((i) => i.id === itemi.id)) {
        ctx.obj.model.formData.tablePro.splice(
          ctx.obj.model.formData.tablePro.findIndex((i) => i.id === itemi.id),
          1
        );
      } else {
        ctx.obj.model.formData.tablePro.push({
          ...itemi,
          component: {},
        });
      }
    },
    tableProChange(e, isReady) {
      const ctx = this;
      let filter = [];
      filter = e.map((i) => {
        return {
          ...i,
          component: "文本",
        };
      });

      if (isReady) ctx.obj.model.formData.tablePro = filter;
    },
    tableOprSplice(itemi) {
      const ctx = this;
      if (ctx.obj.model.formData.tableOpr.some((i) => i.name === itemi.name)) {
        ctx.obj.model.formData.tableOpr.splice(
          ctx.obj.model.formData.tableOpr.findIndex(
            (i) => i.name === itemi.name
          ),
          1
        );
      } else { 
        ctx.obj.model.formData.tableOpr.push(itemi);
      }
    },
    tableOprChange(e) {
      const ctx = this;
      let filter = [];
      for (let index = 0; index < e.length; index++) {
        filter = [
          ...filter,
          ...ctx.tableOpr.filter((i) => i.name === e[index]),
        ];
      }
      ctx.obj.model.formData.tableOpr = filter;
    },

    // 添加操作按钮
    openForm(type) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let params = { entity: ctx.selectedEntity, argsArr: ctx.root.argsArr, fields: ctx.selectedEntity.fields, editComponent: ctx.editComponent };
      ctx.openCustomDialog({
         path:`${type}Form`,
         title: `创建/编辑${type === "Btn" ? "按钮" : "模块"}`,
           width: "70%",
           propsData:{
             params
           },
          component:ctx.$options.components[`${type}Form`],
          beforeConfirm:($_dontCare,$el)=>{
             return  $el.onSubmit(ctx.handleSubmit)
          }
      })
      // ctx.dialogInfo.visible = true;
      // ctx.$nextTick(() => {
      //   ctx.$refs.dialog.$refs.form.resetFields();
      // });

    },
    handleSubmit(type, form) {
      const ctx = this;
      if (!form.wid) form.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      ctx.obj.model.formData[type === "Btn" ? "opr" : "tableOpr"].push(form);
      console.log("新增后的", form);
      // ctx.dialogInfo.visible = false
    },
    // 弹窗关闭
    dialogClose() {
      const ctx = this;
      // ctx.$refs.dialog.$refs.form.resetFields();
    },

    handleFilterClick(e) {},
    formConfig(form, index, name) {
      const ctx = this;
      if (!form.wid) form.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      ctx.$set(ctx.obj.model.formData[name], index, form);
      ctx.$forceUpdate();
      console.log(name, ctx.obj.model.formData[name]);
    },
    filterOption(value, option) {
      return option.componentOptions.children[0].text?.indexOf(value) >= 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-form-search-edit {
  width: 100%;
  box-sizing: border-box;
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
</style>
