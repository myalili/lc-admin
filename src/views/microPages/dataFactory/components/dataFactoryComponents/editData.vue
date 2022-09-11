<template>
  <div class="divide-y">
    <div class="content">
      <div class="content-input flex items-center">
        <label>英文名称</label>
        <el-input
          v-model.trim="name"
          size="mini "
          placeholder="请输入"
        ></el-input>
      </div>
      <div class="content-input flex items-center">
        <label>中文名称</label>
        <el-input
          v-model.trim="desc"
          size="mini "
          placeholder="请输入"
        ></el-input>
      </div>
      <div class="flex items-center" v-show="type === 'data_factory_script'">
        <label class="labelWidth">schemaType</label>
        <schemaType-Select
          class="w-full"
          :schemaType="schemaType"
          @update-schema="updateSchema"
          :schemas="schemas"
        ></schemaType-Select>
      </div>
    </div>
  </div>
</template>

<script>
import schemaTypeSelect from "./schemaTypeSelect.vue";

export default {
  mixins: [window.V8.mixins, window.codelessMixins.customDialog],
  data() {
    return {
      schemaType: "db",
      schemas: [],
      name: "",
      desc: "",
      type: "sql",
      value: "",
      activeName: "second",
    };
  },
  props: ["params"],
  components: {
    schemaTypeSelect,
  },
  mounted() {
    const ctx = this;
    ctx.id = ctx.params.data.id || '';
    ctx.type = ctx.params.type;
    ctx.name = ctx.params.data.name;
    ctx.desc = ctx.params.data.desc;
    ctx.schemas = ctx.params.data.schemas;
  },
  methods: {
    creatData() {
      const ctx = this;
      const confirmParams = {
        name: ctx.name,
        desc: ctx.desc,
        id: ctx.id,
        schemas: ctx.schemas
      };
      this.$root.confirm(confirmParams);
    },
    cancel() {
      this.$root.cancel();
    },
    updateSchema(val) {
      this.schemas = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 10px;
  //   margin-left: 50px;
  margin-right: 80px;
  .content-type {
    margin-bottom: 21px;
    .content-type_title {
      width: 94px;
    }
  }

  .content-input {
    margin-left: 10px;
    margin-bottom: 16px;
    label {
      width: 100px;
    }
  }
}
.footer-button {
  width: 76px;
  margin-top: 12px;
  margin-right: 10px;
}
.el-select-dropdown__item {
  height: 100%;
}
.labelWidth {
  margin-right: 10px;
  width: 105px;
  text-align: left;
  vertical-align: middle;
  float: left;
}
</style>
