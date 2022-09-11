<template>
  <div class="v2-a-work-chart-edit">
    <div class="flex-center margin-top-8">
      <span class="config-title">数据实体</span>
      <entity-select
        mode="id"
        :immedHandle="true"
        style="width: 180px"
        class="margin-left-8"
        schema-type="ALCAP_PAGEING"
        :value.sync="obj.model[item.name].entityId"
        :wid="obj.model.wid"
        @handleChange="entityChange"
      />
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">类型</span>
      <el-radio-group v-model="obj.model[item.name].fields.chartType" size="medium">
        <el-radio-button label="line">折线</el-radio-button>
        <el-radio-button label="bar">柱状</el-radio-button>
        <el-radio-button label="pie">饼图</el-radio-button>
      </el-radio-group>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">维度</span>
      <mutiSelect
        :options="fields"
        :quote="quote"
        class="margin-left-8"
        style="width: 180px"
        v-model="obj.model[item.name].fields.xAxis"
      >
      </mutiSelect>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">指标</span>
      <mutiSelect
        :options="fields"
        class="margin-left-8"
        style="width: 180px"
        v-model="obj.model[item.name].fields.yAxis"
      >
      </mutiSelect>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
import mutiSelect from "./select.vue";

export default {
  _options: pck.docs,
  name: "v2AWorkChartEdit",

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
  components: {
    mutiSelect,
  },
  data() {
    return {
      fields: [],
      quote: 'dimension',
    };
  },

  methods: {
    entityChange(e) {
      this.getSchemasAndFields(e.fields);
    },
    getSchemasAndFields(fields) {
      let Ary = fields;
      let newAry = [];
      Ary.forEach((item) => {
        newAry.push({
          name: item.dictionaryItem.name,
          value: item.dictionaryItem.engNameShort,
        });
      });
      this.fields = newAry;
    }
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-notice-edit {
  padding-bottom: 16px;
}

.config-title {
}

.flex-center {
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: space-between;
}

.margin-top-8 {
  margin-top: 15px;
}
.margin-left-8 {
  margin-left: 8px;
}
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 10px;
  right: -10px;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
.el-checkbox__inner {
  display: none;
}
</style>
