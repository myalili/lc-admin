<template>
  <el-form-item
    :label="code.desp"
    style="min-height: 28px"
    class=""
    v-if="isShow"
  >
    <div v-if="codeLessType && code.type === 'string_select'">
      <el-radio-group
        v-model="form.component[code.name]"
        v-if="code.valueArray.length < 4"
        size="mini"
        @change="handleChange"
      >
        <el-radio-button
          :label="item"
          :value="item"
          v-for="(item, index) in code.valueArray"
          :key="item"
        >
          {{ code.despArray[index] }}
        </el-radio-button>
      </el-radio-group>
      <el-select
        v-model="form.component[code.name]"
        placeholder="请选择"
        v-else
        style="width: 270px"
        @change="handleChange"
      >
        <el-option
          v-for="(item, index) in code.valueArray"
          :value="item"
          :label="code.despArray[index]"
          :key="item"
        >
          {{ code.despArray[index] }}
        </el-option>
      </el-select>
    </div>

    <!-- 实体选择 -->
    <entity-select
      :schema-type="form.component.schemaType"
      :value.sync="form.entityId"
      mode="id"
      @handleChange="entityChange"
      v-if="codeLessType === 'dto'"
      style="width: 270px"
    />
    <!-- 字段 -->
    <el-select
      v-model="form.component[codeLessType]"
      :placeholder="`选择${code.desp}字段`"
      v-if="code.type === 'string_label'"
      style="width: 270px"
      filterable
    >
      <el-option
        v-for="item in entityOptions.fields"
        :value="item.dictionaryItem.engNameShort"
        :label="item.dictionaryItem.name"
        :key="item.id"
      ></el-option>
    </el-select>

    <!-- <el-select
      v-model="form.component.labelValue"
      placeholder="选择字段"
      v-if="codeLessType === 'labelValue'"
      style="width: 270px"
    >
      <el-option
        v-for="item in entityOptions.fields"
        :value="item.dictionaryItem.engNameShort"
        :label="item.dictionaryItem.name"
        :key="item.id"
      ></el-option>
    </el-select> -->

    <!-- 枚举 -->
    <tree-select
      style="width: 270px"
      v-if="codeLessType === 'enum'"
      :options="categoriesTree"
      :value.sync="form.enumCode"
      :accordion="isAccordion"
      :props="props"
    />

    <!-- 页面 -->
    <span class="" v-if="codeLessType === 'page'">
      <page-select :value.sync="form.page" @select="choosePage" width='270px'/>
    </span>

    <!-- 页面参数 -->
    <div class="" v-if="codeLessType === 'syncParam'">
      <codeless-page-data-binding
        :value.sync="form.syncParams"
        :current-args-arr="currentArgsArr"
        :args-arr="argsArr"
        :component-params="componentParams"
        :componentName="componentName"
      />
    </div>
  </el-form-item>
</template>

<script>
export default {
  components: {},
  props: [
    "form",
    "codeLessType",
    "custEntity",
    "dataSource",
    "code",
    "currentArgsArr",
  ],
  reject: ["formSearch"],
  data() {
    return {
      categoriesTree: [],
      entity: {
        fields: [],
      },
      props: {
        value: "code", // ID字段名
        label: "name", // 显示名称
        children: "childs", // 子级字段名
      },
      changeObj: {},

      argsArr: [],
    };
  },

  computed: {
    isShow() {
      if (this.codeLessType === "label" || this.codeLessType === "labelValue" || this.codeLessType === "parentId") {
        if (this.entity.type === "db") {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    tenantId() {
      return this.$store.getters["user/tenantId"];
    },
    tenantList() {
      return this.$store.state.user.tenantList;
    },
    entityOptions() {
      return this.custEntity || this.entity;
    },
    componentParams() {
      const ctx = this;
      const fields = ctx.entityOptions.fields.map((i) => {
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
    componentName() {
      return '查询表格组件'
    }
  },
  watch: {
    // "form.page": {
    //   async handler(n) {
    //     let res = await this._getMenu(n.id);
    //     msgHub.$emit("argsArrChange", res.argsArr);
    //   },
    //   immediate: true,
    // },
  },
  created() {
    this.msgHubOn();
  },

  async mounted() {
    if (this.codeLessType === 'enum') {
      await this.getCategoriesTree();
      this.$set(this.form, "enumCode", this.form.code);
    }
    if (this.codeLessType === 'dto') {
      this.entity = await pipe.entity.getEntityDetail(this.form.entityId);
      if (!this.entity) return;
      msgHub.$emit("entityFields", this.entity);
    }
  },

  methods: {
    msgHubOn() {
      const ctx = this;
      msgHub.$on("entityFields", (entity) => {
        ctx.entity = entity;
      });
      if (
        ctx.codeLessType === "handleChange" &&
        ctx.code.type === "string_select"
      ) {
        msgHub.$emit("sourceChange", ctx.code);
      }
      msgHub.$on("sourceChange", (code) => {
        ctx.$set(ctx.form, "changeType",  ctx.form.changeType || code.defaultValue);
        ctx.$set(ctx.form, "valueArray", code.valueArray);
      });
      msgHub.$on("argsArrChange", (argsArr) => {
        ctx.argsArr = argsArr;
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
      });
    },
    getPageInfo(pageContent) {
      const ctx = this;
      msgHub.$emit("argsArrChange", pageContent.argsArr);
    },
    // 切换
    handleChange(e) {
      if (this.codeLessType === "handleChange") {
        this.form.changeType = e;
        this.form.valueArray = this.code.valueArray;

        this.form[this.form.valueArray.find((i) => i !== e)] = null;
        if (e === "enumCode") {
          this.entityChange({});
        }
      }
    },
    // 页面选择
    async choosePage(e) {
      console.log('choosePage',e)
      const ctx = this;

      let pageContent = {
        argsArr:[]
      }
      if(e.pageContent){
        pageContent = JSON.parse(e.pageContent)
      }
      this.getPageInfo(pageContent)
      // ctx.form.page = e;
    },

    // 实体改变
    entityChange(e) {
      msgHub.$emit("entityFields", e);
    },

    // 枚举值树结构
    async getCategoriesTree() {
      const { tree } = window.getBffApi();
      const res = await tree("code");
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
