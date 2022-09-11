<template>
  <!-- codelessDialogCtn -->
  <el-dialog
    top="15vh"
    :title="dialogInfo.title"
    :visible.sync="dialogInfo.visible"
    :width="dialogInfo.width"
    :modal-append-to-body="false"
    :show-close="false"
    :close-on-click-modal="false"
    @close="dialogClose"
    :append-to-body="true"
    custom-class="no-header-and-footer-dialog"
    v-if="JSON.stringify(searchForm) !== '{}'"
  >
    <codeless-dialog-ctn
      @confirm="submitForm"
      @cancel="dialogInfo.visible = false"
      @close="dialogInfo.visible = false"
    >
      <template v-slot:dialogContent>
        <el-form
          ref="ruleForm"
          label-width="130px"
          label-position="right"
          size="mini"
          label-suffix="："
          :model="searchForm"
          :rules="rules"
        >
          <el-form-item
            :prop="item.dictionaryItem.engNameShort"
            :label="item.dictionaryItem && item.dictionaryItem.name"
            v-for="item in computedForms"
            :key="item.id"
          >
            <el-input v-model="searchForm[item.dictionaryItem.engNameShort]" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <div class="flex items-center justify-between" slot="title">
        <span>{{ dialogInfo.title }}</span>
      </div>
    </codeless-dialog-ctn>
  </el-dialog>
</template>

<script>
export default {
  name: "searchForm",
  props: {
    dialogInfo: {
      type: Object,
      default: () => {
        return {
          title: "新建",
          visible: false,
          width: "70%",
          fields: [],
          form: {},
          entity: {}
        };
      },
    },
  },
  data() {
    return {
      searchForm: {},
      rules: {},
    };
  },
  mounted() {
    const ctx = this;
  },
  watch: {
    "dialogInfo.visible": {
      handler(n, o) {
        const ctx = this;
        if (n) {
          ctx.init();
        } else {
          ctx.searchForm = {};
        }
      },
    },
  },
  computed: {
    computedForms() {
      const ctx = this;
      return ctx.dialogInfo.fields;
    },
  },
  methods: {
    // 联动
    componentValue(e, item) {
      console.log(e, item);
      const ctx = this;
      if (item.cascader && item.cascader.length > 0) {
        item.cascader.forEach((cas) => {
          if (cas.config === "3") {
            ctx.searchForm[cas.entityField] = e[cas.compField];
          }
        });
      }
    },
    // 提交表单
    submitForm() {
      const ctx = this;
      ctx.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log("提交的表单", ctx.searchForm);
          ctx.$emit("submit", ctx.searchForm, ctx.dialogInfo.operationType);
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
    // 弹窗关闭
    dialogClose() {
      const ctx = this;
      ctx.$refs.ruleForm.resetFields();
    },
    async init() {
      const ctx = this;
      ctx.searchForm = {};
      ctx.rules = {};

      let entity = ctx.dialogInfo.entity

      ctx.dialogInfo.fields.forEach((form) => {
        entity.fields.forEach((field) => {
          if (form.dictionaryItem.engNameShort === field.name) {
            console.log(form.type, field.type);
            form.type = field.type;
            form.id = field.id;
            form.dictionaryItem.validations = field.validations || [];
          }
        });
      });
      ctx.dialogInfo.fields.map((i) => {
        ctx.$set(ctx.rules, i.dictionaryItem.engNameShort, []);
        if (!i.dictionaryItem.validationRuleType) {
          ctx.rules[i.dictionaryItem.engNameShort].push({
            required: false,
          });
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
              trigger: "change",
              type: i.type,
            });
          });
        }

        if (Reflect.ownKeys(ctx.dialogInfo.form).length > 0) {
          for (const key in ctx.dialogInfo.form) {
            if (i.dictionaryItem.engNameShort === key) {
              ctx.$set(
                ctx.searchForm,
                i.dictionaryItem.engNameShort,
                ctx.dialogInfo.form[key]
              );
            }
          }
        } else {
          ctx.$set(ctx.searchForm, i.dictionaryItem.engNameShort, "");
        }
        // if (ctx.dialogInfo.operationType === "create") {
        //   ctx.$set(ctx.searchForm, i.dictionaryItem.engNameShort, "");
        // }
      });

      console.log("表单规则：", ctx.rules);
      console.log("表单内容：", ctx.searchForm);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>