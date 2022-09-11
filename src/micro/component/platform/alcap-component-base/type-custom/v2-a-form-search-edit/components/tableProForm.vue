<template>
  <div class="prototype-edit">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      size="mini"
      label-suffix="："
    >
      <el-form-item label="表头名">
        <el-input
          v-model="form.dictionaryItem && form.dictionaryItem.name"
          style="width: 270px"
        />
      </el-form-item>
      <el-form-item label="展现字段">
        <el-input
          v-model="form.dictionaryItem && form.dictionaryItem.engNameShort"
          placeholder="请选择字段"
          :disabled="true"
          style="width: 270px"
        />
      </el-form-item>
      <el-form-item label="组件">
        <el-select
          v-model="form.component"
          :getPopupContainer="getParentWindow"
          style="width: 270px"
          value-key="href"
        >
          <el-option
            v-for="item in componentList"
            :key="item.href"
            :value="item"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        :label="code.desp"
        v-for="code in form.component && form.component.option &&
        form.component.option.filter((i) => i.codeLessType)"
        :key="code.name"
      >
        <code-less-config :form="form" :custEntity="params.entity" :codeLessType="code.codeLessType" :code="code"/>
      </el-form-item> -->

      <code-less-config
        :form="form"
        :custEntity="params.entity"
        :codeLessType="code.codeLessType"
        :code="code"
        :current-args-arr="params.argsArr"
        v-for="code in codeLessTypeOption"
        :key="code.name"
      />
      <!-- 
      <el-form-item label="传递数据">
        <el-select  v-model="form.compParam" style="width: 270px" filterable multiple size="mini">
            <el-option :value="item.dictionaryItem && item.dictionaryItem.engNameShort" :label="item.dictionaryItem && item.dictionaryItem.name" v-for="item in params.entity.fields || []" :key="item.id">
                {{ item.dictionaryItem && item.dictionaryItem.name }}
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="绑定数据">
        <sync-param style="width: 270px" :target-params="params.argsArr" :value.sync="form.syncParam" />
      </el-form-item> -->

      <el-form-item label="格式转换">
        <el-select
          style="width: 270px"
          v-model="form.format"
          placeholder="请选择格式"
          @change="formatChange"
        >
          <el-option
            :value="key"
            :label="item.desc"
            v-for="(item, key) in tableDataFilter"
            :key="key"
          >
            {{ item.desc }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="字典" v-if="form.format === 'dict'">
        <tree-select
          style="width: 270px"
          :options="categoriesTree"
          :value.sync="form.code"
          :props="props"
        />
      </el-form-item>
      <el-form-item label="是否固定">
        <el-switch v-model="form.isFixed"> </el-switch>
      </el-form-item>
      <el-form-item label="是否排序">
        <el-switch v-model="form.sortable"> </el-switch>
      </el-form-item>

      <!-- <el-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <div class="flex items-center">
          <span class="flex items-center justify-center w-16 h-7 rounded-full cursor-pointer bg-gradient-primary text-white text-xs hover:opacity-75 mr-4" @click="onSubmit">保存</span>
          <span class="flex items-center justify-center w-16 h-7 rounded-full cursor-pointer bg-white text-gray-500 border border-gray-500 text-xs hover:opacity-75" @click="cancel">取消</span>
        </div>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import codeLessConfig from "./codeLessConfig.vue";
// import treeSelect from '@/views/codeLess/components/treeSelect'
// import syncParam from "@/views/codeLess/components/syncParam";
export default {
  components: {
    codeLessConfig,
    // treeSelect,
    // syncParam
  },
  name: "tableProForm",
  props: ["params", "title"],
  data() {
    return {
      form: {
        desc: "",
        key: "",
        component: {},
        page: {},
      },
      component: {},

      entities: [
        {
          label: "选项一",
          value: "1",
        },
        {
          label: "选项二",
          value: "2",
        },
      ],
      componentList: [
        {
          name: "无",
        },
      ],

      categoriesTree: [],

      props: {
        value: "code", // ID字段名
        label: "name", // 显示名称
        children: "childs", // 子级字段名
      },
    };
  },
  computed: {
    tenantId() {
      return this.$store.getters["user/tenantId"];
    },
    tenantList() {
      return this.$store.state.user.tenantList;
    },
    tableDataFilter() {
      return activator.get("alcap.tableDataFilter");
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
      console.log("codeLessTypeOption", codeLessTypeOption);
      return codeLessTypeOption;
    },
  },
  mounted() {
    const ctx = this;
    // console.log(Vue.options.components);
    ctx.getComponentList();
    console.log(ctx.params);
    if (ctx.params && ctx.params.hasOwnProperty("obj")) {
      ctx.form = {
        ...ctx.params.obj,
      };
      ctx.schemaType = ctx.params.obj.hasOwnProperty("schemaType")
        ? ctx.params.obj.schemaType.id
        : "";
    }
    ctx.getCategoriesTree();
    ctx.$forceUpdate();
  },
  methods: {
    formatChange(e) {
      const ctx = this;
      console.log(e);
      if (e === "timestamp") {
        ctx.$set(ctx.form, "isTimestamp", true);
      } else {
        ctx.$set(ctx.form, "isTimestamp", false);
      }
    },
    enumCodeChange(v) {
      this.$set(this.form, "code", v);
    },
    // 枚举值树结构
    async getCategoriesTree() {
      const { tree } = window.getBffApi();
      const res = await tree('code');
      if (res.childs) {
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
        console.log("this.categoriesTree", this.categoriesTree);
      } else {
        this.categoriesTree = [];
      }
    },
    // 页面选择
    choosePage(e) {
      const ctx = this;
      // ctx.form.page = e;
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
          // ctx.$emit('handleSubmit', "tablePro", form)
          handlerSubmit("tablePro", form);
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
    getComponentList() {
      const ctx = this;
      let comps = pipe.component.getComponentList('table');
      ctx.componentList = [ ...ctx.componentList, ...comps ]
      console.log("组件列表", ctx.componentList);
    },
  },
};
</script>

<style lang="less" scoped></style>
