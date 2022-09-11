<template>
  <div class="text-form">
    <codeless-form-config
      :form-data="content.content"
      :params="params"
      @submit="submit"
      :AParams="AParams"
      v-if="isMounted"
      
    />
    <div class="drawer" v-if="edit">
      <v2-a-form-config-edit :obj="{ model: { formData: pageDef.content } }" />
    </div>
  </div>
</template>

<script>
export default {
  mixins: [ window.codelessMixins.vRegister ],
  provide() {
    return {
      root: this,
    };
  },
  props: {
    edit: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    pageDef: {
      type: Object,
      default: () => {
        return {
          children: [ { href: 'v2-a-input' } ]
        };
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
            color: "#3698f2",
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
            color: "#3698f2",
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
      },
      isMounted: false
    };
  },
  mounted() {
    const ctx = this;
    console.log("配置表单页面内容", ctx.pageDef);
  },
  watch: {
    'pageDef.children': {
      deep: true,
      immediate: true,
      async handler(n) {
        console.log("配置表单页面内容:watch", this.pageDef);
        if (!n) {
          await this.getSourceForArr([ { href: 'v2-a-input' } ]);
        }
        if (n && n.length > 0) {
          await this.getSourceForArr(n);
          console.log('当前子组件', n);
        }
        this.isMounted = true;
      }
    },
  },
  computed: {
    content() {
      const ctx = this;
      let pageDef = this.pageDef || {};
      console.log("配置表单页面内容", ctx.pageDef);
      if (!pageDef.content) {
        pageDef.content = ctx.config;
        pageDef.children = pageDef.children || [ { href: 'v2-a-input' } ];
      }
      if (!pageDef.content.wid) {
        pageDef.content.wid = new Date().valueOf() + ((Math.random() * 100000) | 0);
      }
      // console.log(pageDef)
      return pageDef;
    },                
  },
  methods: {
    submit(e) {
      const ctx = this;
      ctx.$emit("submit");
    },
    getPageContent() {
      return this.content;
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
  .page-content {
    width: calc(100% - 366px);
    height: 100%;
    box-sizing: border-box;
    padding-top: 50px;
  }
  .drawer {
    width: 450px;
    margin-top: 5px;
    height: 97.78%;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 18px 18px 9px 18px;
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
</style>

      