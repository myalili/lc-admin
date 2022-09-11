<template>
  <div class="text-form">
    <codeless-form-config
      :form-data="content"
      :params="params"
      @submit="submit"
      :AParams="AParams"
    />
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AFormConfig",
  components: {},
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
      config: {
        entityId: "",
        name: "",
        desc: "",
        hasSteps: false,
        forms: [
          {
            value: "",
            component: {
              href: "v2-a-input",
              name: "输入框",
            },
            dictId: "",
            dictionaryItem: {
              id: "",
              name: "姓名",
              desc: null,
              engNameShort: "",
              validationRuleType: {
                categoryId: "",
                desc: "",
                id: "",
                name: "",
                validations: [],
              },
            },
            id: "",
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
          },
        ],
        wid: new Date().valueOf() + ((Math.random() * 100000) | 0)
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    content() {
      const ctx = this;
      let pageDef = this.formData || {};

      if (!pageDef || JSON.stringify(pageDef) === "{}") {
        pageDef = ctx.config;
      }
      return pageDef;
    },
  },
  watch: {},
  methods: {
    submit(e) {
      const ctx = this;
      ctx.$emit("submit");
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
}
</style>
